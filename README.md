# bianchengafeng.github.io

阿峰的个人网站。以「人」为中心，而非以「作品集」或「博客」为中心。

包含首页、项目、博客聚合和关于页面。博客内容继续发布在独立站点 [bianchengafeng.xyz](https://bianchengafeng.xyz)，这里只做摘要发现与导流。

## 技术栈

- **React 19** + **Vite 6** 多页面静态构建，每个页面一个独立入口与 CSS 分块
- 自研液态玻璃导航：构建期注入 SVG `feDisplacementMap` 三通道色散滤镜，运行期用 Canvas 生成透镜贴图，弹簧过渡 + 落位扫光
- 自动浅色 / 深色双主题，手动切换后写入 localStorage
- 原版不蒜子 2.3 新访客增量 + 20 分钟无活动访问会话；两项按各自启用时点展示（异常时使用最近缓存或降级）
- 构建期从内容配置生成每页 SEO 标签、`sitemap.xml`、`robots.txt` 与 `<noscript>` 兜底
- GitHub Pages 部署，GitHub Actions 在构建前执行 lint、格式检查与测试

## 页面结构

| 路径         | 页面     | 说明                                       |
| ------------ | -------- | ------------------------------------------ |
| `/`          | Home     | 个人总览：当前状态、近期痕迹、观点与输入   |
| `/about/`    | About    | 经历、能力边界、生活与兴趣                 |
| `/projects/` | Projects | 代码开源、实践协作、学习实验、研究与发表   |
| `/writing/`  | Blog     | 聚合 bianchengafeng.xyz 的标题、日期与摘要 |
| `/404.html`  | 404      | 未知路径统一渲染，显示原始请求地址         |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev
```

默认访问 `http://localhost:5173`。

## 质量检查

```bash
npm run lint          # ESLint（含 react / react-hooks 规则）
npm run format:check  # Prettier 格式校验
npm run format        # 按 Prettier 规则重写
npm test              # node:test 单元测试
```

这四项在 GitHub Actions 中于构建前执行，任何一项失败都会阻断部署。

## 生产构建

```bash
npm run build
```

产物输出到 `dist/`，包含多页面入口、404 页面、`sitemap.xml` 和 `robots.txt`。预览构建结果：

```bash
npm run preview
```

## 部署

推送 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。部署流程定义在 `.github/workflows/deploy-pages.yml`。

首次使用需在仓库 Settings > Pages 中将 Source 切换为 **GitHub Actions**。

## 内容配置

网站的公开身份、链接、路由、首页近况、About、Projects、Writing RSS 地址与 SEO 文案集中维护在 [`src/content/site.js`](src/content/site.js)。页面组件只负责渲染；没有真实内容的数组保持为空时，页面会显示正式空状态，不需要添加测试条目。

常用修改位置：

- `site`：站点域名、社交预览图与主题色
- `pages`：路由、构建入口、导航标签与每页 SEO 文案。新增页面只需在这里加一项，再补上对应的 HTML 外壳和 `src/entries/` 入口，构建入口和 `sitemap.xml` 会自动跟随
- `identity`：名字、邮箱、GitHub、独立博客（版权年份取当前年，无需手动维护）
- `statistics.newVisitors`：新访客增量的起始日期与旧站历史基线
- `statistics.sessions`：20 分钟会话窗口、功能启用说明、专用计数路径和会话基线
- `home`：此刻状态、近期痕迹、当前观点和最近输入
- `about`：个人坐标、做事方式与生活兴趣集合
- `projects.categories[*].items`：按类别增删真实项目，分页自动计算
- `writing`：独立博客 RSS 地址；文章以实时 RSS 为唯一来源，空内容和读取失败会显示不同状态

## 目录结构

```text
src/
  content/site.js   内容与路由的唯一来源
  entries/          每个页面一个构建入口
  pages/            页面组件
  components/       导航、页脚、外壳、错误边界与图标
  styles/           base.css + 每页一个样式文件
  statistics.js     访问统计（会话判定、缓存、跨标签页锁）
  writing-feed.js   RSS 抓取与解析
  project-pagination.js  项目分页计算
  lens-map.js       Canvas 生成玻璃透镜位移贴图
  visit-counter.js  承载不蒜子的隐藏计数页脚本
tests/              node:test 单元测试（statistics / writing-feed / project-pagination / 样式约定）
```

## License

源码采用 MIT License。个人内容（头像、文案、项目描述等）保留所有权利。
