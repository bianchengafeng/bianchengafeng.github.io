import { useEffect, useState } from "react";

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // 存储不可用时保留内存中的当前主题。
    }
  }, [theme]);

  const toggleTheme = () => setTheme((value) => (value === "dark" ? "light" : "dark"));
  return { theme, toggleTheme };
}
