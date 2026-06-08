const bodyField = document.querySelector("[data-editor-body]");
const preview = document.querySelector("[data-editor-preview]");
const imageField = document.querySelector("[name='image']");
let latestAiResult = null;
let autosaveTimer = null;
let autosaveDirty = false;
const autosaveForm = document.querySelector("[data-autosave-form]");
const autosaveStatus = document.querySelector("[data-autosave-status]");
const restoreAutosaveButton = document.querySelector("[data-restore-autosave]");
const clearAutosaveButton = document.querySelector("[data-clear-autosave]");
const autosavePayloadField = document.querySelector("[data-autosave-payload]");
const titleField = document.querySelector("[data-title-field]");
const subtitleField = document.querySelector("[data-subtitle-field]");
const slugField = document.querySelector("[data-slug-field]");
const minutesField = document.querySelector("[data-minutes-field]");
const seoTitleField = document.querySelector("[data-seo-title-field]");
const seoDescriptionField = document.querySelector("[data-seo-description-field]");
const wordCountNode = document.querySelector("[data-word-count]");
const readingEstimateNode = document.querySelector("[data-reading-estimate]");
const seoScoreNode = document.querySelector("[data-seo-score]");
const checklistNode = document.querySelector("[data-editor-checklist]");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function plainBodyText() {
  return String(bodyField?.value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/\s+/g, " ")
    .trim();
}

function editorStats() {
  const bodyText = plainBodyText();
  const words = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;
  const title = String(titleField?.value || "").trim();
  const subtitle = String(subtitleField?.value || "").trim();
  const seoTitle = String(seoTitleField?.value || "").trim();
  const seoDescription = String(seoDescriptionField?.value || "").trim();
  const tags = String(document.querySelector("[name='tags']")?.value || "").split(",").map((item) => item.trim()).filter(Boolean);
  const image = String(document.querySelector("[name='image']")?.value || "").trim();
  const checklist = [
    { label: "Title is 45-75 characters", ok: title.length >= 45 && title.length <= 75 },
    { label: "Subtitle explains the story", ok: subtitle.length >= 40 },
    { label: "Body has at least 300 words", ok: words >= 300 },
    { label: "Hero image is selected", ok: Boolean(image) },
    { label: "At least 3 tags", ok: tags.length >= 3 },
    { label: "SEO title is filled", ok: seoTitle.length >= 30 && seoTitle.length <= 70 },
    { label: "SEO description is 120-165 characters", ok: seoDescription.length >= 120 && seoDescription.length <= 165 }
  ];
  const score = Math.round((checklist.filter((item) => item.ok).length / checklist.length) * 100);
  return { words, minutes: Math.max(1, Math.ceil(words / 220)), checklist, score };
}

function updateEditorQuality() {
  if (!bodyField) return;
  const stats = editorStats();
  if (wordCountNode) wordCountNode.textContent = stats.words.toLocaleString();
  if (readingEstimateNode) readingEstimateNode.textContent = `${stats.minutes} min`;
  if (seoScoreNode) {
    seoScoreNode.textContent = `${stats.score}%`;
    seoScoreNode.dataset.score = String(stats.score);
  }
  if (checklistNode) {
    checklistNode.innerHTML = stats.checklist
      .map((item) => `<li class="${item.ok ? "ok" : "warn"}"><span>${item.ok ? "OK" : "Fix"}</span>${escapeHtml(item.label)}</li>`)
      .join("");
  }
}

function insertAtCursor(text, selectOffset = 0) {
  if (!bodyField) return;
  const start = bodyField.selectionStart;
  const end = bodyField.selectionEnd;
  const current = bodyField.value;
  bodyField.value = `${current.slice(0, start)}${text}${current.slice(end)}`;
  const cursor = start + text.length + selectOffset;
  bodyField.focus();
  bodyField.setSelectionRange(Math.max(start, cursor), Math.max(start, cursor));
  updatePreview();
  markAutosaveDirty();
}

function wrapSelection(template) {
  if (!bodyField) return;
  const start = bodyField.selectionStart;
  const end = bodyField.selectionEnd;
  const selected = bodyField.value.slice(start, end) || "text";
  const value = template.replace("|", selected);
  bodyField.value = `${bodyField.value.slice(0, start)}${value}${bodyField.value.slice(end)}`;
  bodyField.focus();
  bodyField.setSelectionRange(start, start + value.length);
  updatePreview();
  markAutosaveDirty();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderParagraph(paragraph) {
  const trimmed = paragraph.trim();
  if (!trimmed) return "";
  if (/^<tm-poll\b/i.test(trimmed)) return renderPollPlaceholder(trimmed);
  if (/^```/.test(trimmed)) return `<pre><code>${escapeHtml(trimmed.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, ""))}</code></pre>`;
  if (/^#{2,3}\s+/.test(trimmed)) return `<h2>${escapeHtml(trimmed.replace(/^#{2,3}\s+/, ""))}</h2>`;
  if (/^[-*]\s+/m.test(trimmed)) return `<ul>${trimmed.split(/\n/).filter(Boolean).map((item) => `<li>${escapeHtml(item.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
  if (/^<(h2|blockquote|pre|ul|ol|figure|iframe|img|p|table|tm-poll)\b/i.test(trimmed)) return trimmed;
  return `<p>${escapeHtml(trimmed)}</p>`;
}

function renderPollPlaceholder(markup) {
  const slug = /slug=["']([^"']+)["']/i.exec(markup)?.[1] || "selected-poll";
  return `<aside class="reader-card poll-card"><span>Article poll</span><h2>${escapeHtml(slug)}</h2><p>This interactive poll will render on the public article page.</p></aside>`;
}

function updatePreview() {
  if (!bodyField || !preview) return;
  const html = bodyField.value
    .split(/\n{2,}/)
    .map(renderParagraph)
    .join("");
  preview.innerHTML = html || "<p class='muted'>Start writing to preview the article body.</p>";
  updateEditorQuality();
}

document.addEventListener("click", (event) => {
  const wrap = event.target.closest("[data-editor-wrap]");
  const block = event.target.closest("[data-editor-block]");
  const embed = event.target.closest("[data-editor-embed]");
  const gallery = event.target.closest("[data-editor-gallery]");
  const poll = event.target.closest("[data-editor-poll]");
  const table = event.target.closest("[data-editor-table]");
  const setImage = event.target.closest("[data-set-image]");
  const media = event.target.closest("[data-insert-media]");
  const aiGenerate = event.target.closest("[data-ai-generate]");
  const aiApply = event.target.closest("[data-ai-apply]");
  const generateSlug = event.target.closest("[data-generate-slug]");
  const estimateReading = event.target.closest("[data-estimate-reading]");
  const fillSeo = event.target.closest("[data-fill-seo]");
  const copyPublicLink = event.target.closest("[data-copy-public-link]");

  if (generateSlug && slugField && titleField) {
    slugField.value = slugify(titleField.value);
    markAutosaveDirty();
    return;
  }

  if (estimateReading && minutesField) {
    minutesField.value = String(editorStats().minutes);
    markAutosaveDirty();
    return;
  }

  if (fillSeo) {
    if (seoTitleField && titleField && !seoTitleField.value.trim()) seoTitleField.value = titleField.value.trim().slice(0, 70);
    if (seoDescriptionField && subtitleField && !seoDescriptionField.value.trim()) seoDescriptionField.value = subtitleField.value.trim().slice(0, 165);
    updateEditorQuality();
    markAutosaveDirty();
    return;
  }

  if (copyPublicLink) {
    const url = `${window.location.origin}${copyPublicLink.dataset.copyPublicLink}`;
    navigator.clipboard?.writeText(url);
    copyPublicLink.textContent = "Copied";
    window.setTimeout(() => {
      copyPublicLink.textContent = "Copy public link";
    }, 1400);
    return;
  }

  if (setImage && imageField) {
    imageField.value = setImage.dataset.setImage;
  }

  if (wrap) {
    wrapSelection(wrap.dataset.editorWrap);
    return;
  }

  if (block) {
    wrapSelection(`\n\n${block.dataset.editorBlock}\n\n`);
    return;
  }

  if (embed) {
    insertAtCursor('\n\n<iframe src="https://www.youtube.com/embed/video-id" title="Video embed" loading="lazy"></iframe>\n\n');
    return;
  }

  if (gallery) {
    insertAtCursor('\n\n<figure class="article-gallery"><img src="/uploads/image-one.webp" alt="Gallery image"><img src="/uploads/image-two.webp" alt="Gallery image"></figure>\n\n');
    return;
  }

  if (table) {
    insertAtCursor('\n\n<table><thead><tr><th>Feature</th><th>Detail</th></tr></thead><tbody><tr><td>Example</td><td>Value</td></tr></tbody></table>\n\n');
    return;
  }

  if (poll) {
    const pollSlug = document.querySelector("[data-poll-select]")?.value || "choose-poll";
    insertAtCursor(`\n\n<tm-poll slug="${escapeHtml(pollSlug)}"></tm-poll>\n\n`);
    return;
  }

  if (media && bodyField) {
    const url = media.dataset.insertMedia;
    const alt = media.dataset.mediaAlt || "Article image";
    insertAtCursor(`\n\n<figure><img src="${url}" alt="${escapeHtml(alt)}"><figcaption>${escapeHtml(alt)}</figcaption></figure>\n\n`);
  }

  if (aiGenerate) {
    const panel = aiGenerate.closest("[data-ai-panel]");
    const output = panel?.querySelector("[data-ai-output]");
    const articleId = panel?.dataset.aiArticle;
    const csrf = document.querySelector("[name='_csrf']")?.value || "";
    if (!articleId || !output) return;
    output.textContent = "Generating...";
    fetch(`/admin/articles/${encodeURIComponent(articleId)}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ _csrf: csrf })
    })
      .then((response) => response.json())
      .then((payload) => {
        latestAiResult = payload.result || null;
        output.textContent = JSON.stringify(payload.result || payload, null, 2);
      })
      .catch(() => {
        output.textContent = "AI request failed. Check your API key and server logs.";
      });
  }

  if (aiApply && latestAiResult) {
    const seoTitle = document.querySelector("[name='seoTitle']");
    const seoDescription = document.querySelector("[name='seoDescription']");
    const tags = document.querySelector("[name='tags']");
    const subtitle = document.querySelector("[name='subtitle']");
    if (seoTitle && latestAiResult.seoTitle) seoTitle.value = latestAiResult.seoTitle;
    if (seoDescription && latestAiResult.seoDescription) seoDescription.value = latestAiResult.seoDescription;
    if (tags && Array.isArray(latestAiResult.tags)) tags.value = latestAiResult.tags.join(", ");
    if (subtitle && latestAiResult.summary && !subtitle.value) subtitle.value = latestAiResult.summary.slice(0, 180);
  }
});

function formSnapshot() {
  if (!autosaveForm) return {};
  const data = Object.fromEntries(new FormData(autosaveForm));
  for (const key of ["featured", "breaking", "trending", "sponsored"]) data[key] = new FormData(autosaveForm).has(key);
  delete data._csrf;
  delete data.autosavePayload;
  return data;
}

function autosaveKey() {
  return autosaveForm?.dataset.autosaveKey || "article:new";
}

function setAutosaveStatus(text, mode = "") {
  if (!autosaveStatus) return;
  autosaveStatus.dataset.mode = mode;
  const strong = autosaveStatus.querySelector("strong");
  const span = autosaveStatus.querySelector("span");
  if (strong) strong.textContent = text;
  if (span) span.textContent = mode === "saved" ? `Last saved ${new Date().toLocaleTimeString()}` : "Changes are saved in this browser and, after first save, on the server.";
}

function applySnapshot(snapshot) {
  if (!autosaveForm || !snapshot) return;
  Object.entries(snapshot).forEach(([key, value]) => {
    const field = autosaveForm.elements[key];
    if (!field) return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value ?? "";
  });
  updatePreview();
}

function availableAutosave() {
  const local = localStorage.getItem(`tm_autosave:${autosaveKey()}`);
  const server = autosavePayloadField?.value;
  return server || local;
}

function markAutosaveDirty() {
  if (!autosaveForm) return;
  autosaveDirty = true;
  setAutosaveStatus("Autosave pending", "pending");
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(saveAutosave, 900);
}

async function saveAutosave() {
  if (!autosaveForm || !autosaveDirty) return;
  const snapshot = formSnapshot();
  localStorage.setItem(`tm_autosave:${autosaveKey()}`, JSON.stringify({ ...snapshot, savedAt: new Date().toISOString() }));
  autosaveDirty = false;
  setAutosaveStatus("Autosaved locally", "saved");
  if (!snapshot.id) return;
  try {
    const response = await fetch("/admin/articles/autosave", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...snapshot, _csrf: document.querySelector("[name='_csrf']")?.value || "" })
    });
    if (response.ok) setAutosaveStatus("Autosaved to server", "saved");
  } catch {
    setAutosaveStatus("Autosaved locally", "saved");
  }
}

if (availableAutosave() && restoreAutosaveButton && clearAutosaveButton) {
  restoreAutosaveButton.hidden = false;
  clearAutosaveButton.hidden = false;
  setAutosaveStatus("Autosave found", "pending");
}

restoreAutosaveButton?.addEventListener("click", () => {
  const server = autosavePayloadField?.value;
  const local = localStorage.getItem(`tm_autosave:${autosaveKey()}`);
  const payload = server || local;
  if (!payload) return;
  try {
    applySnapshot(JSON.parse(payload));
    setAutosaveStatus("Autosave restored", "saved");
  } catch {
    setAutosaveStatus("Could not restore autosave", "error");
  }
});

clearAutosaveButton?.addEventListener("click", () => {
  localStorage.removeItem(`tm_autosave:${autosaveKey()}`);
  if (autosavePayloadField?.value) {
    fetch("/admin/articles/autosave/clear", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id: document.querySelector("[name='id']")?.value || "", _csrf: document.querySelector("[name='_csrf']")?.value || "" })
    }).catch(() => {});
  }
  if (autosavePayloadField) autosavePayloadField.value = "";
  restoreAutosaveButton.hidden = true;
  clearAutosaveButton.hidden = true;
  setAutosaveStatus("Autosave cleared", "saved");
});

autosaveForm?.addEventListener("input", markAutosaveDirty);
autosaveForm?.addEventListener("change", markAutosaveDirty);
autosaveForm?.addEventListener("submit", () => {
  localStorage.removeItem(`tm_autosave:${autosaveKey()}`);
});

bodyField?.addEventListener("input", () => {
  updatePreview();
  markAutosaveDirty();
});
updatePreview();
updateEditorQuality();

const workflowRealtime = document.querySelector("[data-workflow-realtime]");
const workflowMessages = document.querySelector("[data-workflow-messages]");

function workflowEventLabel(type) {
  return {
    "workflow.assignment": "Assignment",
    "workflow.approval": "Approval",
    "workflow.approval_review": "Approval review",
    "workflow.calendar": "Calendar",
    "workflow.task": "Task",
    "workflow.shift": "Shift",
    "workflow.message": "Chat",
    "workflow.connected": "Connected"
  }[type] || "Workflow";
}

function prependWorkflowEvent(event) {
  if (!workflowMessages || !event?.type) return;
  if (event.type === "workflow.connected") return;
  if (event.type === "workflow.message" && event.payload?.articleId) return;
  workflowMessages.querySelectorAll(".muted").forEach((item) => item.remove());
  const item = document.createElement("article");
  item.className = "topic-row realtime-event";
  const payload = event.payload || {};
  const text = payload.message || payload.title || payload.status || payload.stage || "Workflow updated";
  item.innerHTML = `
    <span>${escapeHtml(workflowEventLabel(event.type))} / ${escapeHtml(new Date(event.sentAt || Date.now()).toLocaleTimeString())}</span>
    <p>${escapeHtml(text)}</p>
    <small>Realtime WebSocket update</small>
  `;
  workflowMessages.prepend(item);
}

function connectWorkflowRealtime() {
  if (!workflowRealtime || !("WebSocket" in window)) return;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${window.location.host}/api/workflow/realtime`);
  workflowRealtime.dataset.mode = "connecting";
  workflowRealtime.textContent = "Realtime newsroom channel connecting...";
  socket.addEventListener("open", () => {
    workflowRealtime.dataset.mode = "live";
    workflowRealtime.textContent = "Realtime newsroom channel live.";
  });
  socket.addEventListener("message", (message) => {
    try {
      const event = JSON.parse(message.data);
      workflowRealtime.dataset.mode = "live";
      workflowRealtime.textContent = event.type === "workflow.connected"
        ? `Realtime newsroom channel live ${new Date(event.sentAt || Date.now()).toLocaleTimeString()}.`
        : `${workflowEventLabel(event.type)} update received ${new Date(event.sentAt || Date.now()).toLocaleTimeString()}.`;
      prependWorkflowEvent(event);
    } catch {
      workflowRealtime.textContent = "Realtime update received.";
    }
  });
  socket.addEventListener("close", () => {
    workflowRealtime.dataset.mode = "offline";
    workflowRealtime.textContent = "Realtime newsroom channel reconnecting...";
    window.setTimeout(connectWorkflowRealtime, 2500);
  });
  socket.addEventListener("error", () => {
    workflowRealtime.dataset.mode = "error";
    workflowRealtime.textContent = "Realtime newsroom channel interrupted.";
  });
}

connectWorkflowRealtime();
