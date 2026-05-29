import { config } from "./config.js";

function localSummary(article) {
  const body = Array.isArray(article.body) ? article.body : [];
  return body.slice(0, 2).join(" ").slice(0, 520);
}

function localTags(article) {
  const source = `${article.title} ${article.subtitle} ${(article.body || []).join(" ")}`.toLowerCase();
  const candidates = ["AI", "Cybersecurity", "Cloud", "Startups", "Software", "Hardware", "Gaming", "SEO", "Automation", "Enterprise Tech", "Data Science"];
  return candidates.filter((tag) => source.includes(tag.toLowerCase().split(" ")[0])).slice(0, 6);
}

function localRecommendations(article, articles) {
  const tags = new Set((article.tags || []).map((tag) => tag.toLowerCase()));
  return articles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      const sharedTags = (item.tags || []).filter((tag) => tags.has(tag.toLowerCase())).length;
      const categoryScore = item.category === article.category ? 2 : 0;
      return { item, score: sharedTags + categoryScore };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.views - a.item.views)
    .slice(0, 4)
    .map((entry) => ({ slug: entry.item.slug, title: entry.item.title, reason: "Shared topic, tag, or category signal." }));
}

function fallbackAi(article, articles) {
  const summary = localSummary(article);
  return {
    provider: "local-fallback",
    model: "local",
    summary,
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || article.subtitle || summary.slice(0, 155),
    tags: [...new Set([...(article.tags || []), ...localTags(article)])].slice(0, 8),
    socialHeadline: `${article.title}: what technology leaders need to know`,
    newsletterSubject: article.title.slice(0, 78),
    recommendations: localRecommendations(article, articles)
  };
}

function fallbackNewsroom(payload, context = {}) {
  const text = String(payload.text || payload.body || "").trim();
  const title = String(payload.title || "Technology story").trim();
  const articles = context.articles || [];
  const source = `${title} ${text}`.toLowerCase();
  const tags = [...new Set([
    ...localTags({ title, subtitle: "", body: [text], tags: [] }),
    ...(source.includes("security") ? ["Cybersecurity"] : []),
    ...(source.includes("cloud") ? ["Cloud"] : []),
    ...(source.includes("startup") ? ["Startups"] : []),
    ...(source.includes("video") ? ["Video"] : [])
  ])].slice(0, 8);
  const summary = text ? text.split(/[.!?]\s+/).slice(0, 3).join(". ").slice(0, 520) : `${title} needs a tighter editorial brief, SEO metadata, and audience packaging.`;
  return {
    provider: "local-fallback",
    model: "local",
    task: payload.task || "newsroom",
    summary,
    headlineOptions: [
      title,
      `${title}: what technology leaders need to know`,
      `Inside ${title.toLowerCase()}`
    ],
    seoTitle: title.slice(0, 68),
    seoDescription: (text || summary).slice(0, 155),
    tags,
    socialPosts: [
      `New on Tech Magazine: ${title}`,
      `${title} - the signals, risks, and next steps.`
    ],
    newsletterSubject: title.slice(0, 78),
    translation: payload.targetLanguage ? `[${payload.targetLanguage}] ${text || title}` : "",
    trendSignals: trendSignals(articles),
    recommendations: localRecommendations({ slug: "", category: payload.category || "", tags, title, subtitle: "", body: [text] }, articles)
  };
}

function trendSignals(articles = []) {
  const counts = new Map();
  for (const article of articles) {
    for (const tag of article.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
    if (article.category) counts.set(article.category, (counts.get(article.category) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, score]) => ({ topic, score, reason: "Repeated editorial coverage signal." }));
}

function extractJson(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function callOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.openaiModel,
      instructions: "You are an expert technology magazine editor. Return only compact valid JSON. Do not include markdown.",
      input: prompt,
      text: { format: { type: "json_object" } }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText.slice(0, 220)}`);
  }

  const payload = await response.json();
  const text = payload.output_text || payload.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("") || "";
  return extractJson(text);
}

export async function transcribeAudioAi(audioUrl, { language = "" } = {}) {
  if (!config.openaiApiKey) {
    return { ok: false, transcript: "", provider: "openai", message: "OPENAI_API_KEY is not set." };
  }
  const sourceUrl = new URL(audioUrl, config.siteUrl).toString();
  const audioResponse = await fetch(sourceUrl);
  if (!audioResponse.ok) throw new Error(`Audio fetch failed: ${audioResponse.status}`);
  const audioBlob = await audioResponse.blob();
  if (audioBlob.size > config.maxAudioUploadBytes) {
    throw new Error(`Audio file is larger than the configured transcription limit of ${config.maxAudioUploadBytes} bytes.`);
  }
  const form = new FormData();
  const extension = sourceUrl.split("?")[0].split(".").pop() || "mp3";
  form.append("file", audioBlob, `podcast.${extension}`);
  form.append("model", config.openaiTranscriptionModel);
  form.append("response_format", "json");
  if (language) form.append("language", language);
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.openaiApiKey}` },
    body: form
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI transcription failed: ${response.status} ${errorText.slice(0, 220)}`);
  }
  const payload = await response.json();
  return {
    ok: true,
    transcript: payload.text || "",
    provider: "openai",
    model: config.openaiTranscriptionModel,
    usage: payload.usage || null
  };
}

export async function generateArticleAi(article, articles) {
  const fallback = fallbackAi(article, articles);
  if (!config.openaiApiKey) {
    return { ...fallback, message: "OPENAI_API_KEY is not set, so local fallback suggestions were generated." };
  }

  const prompt = JSON.stringify({
    task: "Generate editorial AI assistance for this technology magazine article.",
    requiredJsonShape: {
      summary: "2-3 sentence reader summary",
      seoTitle: "SEO title under 70 chars",
      seoDescription: "SEO description under 160 chars",
      tags: ["5-8 short tags"],
      socialHeadline: "shareable headline",
      newsletterSubject: "email subject under 80 chars",
      recommendations: [{ slug: "existing article slug", title: "existing title", reason: "short reason" }]
    },
    article: {
      title: article.title,
      subtitle: article.subtitle,
      category: article.category,
      tags: article.tags,
      body: article.body
    },
    availableArticles: articles.filter((item) => item.slug !== article.slug).map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      tags: item.tags
    }))
  });

  try {
    const generated = await callOpenAI(prompt);
    return {
      ...fallback,
      ...generated,
      provider: "openai",
      model: config.openaiModel,
      tags: Array.isArray(generated?.tags) ? generated.tags.slice(0, 10) : fallback.tags,
      recommendations: Array.isArray(generated?.recommendations) ? generated.recommendations.slice(0, 6) : fallback.recommendations
    };
  } catch (error) {
    return { ...fallback, message: error.message };
  }
}

export async function generateNewsroomAi(payload, context = {}) {
  const fallback = fallbackNewsroom(payload, context);
  if (!config.openaiApiKey) {
    return { ...fallback, message: "OPENAI_API_KEY is not set, so local fallback suggestions were generated." };
  }

  const prompt = JSON.stringify({
    task: "Act as an advanced AI newsroom assistant for an international technology magazine.",
    mode: payload.task || "newsroom",
    targetLanguage: payload.targetLanguage || "",
    requiredJsonShape: {
      summary: "2-4 sentence editorial summary",
      headlineOptions: ["3 headline options"],
      seoTitle: "SEO title under 70 chars",
      seoDescription: "SEO description under 160 chars",
      tags: ["6-10 topic tags"],
      socialPosts: ["2 concise social posts"],
      newsletterSubject: "email subject under 80 chars",
      translation: "translated text when targetLanguage is provided",
      trendSignals: [{ topic: "topic", score: 1, reason: "short reason" }],
      recommendations: [{ slug: "existing article slug", title: "existing title", reason: "short reason" }]
    },
    input: {
      title: payload.title,
      text: payload.text,
      category: payload.category,
      task: payload.task
    },
    editorialContext: {
      articles: (context.articles || []).slice(0, 30).map((article) => ({
        slug: article.slug,
        title: article.title,
        category: article.category,
        tags: article.tags,
        views: article.views
      })),
      communityTopics: (context.communityTopics || []).slice(0, 20).map((topic) => ({
        title: topic.title,
        body: topic.body
      }))
    }
  });

  try {
    const generated = await callOpenAI(prompt);
    return {
      ...fallback,
      ...generated,
      provider: "openai",
      model: config.openaiModel,
      headlineOptions: Array.isArray(generated?.headlineOptions) ? generated.headlineOptions.slice(0, 6) : fallback.headlineOptions,
      tags: Array.isArray(generated?.tags) ? generated.tags.slice(0, 12) : fallback.tags,
      socialPosts: Array.isArray(generated?.socialPosts) ? generated.socialPosts.slice(0, 4) : fallback.socialPosts,
      trendSignals: Array.isArray(generated?.trendSignals) ? generated.trendSignals.slice(0, 10) : fallback.trendSignals,
      recommendations: Array.isArray(generated?.recommendations) ? generated.recommendations.slice(0, 8) : fallback.recommendations
    };
  } catch (error) {
    return { ...fallback, message: error.message };
  }
}
