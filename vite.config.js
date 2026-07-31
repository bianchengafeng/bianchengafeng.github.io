import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { siteContent } from "./src/content/site.js";

const { site, identity, pages } = siteContent;
const root = fileURLToPath(new URL(".", import.meta.url));

const resolveEntry = (entry) => fileURLToPath(new URL(`./${entry}`, import.meta.url));
const absoluteUrl = (path) => new URL(path, site.origin).href;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Vite 用 HTML 的相对路径标识每个入口，"/index.html" 对应根页面。
const pageByEntry = new Map(pages.map((page) => [`/${page.entry}`, page]));

function renderSeoTags(page) {
  const canonical = absoluteUrl(page.path);
  const image = absoluteUrl(site.socialImage);
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="icon" type="image/png" href="${site.socialImage}" />`,
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
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`
  ].join("\n    ");
}

// 站点是纯客户端渲染，HTML 外壳本身没有正文。给关闭 JavaScript 的访客留一条出路。
function renderNoscriptBody(page) {
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

function renderSitemap(lastmod) {
  const entries = pages
    .filter((page) => page.inSitemap !== false)
    .map((page) =>
      [
        "  <url>",
        `    <loc>${absoluteUrl(page.path)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
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

function renderRobots() {
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

/**
 * 从 src/content/site.js 的 pages 生成每页 head 标签、sitemap.xml 和 robots.txt，
 * 让路由、导航与 SEO 只有一处需要维护。
 */
function siteMetadataPlugin() {
  return {
    name: "afeng-site-metadata",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const page = pageByEntry.get(ctx.path);
        if (!page || page.injectSeo === false) return html;
        if (!html.includes("<!--seo-->")) {
          throw new Error(`${page.entry} 缺少 <!--seo--> 占位符，SEO 标签无法注入`);
        }
        return {
          html: html.replace("<!--seo-->", renderSeoTags(page)),
          tags: [
            {
              tag: "noscript",
              injectTo: "body",
              children: renderNoscriptBody(page)
            }
          ]
        };
      }
    },
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: renderSitemap(lastmod) });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: renderRobots() });
    }
  };
}

export default defineConfig({
  root,
  plugins: [react(), siteMetadataPlugin()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.key, resolveEntry(page.entry)]))
    }
  }
});
