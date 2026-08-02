import React, { useEffect, useState } from "react";
import { identity, statistics } from "../content/site.js";
import {
  calculateDisplayedStatistics,
  readStatisticsCache,
  recordVisitActivity,
  requestVisitStatistics,
  STATS_CACHE_EVENT,
  writeStatisticsCache
} from "../statistics.js";
import { Icon } from "./Icon.jsx";

const ACTIVITY_THROTTLE_MS = 30_000;

function isLocalPreview() {
  const { hostname } = window.location;
  return ["localhost", "127.0.0.1"].includes(hostname) || hostname.endsWith(".local");
}

/** 本地预览不接入统计；线上按缓存 / 实时 / 不可用三种状态显示。 */
function formatStat(localPreview, stats, unavailable, value) {
  if (localPreview) return "正式上线后统计";
  if (stats) return value.toLocaleString("zh-CN");
  return unavailable ? "统计暂不可用" : "读取中";
}

function useVisitStatistics() {
  const [localPreview] = useState(isLocalPreview);
  const [stats, setStats] = useState(() => readStatisticsCache());
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (localPreview) return undefined;

    let cancelled = false;
    let lastRecordedAt = 0;
    const inactivityMs = statistics.sessions.inactivityMinutes * 60 * 1000;

    const showStatistics = (raw) => {
      const next = calculateDisplayedStatistics(raw, statistics);
      writeStatisticsCache(next);
      if (cancelled) return;
      setStats(next);
      setUnavailable(false);
    };
    const markUnavailable = () => {
      if (!cancelled && !readStatisticsCache()) setUnavailable(true);
    };
    const recordActivity = () => {
      const now = Date.now();
      if (now - lastRecordedAt < ACTIVITY_THROTTLE_MS) return;
      lastRecordedAt = now;
      recordVisitActivity(inactivityMs, now)
        .then(({ newSession, storagePersistent }) => {
          // 只有开启新会话才去请求计数页，避免同一会话内重复计数。
          if (!newSession || !storagePersistent) {
            markUnavailable();
            return undefined;
          }
          return requestVisitStatistics(statistics.sessions.counterPath).then(showStatistics);
        })
        .catch(markUnavailable);
    };
    const recordVisibleActivity = () => {
      if (document.visibilityState === "visible") recordActivity();
    };
    const syncCachedStatistics = () => {
      const cached = readStatisticsCache();
      if (cached && !cancelled) setStats(cached);
    };

    // 首次计数推迟到 window load 之后：隐藏 iframe + 不蒜子第三方脚本
    // 不该挤进首屏加载窗口，会话判定基于时间戳，延后几秒不影响正确性。
    let started = false;
    const start = () => {
      if (started || cancelled) return;
      started = true;
      recordActivity();
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    window.addEventListener("pointerdown", recordActivity, { passive: true });
    window.addEventListener("keydown", recordActivity);
    window.addEventListener("storage", syncCachedStatistics);
    window.addEventListener(STATS_CACHE_EVENT, syncCachedStatistics);
    document.addEventListener("visibilitychange", recordVisibleActivity);

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      window.removeEventListener("pointerdown", recordActivity);
      window.removeEventListener("keydown", recordActivity);
      window.removeEventListener("storage", syncCachedStatistics);
      window.removeEventListener(STATS_CACHE_EVENT, syncCachedStatistics);
      document.removeEventListener("visibilitychange", recordVisibleActivity);
    };
  }, [localPreview]);

  return { localPreview, stats, unavailable };
}

function StatsExplanation({ minutes }) {
  return (
    <>
      <p>
        <strong>新访客</strong>
        是第三方累计访客数减去旧站基线后的增量。同一身份只会在首次被识别时增加；旧访客再次回来不会重复增加，更换设备、浏览器、无痕窗口或网络后则可能被识别为另一位。
      </p>
      <p>
        <strong>{minutes} 分钟会话</strong>从会话功能启用后开始累计，以连续{" "}
        <strong>{minutes} 分钟无活动</strong>为分界。切页、刷新和继续操作只会延长当前会话；满{" "}
        {minutes} 分钟后再次进入，才增加一次。
      </p>
      <p>
        两项数据的<strong>统计对象和启用时点不同，不能直接比较大小</strong>
        ；例如基线后已有 5 位新访客，但会话功能启用后暂时只有 1
        次会话。它们只用于观察大致趋势，不是审计级数据。
      </p>
    </>
  );
}

export function SiteFooter() {
  const [explained, setExplained] = useState(false);
  const { localPreview, stats, unavailable } = useVisitStatistics();
  const minutes = statistics.sessions.inactivityMinutes;
  const showUnit = !localPreview && Boolean(stats);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-identity">
          <span>{identity.siteLabel}</span>
          <strong>感谢到访。</strong>
          <p>这是{identity.name}的个人网站。近况、项目与入口会随真实内容更新。</p>
        </div>
        <div className="footer-utility">
          <div className="footer-statistics">
            <div
              className="footer-stats"
              role="group"
              aria-label="网站访问趋势；新访客与20分钟会话的口径和启用时点不同"
              aria-live="polite"
            >
              <div className="footer-stat">
                <small>NEW VISITORS · SINCE {statistics.newVisitors.since}</small>
                <span>
                  <strong>
                    {formatStat(localPreview, stats, unavailable, stats?.visitors ?? 0)}
                  </strong>
                  {showUnit && " 位新访客"}
                </span>
              </div>
              <div className="footer-stat">
                <small>
                  {minutes}-MIN SESSIONS · {statistics.sessions.sinceLabel}
                </small>
                <span>
                  <strong>
                    {formatStat(localPreview, stats, unavailable, stats?.sessions ?? 0)}
                  </strong>
                  {showUnit && " 次会话"}
                </span>
              </div>
            </div>
            <button
              className="stats-explain-toggle"
              type="button"
              aria-expanded={explained}
              aria-controls="stats-explanation"
              onClick={() => setExplained((visible) => !visible)}
            >
              <span aria-hidden="true">i</span>
              {explained ? "收起说明" : "统计说明"}
            </button>
            <div className="stats-explanation" id="stats-explanation" hidden={!explained}>
              <StatsExplanation minutes={minutes} />
            </div>
          </div>
          <nav className="footer-links" aria-label="页脚链接">
            <a href={`mailto:${identity.email}`}>
              Email <Icon name="arrow" />
            </a>
            <a href={identity.githubUrl} target="_blank" rel="noreferrer">
              GitHub <Icon name="external" />
            </a>
            <a href={identity.blogUrl} target="_blank" rel="noreferrer">
              独立博客 <Icon name="external" />
            </a>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <small>
          © {identity.copyrightYear} {identity.name} · All rights reserved.
        </small>
        <span>Personal site · Last updated {identity.lastUpdatedYear}</span>
      </div>
    </footer>
  );
}
