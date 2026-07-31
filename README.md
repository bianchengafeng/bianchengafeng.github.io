# bianchengafeng.github.io

阿峰的个人网站。以「人」为中心，而非以「作品集」或「博客」为中心。

包含首页、项目、博客聚合和关于页面。博客内容继续发布在独立站点 [bianchengafeng.xyz](https://bianchengafeng.xyz)，这里只做摘要发现与导流。

## 技术栈

- **React 19** + **Vite 6** 多页面静态构建
- **liquid-glass-react** 驱动导航栏的实时折射与边缘色散
- 自动浅色 / 深色双主题，手动切换后写入 localStorage
- 原版不蒜子 2.3 访客近似统计 + 20 分钟无活动访问会话（异常时使用最近缓存或降级）
- GitHub Pages 部署，GitHub Actions 自动构建

## 页面结构

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | Home | 个人总览：当前状态、近期痕迹、观点与输入 |
| `/about/` | About | 经历、能力边界、生活与兴趣 |
| `/projects/` | Projects | 代码开源、实践协作、学习实验、研究与发表 |
| `/writing/` | Blog | 聚合 bianchengafeng.xyz 的标题、日期与摘要 |
| `/404.html` | 404 | 未知路径统一渲染，显示原始请求地址 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev
```

默认访问 `http://localhost:5173`。

## 生产构建

```bash
npm run build
```

产物输出到 `dist/`，包含多页面入口和 404 页面。预览构建结果：

```bash
npm run preview
```

## 部署

推送 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。部署流程定义在 `.github/workflows/deploy-pages.yml`。

首次使用需在仓库 Settings > Pages 中将 Source 切换为 **GitHub Actions**。

## 内容配置

网站的公开身份、链接、首页近况、About、Projects、Writing 兜底文章与 SEO 文案集中维护在 [`src/content/site.js`](src/content/site.js)。页面组件只负责渲染；没有真实内容的数组保持为空时，页面会显示正式空状态，不需要添加测试条目。

常用修改位置：

- `identity`：名字、邮箱、GitHub、独立博客与版权年份
- `statistics`：公开访问统计的起始日期、20 分钟会话窗口、专用计数路径和历史基线
- `home`：此刻状态、近期痕迹、当前观点和最近输入
- `about`：个人坐标、做事方式与生活兴趣集合
- `projects.categories[*].items`：按类别增删真实项目，分页自动计算
- `writing`：RSS 地址和 RSS 不可用时的真实文章兜底数据

## License

源码采用 MIT License。个人内容（头像、文案、项目描述等）保留所有权利。
