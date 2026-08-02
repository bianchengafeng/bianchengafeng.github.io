/**
 * 主题偏好的唯一决策来源。
 * 构建期引导脚本（build/theme-script.js）把 resolveTheme.toString() 内嵌进 HTML，
 * 运行期 useTheme.js 直接调用——两处共享同一份逻辑，改动不会静默分叉。
 */
export const STORAGE_KEY = "theme";

export function resolveTheme(saved, prefersDark) {
  if (saved === "light" || saved === "dark") return saved;
  return prefersDark ? "dark" : "light";
}
