const SESSION_KEY = "afeng.visit-session.v1";
const STATS_CACHE_KEY = "afeng.visit-stats.v1";
const SESSION_LOCK_KEY = "afeng.visit-session-lock.v1";
const COUNTER_FRAME_ID = "visit-counter-frame";
const COUNTER_MESSAGE = "afeng:visit-statistics";
export const STATS_CACHE_EVENT = "afeng:visit-statistics-cache";

const memoryStorage = new Map();
const memoryStore = {
  getItem: (key) => memoryStorage.get(key) ?? null,
  setItem: (key, value) => memoryStorage.set(key, value),
  removeItem: (key) => memoryStorage.delete(key)
};

function canUseStorage(storage) {
  if (!storage) return false;
  const probe = `${SESSION_KEY}.probe`;
  try {
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function selectUsableStorage(candidates) {
  return candidates.find(canUseStorage) || memoryStore;
}

function getStorage() {
  const candidates = [];
  try {
    candidates.push(window.localStorage);
  } catch {
    // Access can throw in strict privacy modes.
  }
  try {
    candidates.push(window.sessionStorage);
  } catch {
    // Keep the in-memory fallback for the current page.
  }
  return selectUsableStorage(candidates);
}

function readJson(storage, key) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function isNewVisitSession(lastActivityAt, now, inactivityMs) {
  return !Number.isFinite(lastActivityAt) || now - lastActivityAt >= inactivityMs;
}

export function updateVisitSession(previous, now, inactivityMs, random = Math.random) {
  const lastActivityAt = Number(previous?.lastActivityAt);
  const newSession = isNewVisitSession(lastActivityAt, now, inactivityMs);
  return {
    newSession,
    session: {
      id: newSession ? `${now}-${random()}` : previous?.id,
      lastActivityAt: now
    }
  };
}

export function calculateDisplayedStatistics(raw, config, updatedAt = Date.now()) {
  return {
    visitors: Math.max(0, raw.visitors - config.newVisitors.baseline),
    sessions: Math.max(0, raw.sessions - config.sessions.baseline),
    updatedAt
  };
}

export function parseStatisticsCache(value) {
  if (!value || !Number.isFinite(value.visitors) || !Number.isFinite(value.sessions)) return null;
  return {
    visitors: Math.max(0, value.visitors),
    sessions: Math.max(0, value.sessions),
    updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0
  };
}

export function readStatisticsCache() {
  return parseStatisticsCache(readJson(getStorage(), STATS_CACHE_KEY));
}

export function writeStatisticsCache(statistics) {
  writeJson(getStorage(), STATS_CACHE_KEY, statistics);
  window.dispatchEvent(new CustomEvent(STATS_CACHE_EVENT, { detail: statistics }));
}

const LOCK_LEASE_MS = 2000;
const LOCK_SETTLE_MS = 32;
const LOCK_RETRY_MS = 80;
// 租约 2 秒，重试上限覆盖它两倍有余；再拿不到就直接执行，
// 最坏情况只是这一次多计一个会话，不能让页面卡在这里。
const LOCK_MAX_ATTEMPTS = 60;

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function acquireFallbackLock(storage, token) {
  for (let attempt = 0; attempt < LOCK_MAX_ATTEMPTS; attempt += 1) {
    const current = readJson(storage, SESSION_LOCK_KEY);
    if (!current?.expiresAt || current.expiresAt <= Date.now()) {
      writeJson(storage, SESSION_LOCK_KEY, { token, expiresAt: Date.now() + LOCK_LEASE_MS });
      await delay(LOCK_SETTLE_MS);
      if (readJson(storage, SESSION_LOCK_KEY)?.token === token) return true;
    }
    await delay(LOCK_RETRY_MS);
  }
  return false;
}

/** navigator.locks 不可用时的退路：用带租约的存储键近似互斥。 */
async function withFallbackLock(storage, task) {
  const token = `${Date.now()}-${Math.random()}`;
  const acquired = await acquireFallbackLock(storage, token);

  if (!acquired) return task();

  try {
    return await task();
  } finally {
    if (readJson(storage, SESSION_LOCK_KEY)?.token === token) {
      try {
        storage.removeItem(SESSION_LOCK_KEY);
      } catch {
        // 会话判定已经写入；租约到期后自动失效，残留一把过期锁无害。
      }
    }
  }
}

export async function recordVisitActivity(inactivityMs, now = Date.now()) {
  const storage = getStorage();
  const decide = () => {
    const previous = readJson(storage, SESSION_KEY);
    const result = updateVisitSession(previous, now, inactivityMs);
    writeJson(storage, SESSION_KEY, result.session);
    return { newSession: result.newSession, storagePersistent: storage !== memoryStore };
  };

  if (navigator.locks?.request) {
    return navigator.locks.request(SESSION_LOCK_KEY, decide);
  }
  return withFallbackLock(storage, decide);
}

let counterRequest;

export function requestVisitStatistics(counterPath, timeoutMs = 10000) {
  if (counterRequest) return counterRequest;

  counterRequest = new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.id = COUNTER_FRAME_ID;
    frame.src = counterPath;
    frame.hidden = true;
    frame.tabIndex = -1;
    frame.setAttribute("aria-hidden", "true");
    // 承载不蒜子第三方脚本的 iframe 加 sandbox：脚本被隔离到不透明源，
    // 即便被篡改也无法以主站同源权限读写 DOM / localStorage。
    frame.setAttribute("sandbox", "allow-scripts");

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeout);
      frame.remove();
      counterRequest = undefined;
    };
    const handleMessage = (event) => {
      // sandbox 让 iframe 成为不透明源（origin 为 "null"）；event.source 校验保证只信这个 frame。
      if (event.source !== frame.contentWindow) return;
      if (event.origin !== window.location.origin && event.origin !== "null") return;
      if (event.data?.type !== COUNTER_MESSAGE) return;
      const visitors = Number(event.data.visitors);
      const sessions = Number(event.data.sessions);
      if (!Number.isFinite(visitors) || !Number.isFinite(sessions)) return;
      cleanup();
      resolve({ visitors, sessions });
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("访问统计请求超时"));
    }, timeoutMs);

    window.addEventListener("message", handleMessage);
    document.body.appendChild(frame);
  });

  return counterRequest;
}
