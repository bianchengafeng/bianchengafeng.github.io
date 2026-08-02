import { useEffect, useState } from "react";
import { site } from "../content/site.js";
import { resolveTheme, STORAGE_KEY } from "../theme-preference.js";
import { useIsomorphicLayoutEffect } from "../use-isomorphic-layout-effect.js";

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // 主题持久化是可选的；读取失败时继续跟随系统偏好。
    return null;
  }
}

export function useTheme() {
  // 初始为 "light"：SSR 预渲染与 hydrate 首帧保持一致，真实主题由
  // 构建期引导脚本经 data-theme 决定（CSS 层），不依赖 React state。
  const [theme, setTheme] = useState("light");

  // 首帧把 React state 对齐到引导脚本已设的 data-theme；SSR 时此 effect 不运行。
  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    // 一次性 hydrate 对齐，非依赖循环；由构建期引导脚本 + 此 effect 共同定稿主题。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      initial === "light" || initial === "dark"
        ? initial
        : resolveTheme(readStoredTheme(), window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, []);

  // 在绘制前写入属性，避免系统暗色首帧闪一下亮色的玻璃高光。
  useIsomorphicLayoutEffect(() => {
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
