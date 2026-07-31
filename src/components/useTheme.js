import { useLayoutEffect, useState } from "react";
import { site } from "../content/site.js";

const STORAGE_KEY = "theme";

function readStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // 主题持久化是可选的；读取失败时继续跟随系统偏好。
  }
  return null;
}

export function useTheme() {
  const [theme, setTheme] = useState(
    () =>
      readStoredTheme() ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  // 在绘制前写入属性，避免系统暗色首帧闪一下亮色的玻璃高光。
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    // 构建期注入的 theme-color 只跟随系统偏好；站内切换后把它们改写成当前主题色，
    // 让移动端浏览器地址栏与页面背景一致。
    const color = site.themeColor[theme];
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", color);
    });
  }, [theme]);

  // 只有用户显式切换才持久化；仅由系统偏好推断出的主题不写入，
  // 这样未做过选择的访客可以继续跟随系统深浅色。
  const toggleTheme = () =>
    setTheme((value) => {
      const next = value === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // 存储不可用时保留内存中的当前主题。
      }
      return next;
    });
  return { theme, toggleTheme };
}
