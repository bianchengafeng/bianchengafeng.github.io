const statIds = ["busuanzi_value_site_uv", "busuanzi_value_page_pv"];
const timeoutMs = 8000;
let completed = false;

let referrerOrigin;
try {
  referrerOrigin = document.referrer ? new URL(document.referrer).origin : "";
} catch {
  referrerOrigin = "";
}
const validParent = window.parent !== window && referrerOrigin === window.location.origin;

function publishStatistics() {
  if (completed) return;
  const [visitorsNode, sessionsNode] = statIds.map((id) => document.getElementById(id));
  const visitors = Number(visitorsNode?.textContent?.trim());
  const sessions = Number(sessionsNode?.textContent?.trim());
  if (!Number.isFinite(visitors) || !Number.isFinite(sessions)) return;

  completed = true;
  window.parent.postMessage({
    type: "afeng:visit-statistics",
    visitors,
    sessions
  }, window.location.origin);
}

if (validParent) {
  const observer = new MutationObserver(publishStatistics);
  statIds.forEach((id) => {
    const node = document.getElementById(id);
    if (node) observer.observe(node, { childList: true, characterData: true, subtree: true });
  });

  const script = document.createElement("script");
  script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
  script.defer = true;
  script.onerror = () => observer.disconnect();
  document.head.appendChild(script);
  window.setTimeout(() => observer.disconnect(), timeoutMs);
}
