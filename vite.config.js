import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { pages } from "./src/content/site.js";
import { lensFilterDefs } from "./build/lens-filters.js";
import {
  pageLastModified,
  renderNoscriptBody,
  renderRobots,
  renderSeoTags,
  renderSitemap,
  siteLastModified
} from "./build/seo.js";
import { themeBootScript } from "./build/theme-script.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const siteUpdatedAt = siteLastModified();

const resolveEntry = (entry) => fileURLToPath(new URL(`./${entry}`, import.meta.url));

// Vite 用 HTML 的相对路径标识每个入口，"/index.html" 对应根页面。
const pageByEntry = new Map(pages.map((page) => [`/${page.entry}`, page]));

/**
 * 从 src/content/site.js 的 pages 生成每页 head 标签、sitemap.xml 和 robots.txt，
 * 让路由、导航与 SEO 只有一处需要维护。
 * 标签内容（SEO、SVG 滤镜、主题脚本）分别维护在 build/ 下的独立模块。
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
              tag: "script",
              injectTo: "head-prepend",
              children: themeBootScript
            },
            {
              tag: "svg",
              injectTo: "body-prepend",
              attrs: {
                width: "0",
                height: "0",
                style: "position:absolute;pointer-events:none",
                "aria-hidden": "true"
              },
              children: lensFilterDefs
            },
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
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: renderSitemap(pageLastModified) // 按页取真实最后提交日期
      });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: renderRobots() });
    }
  };
}

export default defineConfig({
  root,
  plugins: [react(), siteMetadataPlugin()],
  define: {
    "globalThis.__SITE_UPDATED_AT__": JSON.stringify(siteUpdatedAt)
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.key, resolveEntry(page.entry)])),
      output: {
        // 把几乎不变的 react 运行时拆成独立 vendor chunk：改一行外壳代码时，
        // 回访者只需重下几 KB 的外壳 chunk，react 部分靠稳定 hash 走缓存。
        manualChunks: { react: ["react", "react-dom"] }
      }
    }
  }
});
