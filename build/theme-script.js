import { resolveTheme, STORAGE_KEY } from "../src/theme-preference.js";

// 首次绘制前确定主题，避免存了暗色偏好的访客刷新时闪一下亮色。
// resolveTheme 以 toString() 内嵌进 HTML：与 useTheme.js 共享同一份源码，改动不会分叉。
export const themeBootScript = [
  "(function () {",
  "  var saved = null;",
  `  try { saved = localStorage.getItem(${JSON.stringify(STORAGE_KEY)}); } catch (error) {}`,
  `  var theme = (${resolveTheme.toString()})(saved, window.matchMedia("(prefers-color-scheme: dark)").matches);`,
  "  document.documentElement.dataset.theme = theme;",
  "})();"
].join("\n");
