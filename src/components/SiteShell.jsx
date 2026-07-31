import React from "react";
import { createRoot } from "react-dom/client";
import { SiteHeader } from "./SiteHeader.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { useTheme } from "./useTheme.js";
import "../styles/base.css";

function SiteShell({ active, children }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <a className="skip-link" href="#content">
        跳到主要内容
      </a>
      <SiteHeader active={active} theme={theme} onToggleTheme={toggleTheme} />
      <div id="content">{children}</div>
      <SiteFooter />
    </>
  );
}

/**
 * 每个页面入口调用一次。页面标题与描述已由构建期注入静态 HTML，
 * 这里不再在运行时改写 head。
 */
export function mountPage(active, page) {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <SiteShell active={active}>{page}</SiteShell>
    </React.StrictMode>
  );
}
