import React from "react";
import { renderToString } from "react-dom/server";
import { SiteShell } from "./components/SiteShell.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ProjectsPage } from "./pages/ProjectsPage.jsx";
import { WritingPage } from "./pages/WritingPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

export { pages } from "./content/site.js";

const components = {
  home: HomePage,
  about: AboutPage,
  projects: ProjectsPage,
  writing: WritingPage,
  notFound: NotFoundPage
};

/**
 * 供 scripts/prerender.mjs 调用：渲染某页的完整 SiteShell（顶栏 + 正文 + 页脚）HTML。
 * 页面组件必须是 SSR 安全的（不在 render 阶段触碰 window）；动态数据（RSS、访客数）
 * 在 SSR 时渲染占位态，水合后由客户端更新。
 */
export function renderPage(active) {
  const Component = components[active];
  if (!Component) return "";
  return renderToString(
    <SiteShell active={active}>
      <Component />
    </SiteShell>
  );
}
