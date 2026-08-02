import { execSync } from "node:child_process";
import { identity, pages, site, siteContent } from "../src/content/site.js";

const absoluteUrl = (path) => new URL(path, site.origin).href;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// 结构化数据：让搜索引擎把本站、独立博客与 GitHub 归一为同一个"阿峰"。
export const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: identity.name, url: site.origin },
    {
      "@type": "Person",
      name: identity.name,
      alternateName: identity.romanizedName,
      url: site.origin,
      image: absoluteUrl(site.socialImage),
      sameAs: [identity.githubUrl, identity.blogUrl]
    }
  ]
};

export function renderSeoTags(page) {
  const canonical = absoluteUrl(page.path);
  const image = absoluteUrl(site.socialImage);
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="icon" type="image/png" href="${site.socialImage}" />`,
    // 头像（顶栏品牌图 + 首页人像）只在 React 渲染结果里出现，预载让它与 JS 并行下载，
    // 避免被串行在 67KB gzip 的 JS chunk 之后才发现。
    `<link rel="preload" as="image" href="${site.socialImage}" fetchpriority="high" />`,
    // 博客 RSS 的机器可读关联，供阅读器/爬虫从本站发现独立博客。
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(identity.blogName)}" href="${siteContent.writing.feedUrl}" />`,
    `<meta name="robots" content="${page.indexable === false ? "noindex,nofollow" : "index,follow"}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${site.themeColor.light}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${site.themeColor.dark}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(identity.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    // 给宽高让分享抓取端免下载即可布局，补 alt 改善分享卡片可访问性。
    `<meta property="og:image:width" content="460" />`,
    `<meta property="og:image:height" content="460" />`,
    `<meta property="og:image:alt" content="${escapeHtml(identity.name)}的头像" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>`
  ].join("\n    ");
}

// 站点是纯客户端渲染，HTML 外壳本身没有正文。给关闭 JavaScript 的访客留一条出路。
export function renderNoscriptBody(page) {
  return [
    '<div class="noscript-fallback">',
    `<h1>${escapeHtml(page.title)}</h1>`,
    `<p>${escapeHtml(page.description)}</p>`,
    // 这里不放邮箱：静态 HTML 里的 mailto 正是爬虫最容易收割的目标。
    "<p>这个页面需要 JavaScript 才能完整显示。你仍然可以直接访问：",
    `<a href="${identity.blogUrl}">${escapeHtml(identity.blogName)}</a> · `,
    `<a href="${identity.githubUrl}">GitHub</a>`,
    "</p></div>"
  ].join("");
}

// 每页关联的源文件，用于取真实最后修改时间（sitemap lastmod）。
const pageSourceFiles = {
  home: ["index.html", "src/pages/HomePage.jsx", "src/styles/home.css"],
  projects: ["projects/index.html", "src/pages/ProjectsPage.jsx", "src/styles/projects.css"],
  writing: ["writing/index.html", "src/pages/WritingPage.jsx", "src/styles/writing.css"],
  about: ["about/index.html", "src/pages/AboutPage.jsx", "src/styles/about.css"],
  notFound: ["404.html", "src/pages/NotFoundPage.jsx", "src/styles/not-found.css"]
};

// sitemap 的 lastmod 必须反映真实内容变更：每次部署都把全部页面标成"今天"
// 会长期失实，被 Google 整体忽略。取这些文件里最后一次 git 提交日期；
// 无 git（如非仓库构建）时回退到构建日期。
export function pageLastModified(page) {
  const files = [
    ...(pageSourceFiles[page.key] || [page.entry]),
    "src/content/site.js",
    "src/styles/base.css"
  ].join(" ");
  try {
    const date = execSync(`git log -1 --format=%cs -- ${files}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return date || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function renderSitemap(lastModifiedAt) {
  const entries = pages
    .filter((page) => page.inSitemap !== false)
    .map((page) =>
      [
        "  <url>",
        `    <loc>${absoluteUrl(page.path)}</loc>`,
        `    <lastmod>${lastModifiedAt(page)}</lastmod>`,
        "  </url>"
      ].join("\n")
    );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    ""
  ].join("\n");
}

export function renderRobots() {
  const disallowed = pages
    .filter((page) => page.indexable === false && page.path.endsWith("/"))
    .map((page) => `Disallow: ${page.path}`);
  return [
    "User-agent: *",
    "Allow: /",
    ...disallowed,
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    ""
  ].join("\n");
}
