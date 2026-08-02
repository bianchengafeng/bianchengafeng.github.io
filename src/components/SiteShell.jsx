import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { identity } from "../content/site.js";
import { SiteHeader } from "./SiteHeader.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { useTheme } from "./useTheme.js";
import "../styles/base.css";

// 顶栏崩溃时的退路：只剩一个能回首页的品牌链接。
const headerFallback = (
  <div className="site-header" role="banner">
    <a className="site-brand" href="/" aria-label={`${identity.name}的个人主页`}>
      {identity.name}
    </a>
  </div>
);

// 正文崩溃时的退路：复用 noscript 文案，给访客留下博客与 GitHub 的出路。
const contentFallback = (
  <div className="noscript-fallback" role="alert">
    <h1>这里的内容暂时无法显示</h1>
    <p>某个模块渲染出错，但导航和页脚仍然可用。你可以前往：</p>
    <p>
      <a href={identity.blogUrl}>{identity.blogName}</a> · <a href={identity.githubUrl}>GitHub</a>
    </p>
  </div>
);

export function SiteShell({ active, children }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <a className="skip-link" href="#content">
        跳到主要内容
      </a>
      <ErrorBoundary fallback={headerFallback}>
        <SiteHeader active={active} theme={theme} onToggleTheme={toggleTheme} />
      </ErrorBoundary>
      <div id="content">
        <ErrorBoundary fallback={contentFallback}>{children}</ErrorBoundary>
      </div>
      <SiteFooter />
    </>
  );
}

/**
 * 每个页面入口调用一次。页面标题与描述已由构建期注入静态 HTML，
 * 这里不再在运行时改写 head。
 * 构建期预渲染过 #root 内容的页面对应的浏览器环境走 hydrateRoot 接管；
 * 未预渲染（如 dev server）走 createRoot。
 */
export function mountPage(active, page) {
  const rootElement = document.getElementById("root");
  const children = (
    <React.StrictMode>
      <SiteShell active={active}>{page}</SiteShell>
    </React.StrictMode>
  );
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, children);
  } else {
    createRoot(rootElement).render(children);
  }
}
