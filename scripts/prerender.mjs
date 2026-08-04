/**
 * 构建期预渲染：把每个页面的 SiteShell（顶栏 + 正文 + 页脚）用 renderToString
 * 渲染成静态 HTML 注入 dist 对应页面的 <div id="root">。
 *
 * 对不执行 JS 的搜索引擎（百度/搜狗/360）是质变——纯 CSR 时它们只能索引
 * title/description，预渲染后能读到真实正文。水合由 hydrateRoot 接管。
 *
 * 运行时机：vite build 之后（package.json 的 build script）。
 */
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputRoot = process.env.PRERENDER_OUT_DIR || join(root, "dist");
const outfile = join(root, "node_modules/.cache/prerender-bundle.cjs");
const siteUpdatedAt = execSync("git log -1 --format=%cs -- .", {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"]
}).trim();
mkdirSync(dirname(outfile), { recursive: true });

// 用 esbuild（vite 的传递依赖）把含 JSX 的渲染入口打包成 Node 可 require 的 CJS。
await build({
  entryPoints: [join(root, "src/prerender-entry.jsx")],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node18",
  outfile,
  define: { "globalThis.__SITE_UPDATED_AT__": JSON.stringify(siteUpdatedAt) },
  jsx: "automatic",
  loader: { ".jsx": "jsx", ".css": "empty" }
});

const { pages, renderPage } = await import(pathToFileURL(outfile).href);

let injected = 0;
for (const page of pages) {
  if (page.injectSeo === false) continue; // visit-counter 隐藏页不套外壳
  const htmlPath = page.entry === "index.html" ? "index.html" : page.entry;
  const fullPath = join(outputRoot, htmlPath);
  const html = readFileSync(fullPath, "utf8");
  if (!html.includes('<div id="root"></div>')) {
    console.warn(`跳过 ${htmlPath}：未找到空的 #root`);
    continue;
  }
  const markup = renderPage(page.key);
  writeFileSync(fullPath, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
  injected += 1;
  console.log(`预渲染 ${htmlPath}（${markup.length} 字节）`);
}
console.log(`完成：${injected} 个页面已注入预渲染 HTML`);
