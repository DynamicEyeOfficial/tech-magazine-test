import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import {
  API_BASE_URL,
  bookmarkArticle,
  bookmarkPodcast,
  bookmarkVideo,
  fetchArticle,
  fetchLiveEvent,
  fetchMobileConfig,
  fetchMobileHome,
  fetchMobileOffline,
  fetchNotifications,
  fetchPodcastEpisode,
  fetchReaderProfile,
  fetchVideo,
  loginReader,
  recordMobileEvent,
  registerMobileDevice,
  registerReader,
  removeMobileOffline,
  resolveMobileDeepLink,
  saveMobileOffline,
  saveNotificationPreferences
} from "./src/api";

const storageKeys = {
  token: "tm_mobile_token",
  home: "tm_mobile_home_cache",
  offline: "tm_mobile_offline_cache",
  install: "tm_mobile_installation_id",
  push: "tm_mobile_push_enabled"
};

function absoluteUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]+>/g, "");
}

function readingText(detail) {
  if (!detail) return "";
  if (detail.type === "article") return [detail.item.title, detail.item.subtitle, ...(detail.item.body || [])].map(stripHtml).join(". ");
  if (detail.type === "podcast") return [detail.item.title, detail.item.summary || detail.item.description, detail.item.transcript].map(stripHtml).join(". ");
  if (detail.type === "video") return [detail.item.title, detail.item.description, detail.item.transcript].map(stripHtml).join(". ");
  return [detail.item.title, detail.item.description].map(stripHtml).join(". ");
}

function metricLabel(value) {
  const number = Number(value || 0);
  if (!number) return "0";
  if (number > 999) return `${(number / 1000).toFixed(1)}k`;
  return String(number);
}

export default function App() {
  const [state, setState] = useState({
    loading: true,
    refreshing: false,
    token: "",
    reader: null,
    tab: "feed",
    config: null,
    home: null,
    notifications: [],
    offline: [],
    detail: null,
    message: "",
    pushEnabled: false,
    authMode: "login",
    auth: { name: "", email: "", password: "" },
    favoriteAi: true,
    favoriteSecurity: true
  });
  const touchStart = useRef(null);

  const load = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) setState((current) => ({ ...current, refreshing: true }));
    try {
      let token = state.token || (await AsyncStorage.getItem(storageKeys.token)) || "";
      const installationId = await ensureInstallationId();
      const cachedHome = await AsyncStorage.getItem(storageKeys.home);
      const cachedOffline = await AsyncStorage.getItem(storageKeys.offline);
      if (!refresh && cachedHome) {
        const parsed = JSON.parse(cachedHome);
        setState((current) => ({ ...current, home: parsed, offline: cachedOffline ? JSON.parse(cachedOffline) : current.offline, token, loading: false }));
      }
      const [config, home, alerts, profile, offline] = await Promise.all([
        fetchMobileConfig().catch(() => null),
        fetchMobileHome(token, { platform: Platform.OS, appVersion: "0.1.0", installationId }),
        fetchNotifications(token).catch(() => ({ notifications: [] })),
        token ? fetchReaderProfile(token).catch(() => null) : null,
        token ? fetchMobileOffline(token).catch(() => ({ items: [] })) : Promise.resolve({ items: [] })
      ]);
      await AsyncStorage.setItem(storageKeys.home, JSON.stringify(home));
      await AsyncStorage.setItem(storageKeys.offline, JSON.stringify(offline.items || []));
      const pushEnabled = (await AsyncStorage.getItem(storageKeys.push)) === "true";
      setState((current) => ({
        ...current,
        loading: false,
        refreshing: false,
        token,
        config,
        home,
        reader: profile?.reader || home.reader || null,
        notifications: alerts.notifications || [],
        offline: offline.items || [],
        pushEnabled
      }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, refreshing: false, message: error.message || "Mobile sync failed." }));
    }
  }, [state.token]);

  useEffect(() => {
    load();
    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });
    return () => subscription.remove();
  }, []);

  async function ensureInstallationId() {
    let id = await AsyncStorage.getItem(storageKeys.install);
    if (!id) {
      id = `mobile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await AsyncStorage.setItem(storageKeys.install, id);
    }
    return id;
  }

  async function handleDeepLink(url) {
    const resolved = await resolveMobileDeepLink(url).catch(() => null);
    const route = resolved?.route;
    if (!route || route.type === "home") return;
    if (route.type === "article") openDetail("article", route.slug);
    if (route.type === "video") openDetail("video", route.slug);
    if (route.type === "podcast") openDetail("podcast", route.slug);
    if (route.type === "live") openDetail("live", route.slug);
  }

  async function openDetail(type, slug, offlinePayload = null) {
    setState((current) => ({ ...current, detail: { type, item: offlinePayload, loading: !offlinePayload }, message: "" }));
    recordMobileEvent(state.token, { eventType: "screen_view", screen: type, itemType: type, itemSlug: slug, platform: Platform.OS }).catch(() => {});
    if (offlinePayload) return;
    try {
      const data = type === "article"
        ? await fetchArticle(slug)
        : type === "video"
          ? await fetchVideo(slug)
          : type === "podcast"
            ? await fetchPodcastEpisode(slug)
            : await fetchLiveEvent(slug);
      const item = data.article || data.video || data.episode || data.event;
      setState((current) => ({ ...current, detail: { type, item, loading: false } }));
    } catch (error) {
      setState((current) => ({ ...current, message: error.message || "Could not open item.", detail: null }));
    }
  }

  async function saveOffline(type, item) {
    if (!state.token) {
      setState((current) => ({ ...current, message: "Sign in to save offline." }));
      return;
    }
    const slug = item.slug;
    const result = await saveMobileOffline(state.token, { itemType: type, itemSlug: slug });
    if (result.ok) {
      const offline = await fetchMobileOffline(state.token);
      await AsyncStorage.setItem(storageKeys.offline, JSON.stringify(offline.items || []));
      setState((current) => ({ ...current, offline: offline.items || [], message: "Saved offline." }));
    } else {
      setState((current) => ({ ...current, message: result.message || "Offline save failed." }));
    }
  }

  async function removeOffline(item) {
    const result = await removeMobileOffline(state.token, { itemType: item.type, itemSlug: item.slug });
    if (result.ok) {
      const next = state.offline.filter((entry) => entry.id !== item.id);
      await AsyncStorage.setItem(storageKeys.offline, JSON.stringify(next));
      setState((current) => ({ ...current, offline: next }));
    }
  }

  async function toggleBookmark(type, item) {
    if (!state.token) {
      setState((current) => ({ ...current, message: "Sign in to save bookmarks." }));
      return;
    }
    const result = type === "article"
      ? await bookmarkArticle(state.token, item.slug)
      : type === "video"
        ? await bookmarkVideo(state.token, item.slug)
        : await bookmarkPodcast(state.token, item.slug);
    setState((current) => ({ ...current, message: result.message || "Saved." }));
  }

  async function toggleNarration(detail) {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
      return;
    }
    Speech.speak(readingText(detail), { language: "en", rate: 0.94, pitch: 1 });
    recordMobileEvent(state.token, { eventType: "voice_narration", screen: detail.type, itemType: detail.type, itemSlug: detail.item.slug, platform: Platform.OS }).catch(() => {});
  }

  async function submitAuth() {
    const result = state.authMode === "login"
      ? await loginReader(state.auth.email, state.auth.password)
      : await registerReader(state.auth.name, state.auth.email, state.auth.password);
    if (result.ok && result.token) {
      await AsyncStorage.setItem(storageKeys.token, result.token);
      setState((current) => ({ ...current, token: result.token, reader: result.reader, message: "Signed in." }));
      load({ refresh: true });
    } else {
      setState((current) => ({ ...current, message: result.message || "Sign in failed." }));
    }
  }

  async function connectPush(enabled) {
    if (!state.token) {
      setState((current) => ({ ...current, message: "Sign in before enabling push." }));
      return;
    }
    if (!enabled) {
      await AsyncStorage.setItem(storageKeys.push, "false");
      setState((current) => ({ ...current, pushEnabled: false }));
      return;
    }
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      setState((current) => ({ ...current, message: "Push permission was not granted." }));
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync().then((item) => item.data).catch(() => "");
    const installationId = await ensureInstallationId();
    const result = await registerMobileDevice(state.token, {
      installationId,
      platform: Platform.OS,
      appVersion: "0.1.0",
      deviceName: Platform.OS,
      deviceToken: token,
      pushEnabled: true,
      channels: ["breaking", "trending", "live", "podcast"]
    });
    if (result.ok) {
      await AsyncStorage.setItem(storageKeys.push, "true");
      setState((current) => ({ ...current, pushEnabled: true, message: "Push notifications connected." }));
    }
  }

  async function savePreferences() {
    if (!state.token) return;
    const favoriteCategories = [state.favoriteAi ? "ai" : "", state.favoriteSecurity ? "cybersecurity" : ""].filter(Boolean);
    await saveNotificationPreferences(state.token, { breaking: true, liveEvents: true, newsletters: true, favoriteCategories, pushEnabled: state.pushEnabled });
    setState((current) => ({ ...current, message: "Preferences saved." }));
    load({ refresh: true });
  }

  function onSwipeEnd(event) {
    if (!touchStart.current) return;
    const dx = event.nativeEvent.pageX - touchStart.current.x;
    if (dx > 90 && state.detail) setState((current) => ({ ...current, detail: null }));
    touchStart.current = null;
  }

  const home = state.home || {};
  const feed = home.feed || [];
  const sections = home.sections || {};
  const tabs = useMemo(() => ["feed", "saved", "alerts", "profile"], []);

  if (state.loading) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator color="#62d6ff" />
        <Text style={styles.muted}>Loading Tech Magazine</Text>
      </SafeAreaView>
    );
  }

  if (state.detail) {
    return renderDetail({
      detail: state.detail,
      message: state.message,
      onBack: () => setState((current) => ({ ...current, detail: null })),
      onSaveOffline: saveOffline,
      onBookmark: toggleBookmark,
      onNarrate: toggleNarration,
      onSwipeStart: (event) => { touchStart.current = { x: event.nativeEvent.pageX }; },
      onSwipeEnd
    });
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Tech Magazine</Text>
          <Text style={styles.deck}>{home.personalized ? "Personalized mobile edition" : "AI, security, cloud, startups"}</Text>
        </View>
        <Pressable style={styles.syncButton} onPress={() => load({ refresh: true })}>
          <Text style={styles.syncText}>Sync</Text>
        </Pressable>
      </View>
      {state.message ? <Text style={styles.message}>{state.message}</Text> : null}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable key={tab} style={[styles.tab, state.tab === tab && styles.tabActive]} onPress={() => setState((current) => ({ ...current, tab }))}>
            <Text style={[styles.tabText, state.tab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
      {state.tab === "feed" ? (
        <FlatList
          data={feed}
          keyExtractor={(item) => item.slug}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={() => load({ refresh: true })} tintColor="#62d6ff" />}
          ListHeaderComponent={(
            <View>
              <MetricStrip home={home} />
              <Rail title="Breaking" items={sections.breaking || []} type="article" onOpen={openDetail} />
              <Rail title="Live" items={sections.liveEvents || []} type="live" onOpen={openDetail} />
              <Rail title="Video" items={sections.videos || []} type="video" onOpen={openDetail} />
              <Rail title="Podcasts" items={sections.podcasts || []} type="podcast" onOpen={openDetail} />
            </View>
          )}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ArticleCard item={item} onOpen={() => openDetail("article", item.slug)} />}
        />
      ) : null}
      {state.tab === "saved" ? <SavedScreen offline={state.offline} onOpen={openDetail} onRemove={removeOffline} onRefresh={() => load({ refresh: true })} refreshing={state.refreshing} /> : null}
      {state.tab === "alerts" ? <AlertsScreen notifications={state.notifications} pushEnabled={state.pushEnabled} connectPush={connectPush} /> : null}
      {state.tab === "profile" ? (
        <ProfileScreen
          reader={state.reader}
          auth={state.auth}
          authMode={state.authMode}
          setAuth={(auth) => setState((current) => ({ ...current, auth: { ...current.auth, ...auth } }))}
          setAuthMode={(authMode) => setState((current) => ({ ...current, authMode }))}
          submitAuth={submitAuth}
          favoriteAi={state.favoriteAi}
          favoriteSecurity={state.favoriteSecurity}
          setFavoriteAi={(favoriteAi) => setState((current) => ({ ...current, favoriteAi }))}
          setFavoriteSecurity={(favoriteSecurity) => setState((current) => ({ ...current, favoriteSecurity }))}
          savePreferences={savePreferences}
        />
      ) : null}
    </SafeAreaView>
  );
}

function MetricStrip({ home }) {
  const sections = home.sections || {};
  return (
    <View style={styles.metrics}>
      <View style={styles.metric}><Text style={styles.metricValue}>{metricLabel((home.feed || []).length)}</Text><Text style={styles.metricLabel}>stories</Text></View>
      <View style={styles.metric}><Text style={styles.metricValue}>{metricLabel((sections.liveEvents || []).length)}</Text><Text style={styles.metricLabel}>live</Text></View>
      <View style={styles.metric}><Text style={styles.metricValue}>{metricLabel((sections.podcasts || []).length)}</Text><Text style={styles.metricLabel}>audio</Text></View>
    </View>
  );
}

function Rail({ title, items, type, onOpen }) {
  if (!items.length) return null;
  return (
    <View style={styles.rail}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.slice(0, 8).map((item) => (
          <Pressable key={`${type}-${item.slug || item.id}`} style={styles.railCard} onPress={() => onOpen(type, item.slug)}>
            <Text style={styles.category}>{item.category || item.status || item.showTitle || type}</Text>
            <Text style={styles.railTitle}>{item.title}</Text>
            <Text style={styles.cardText} numberOfLines={2}>{item.subtitle || item.description || item.summary}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ArticleCard({ item, onOpen }) {
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      {item.image ? <Image source={{ uri: absoluteUrl(item.image) }} style={styles.cardImage} /> : null}
      <View style={styles.cardBody}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.subtitle}</Text>
        <Text style={styles.cardMeta}>{item.saved ? "Saved / " : ""}{item.minutes || 4} min read</Text>
      </View>
    </Pressable>
  );
}

function SavedScreen({ offline, onOpen, onRemove, onRefresh, refreshing }) {
  return (
    <FlatList
      data={offline}
      keyExtractor={(item) => item.id || `${item.type}-${item.slug}`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#62d6ff" />}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.sectionTitle}>Offline library</Text>}
      ListEmptyComponent={<Text style={styles.muted}>No offline saves yet. Open an article, video, or podcast and save it.</Text>}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => onOpen(item.type, item.slug, item.payload)}>
          <View style={styles.cardBody}>
            <Text style={styles.category}>{item.type}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>Synced {item.lastSyncedAt || item.downloadedAt}</Text>
            <Pressable style={styles.ghostButton} onPress={() => onRemove(item)}><Text style={styles.ghostText}>Remove offline</Text></Pressable>
          </View>
        </Pressable>
      )}
    />
  );
}

function AlertsScreen({ notifications, pushEnabled, connectPush }) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      <View style={styles.preferenceRow}>
        <View><Text style={styles.sectionTitle}>Push notifications</Text><Text style={styles.muted}>Breaking news, live events, followed topics, and podcast releases.</Text></View>
        <Switch value={pushEnabled} onValueChange={connectPush} />
      </View>
      {notifications.map((item) => (
        <View style={styles.alertItem} key={item.id}>
          <Text style={styles.category}>{item.type}</Text>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileScreen({ reader, auth, authMode, setAuth, setAuthMode, submitAuth, favoriteAi, favoriteSecurity, setFavoriteAi, setFavoriteSecurity, savePreferences }) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      {reader ? (
        <View style={styles.cardBody}>
          <Text style={styles.sectionTitle}>{reader.name}</Text>
          <Text style={styles.muted}>{reader.email}</Text>
          <View style={styles.preferenceRow}><Text style={styles.cardTitle}>AI feed</Text><Switch value={favoriteAi} onValueChange={setFavoriteAi} /></View>
          <View style={styles.preferenceRow}><Text style={styles.cardTitle}>Cybersecurity feed</Text><Switch value={favoriteSecurity} onValueChange={setFavoriteSecurity} /></View>
          <Pressable style={styles.primaryButton} onPress={savePreferences}><Text style={styles.primaryText}>Save preferences</Text></Pressable>
        </View>
      ) : (
        <View style={styles.cardBody}>
          <Text style={styles.sectionTitle}>{authMode === "login" ? "Reader sign in" : "Create reader account"}</Text>
          {authMode === "register" ? <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#789" value={auth.name} onChangeText={(name) => setAuth({ name })} /> : null}
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#789" autoCapitalize="none" value={auth.email} onChangeText={(email) => setAuth({ email })} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#789" secureTextEntry value={auth.password} onChangeText={(password) => setAuth({ password })} />
          <Pressable style={styles.primaryButton} onPress={submitAuth}><Text style={styles.primaryText}>{authMode === "login" ? "Sign in" : "Register"}</Text></Pressable>
          <Pressable style={styles.ghostButton} onPress={() => setAuthMode(authMode === "login" ? "register" : "login")}><Text style={styles.ghostText}>{authMode === "login" ? "Create account" : "Use existing account"}</Text></Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function renderDetail({ detail, message, onBack, onSaveOffline, onBookmark, onNarrate, onSwipeStart, onSwipeEnd }) {
  const item = detail.item;
  if (detail.loading || !item) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#62d6ff" />
      </SafeAreaView>
    );
  }
  const image = item.image || item.heroImage || item.thumbnailUrl || item.coverImage;
  return (
    <SafeAreaView style={styles.shell} onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd}>
      <StatusBar style="light" />
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>Back</Text></Pressable>
      <ScrollView>
        {image ? <Image source={{ uri: absoluteUrl(image) }} style={styles.heroImage} /> : null}
        <View style={styles.articleBody}>
          <Text style={styles.category}>{item.category || item.showTitle || detail.type}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle || item.description || item.summary}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => onSaveOffline(detail.type, item)}><Text style={styles.primaryText}>Save offline</Text></Pressable>
            <Pressable style={styles.ghostButton} onPress={() => onBookmark(detail.type, item)}><Text style={styles.ghostText}>Bookmark</Text></Pressable>
            <Pressable style={styles.ghostButton} onPress={() => onNarrate(detail)}><Text style={styles.ghostText}>Narrate</Text></Pressable>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {(item.body || []).map((paragraph, index) => <Text style={styles.paragraph} key={index}>{stripHtml(paragraph)}</Text>)}
          {item.transcript ? <Text style={styles.paragraph}>{stripHtml(item.transcript)}</Text> : null}
          {(item.updates || []).map((update) => (
            <View style={styles.alertItem} key={update.id}>
              <Text style={styles.category}>{update.updateType}</Text>
              <Text style={styles.alertTitle}>{update.title}</Text>
              <Text style={styles.cardText}>{update.body}</Text>
            </View>
          ))}
          {item.audioUrl ? <Pressable style={styles.primaryButton} onPress={() => Linking.openURL(absoluteUrl(item.audioUrl))}><Text style={styles.primaryText}>Open audio</Text></Pressable> : null}
          {item.videoUrl ? <Pressable style={styles.primaryButton} onPress={() => Linking.openURL(absoluteUrl(item.videoUrl))}><Text style={styles.primaryText}>Open video</Text></Pressable> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: "#071014" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#071014", gap: 12 },
  header: { padding: 18, borderBottomWidth: 1, borderBottomColor: "#21313a", flexDirection: "row", justifyContent: "space-between", gap: 12 },
  brand: { color: "#f2fbff", fontSize: 26, fontWeight: "900" },
  deck: { marginTop: 4, color: "#9eb0b8" },
  syncButton: { alignSelf: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: "#18313d" },
  syncText: { color: "#62d6ff", fontWeight: "800" },
  tabs: { flexDirection: "row", padding: 8, gap: 8, borderBottomWidth: 1, borderBottomColor: "#21313a" },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 8, backgroundColor: "#0d1a22" },
  tabActive: { backgroundColor: "#62d6ff" },
  tabText: { color: "#9eb0b8", fontWeight: "800", textTransform: "capitalize" },
  tabTextActive: { color: "#071014" },
  list: { padding: 16, gap: 14 },
  metrics: { flexDirection: "row", gap: 10, marginBottom: 14 },
  metric: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "#10202a", borderWidth: 1, borderColor: "#21313a" },
  metricValue: { color: "#f2fbff", fontSize: 22, fontWeight: "900" },
  metricLabel: { color: "#9eb0b8", textTransform: "uppercase", fontSize: 11, fontWeight: "800" },
  rail: { marginBottom: 18 },
  sectionTitle: { color: "#f2fbff", fontSize: 22, fontWeight: "900", marginBottom: 10 },
  railCard: { width: 220, minHeight: 130, marginRight: 12, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#21313a", backgroundColor: "#10202a" },
  railTitle: { marginTop: 6, color: "#f2fbff", fontSize: 17, fontWeight: "900" },
  card: { overflow: "hidden", borderRadius: 10, backgroundColor: "#10202a", borderWidth: 1, borderColor: "#21313a", marginBottom: 14 },
  cardImage: { height: 170, width: "100%" },
  cardBody: { padding: 16, gap: 10 },
  category: { color: "#62d6ff", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  cardTitle: { color: "#f2fbff", fontSize: 20, fontWeight: "900" },
  cardText: { color: "#b6c5cb", lineHeight: 20 },
  cardMeta: { color: "#7f949e", fontWeight: "800" },
  muted: { color: "#9eb0b8", lineHeight: 20 },
  message: { margin: 12, padding: 10, color: "#f2fbff", backgroundColor: "#18313d", borderRadius: 8 },
  alertItem: { padding: 14, borderRadius: 10, borderWidth: 1, borderLeftWidth: 4, borderColor: "#21313a", borderLeftColor: "#62d6ff", backgroundColor: "#10202a", marginBottom: 10 },
  alertTitle: { marginTop: 4, color: "#f2fbff", fontSize: 17, fontWeight: "900" },
  preferenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#21313a", backgroundColor: "#10202a", marginBottom: 10 },
  input: { minHeight: 48, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#21313a", color: "#f2fbff", backgroundColor: "#071014" },
  primaryButton: { alignItems: "center", justifyContent: "center", minHeight: 44, paddingHorizontal: 14, borderRadius: 8, backgroundColor: "#62d6ff", marginTop: 8 },
  primaryText: { color: "#071014", fontWeight: "900" },
  ghostButton: { alignItems: "center", justifyContent: "center", minHeight: 44, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: "#31505c", marginTop: 8 },
  ghostText: { color: "#62d6ff", fontWeight: "900" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  backButton: { padding: 16 },
  backText: { color: "#62d6ff", fontWeight: "900" },
  heroImage: { height: 260, width: "100%" },
  articleBody: { padding: 20 },
  title: { marginTop: 8, color: "#f2fbff", fontSize: 34, fontWeight: "900", lineHeight: 38 },
  subtitle: { marginTop: 10, color: "#c8d5da", fontSize: 18, lineHeight: 26 },
  paragraph: { marginTop: 18, color: "#e4edef", fontSize: 17, lineHeight: 28 }
});
