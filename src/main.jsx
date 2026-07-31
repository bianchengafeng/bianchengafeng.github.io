import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import LiquidGlass from "liquid-glass-react";
import avatarUrl from "../assets/avatar.png";
import { siteContent } from "./content/site.js";
import { ProjectsPage } from "./pages/ProjectsPage.jsx";
import "./site.css";

const base = "/";
const { identity, statistics, home, about, projects, writing, seo } = siteContent;

const navItems = [
  { href: `${base}`, label: "首页", key: "home" },
  { href: `${base}projects/`, label: "项目", key: "projects" },
  { href: `${base}writing/`, label: "博客", key: "writing" },
  { href: `${base}about/`, label: "关于", key: "about" }
];

const Icon = ({ name }) => {
  const paths = {
    sun: <><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    external: <><path d="M14 5h5v5M19 5l-8 8"/><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></>,
    code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/></>,
    pen: <><path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14 7 3 3"/></>,
    heart: <path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z"/>,
    window: <><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 7h.01M10 7h.01"/></>,
    layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/><path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/></>,
    article: <><path d="M6 3.5h8l4 4V20H6V3.5Z"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6"/></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggle = () => setTheme((value) => value === "dark" ? "light" : "dark");
  return { theme, toggle };
}

function GlassNav({ active, theme, onTheme }) {
  const handleGlassPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
  };
  const resetGlassPointer = (event) => {
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };
  return (
    <header className="site-header" onPointerMove={handleGlassPointer} onPointerLeave={resetGlassPointer}>
      <LiquidGlass
        className="liquid-site-nav"
        displacementScale={58}
        blurAmount={0}
        saturation={140}
        aberrationIntensity={1.55}
        elasticity={0.08}
        cornerRadius={30}
        padding="0"
        mode="shader"
        overLight={false}
        style={{ position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%" }}
      >
        <div className="header-inner">
          <a className="site-brand" href={base} aria-label={`${identity.name}的个人主页`}>
            <img src={avatarUrl} alt="" draggable="false" />
            <span>{identity.name}</span>
          </a>
          <nav aria-label="主导航">
            {navItems.map((item) => <a key={item.key} className={active === item.key ? "active" : ""} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={onTheme} aria-label={theme === "dark" ? "切换至浅色主题" : "切换至深色主题"} title={theme === "dark" ? "切换至浅色主题" : "切换至深色主题"}><Icon name="sun"/></button>
          </div>
        </div>
      </LiquidGlass>
    </header>
  );
}

function PortraitStage() {
  return (
    <div className="portrait-stage" aria-label={`${identity.name}的个人头像`}>
      <div className="portrait-aura" aria-hidden="true" />
      <div className="portrait-grid" aria-hidden="true" />
      <div className="portrait-frame">
        <img src={avatarUrl} alt={`${identity.name}的头像`} draggable="false" />
      </div>
      <div className="portrait-stamp"><span>{identity.romanizedName}</span><small>PERSONAL SITE · {identity.copyrightYear}</small></div>
      <div className="portrait-tag portrait-tag-focus"><span>CURRENT</span><strong>{home.now.badge}</strong></div>
      <div className="portrait-tag portrait-tag-stage"><span>STATUS</span><strong>在场</strong></div>
    </div>
  );
}

const SectionTitle = ({ eyebrow, title, aside }) => (
  <header className="section-title">
    <div><span>{eyebrow}</span><h2>{title}</h2></div>
    {aside && <p>{aside}</p>}
  </header>
);

function HomePage() {
  return (
    <main className="home-main">
      <section className="home-intro">
        <div className="intro-copy">
          <p className="intro-line"><span className="status-dot"/>{home.intro.greeting}</p>
          <h1>{home.intro.title[0]}<br/><em>{home.intro.title[1]}</em></h1>
          <p className="intro-summary">{home.intro.summary}</p>
          <div className="hero-links">
            <a className="primary-link" href={`${base}about/`}>进一步认识我 <Icon name="arrow"/></a>
            <a href={identity.githubUrl} target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
          </div>
        </div>
        <PortraitStage />
        <aside className="now-board">
          <div className="now-board-head"><span>此刻 · {home.now.period}</span><span className="live-mark">{home.now.badge}</span></div>
          <div className="now-primary"><small>此刻状态</small><strong>{home.now.headline[0]}<br/>{home.now.headline[1]}</strong></div>
          <div className="focus-list" aria-label="当前状态">
            {home.now.focus.map((item) => <div key={item.label}><Icon name={item.icon}/><span><small>{item.label}</small><strong>{item.value}</strong></span></div>)}
          </div>
          <dl>
            {home.now.facts.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
          </dl>
        </aside>
      </section>

      <section className="trace-section">
        <header className="compact-section-head"><div><span>RECENT TRACES</span><h2>最近留下的痕迹</h2></div><p>不是任务流水，只保留能说明我正在发生什么的片段。</p></header>
        <div className="trace-grid">
          {home.traces.map((item, index) => <article className={`trace-card trace-${item.tone}`} key={`${item.type}-${item.title}`}><div className="trace-meta"><span>0{index + 1} / {item.type}</span><time>{item.date}</time></div><div className="trace-symbol" aria-hidden="true"><Icon name={item.icon}/><span>{item.symbol}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </section>

      <section className="personal-board">
        <article className="viewpoint-card">
          <span>{home.viewpoint.label}</span>
          <p>{home.viewpoint.text[0]}<br/>{home.viewpoint.text[1]}</p>
        </article>
        <article className="curiosity-card">
          <div className="orbit-visual" aria-hidden="true"><span/><span/><span/><i/></div>
          <div><span>{home.curiosity.label}</span><h2>{home.curiosity.title}</h2><p>{home.curiosity.text}</p></div>
        </article>
        <article className="shelf-card">
          <div className="shelf-head"><span>最近输入</span><small>{home.recentInputs.length ? `${home.recentInputs.length} 项` : "尚未整理"}</small></div>
          {home.recentInputs.length ? home.recentInputs.map((item) => <a className="input-placeholder" href={item.href} target="_blank" rel="noreferrer" key={item.title}><span>{item.type}</span><strong>{item.title}</strong><i aria-hidden="true"><Icon name="article"/></i></a>) : <div className="input-placeholder" aria-label="最近输入内容尚未整理"><span>BOOK / ARTICLE</span><strong>真实内容整理后，会从这里开始。</strong><i aria-hidden="true"><Icon name="article"/></i></div>}
          <p>这里只保留真正愿意推荐或重读的内容，并说明为什么留下。</p>
        </article>
      </section>

      <section className="site-bridge">
        <header><span>EXPLORE FURTHER</span><h2>想继续了解哪一面？</h2><p>从三个入口继续，各自承载不同内容。</p></header>
        <nav aria-label="深入了解"><a href={`${base}projects/`}><span className="bridge-index">01</span><span><small>PROJECTS</small><strong>项目</strong></span><Icon name="arrow"/></a><a href={`${base}writing/`}><span className="bridge-index">02</span><span><small>BLOG</small><strong>博客</strong></span><Icon name="arrow"/></a><a href={`${base}about/`}><span className="bridge-index">03</span><span><small>ABOUT</small><strong>关于</strong></span><Icon name="arrow"/></a></nav>
      </section>
    </main>
  );
}

function AboutPage() {
  const lifeCollections = about.lifeCollections;
  const [lifeTab, setLifeTab] = useState(lifeCollections[0].key);
  const activeLifeCollection = lifeCollections.find((collection) => collection.key === lifeTab) || lifeCollections[0];
  return <main className="inner-page about-page">
    <header className="inner-visual-hero about-visual-hero">
      <div className="inner-hero-copy"><span>ABOUT / 03</span><h1>{about.heroTitle}</h1><p>{about.heroSummary}</p></div>
      <div className="about-portrait"><div className="about-portrait-ring"/><img src={avatarUrl} alt={`${identity.name}的头像`} draggable="false"/><span>{identity.romanizedName} · {identity.copyrightYear}</span></div>
      <aside className="about-principles"><span>我更在意</span>{about.principles.map((item) => <strong key={item}>{item}</strong>)}</aside>
    </header>
    <section className="about-profile-flow">
      <div className="about-profile-lead"><span>现在的我</span><p>{about.profileSummary}</p></div>
      <div className="about-profile-details">
        <div className="about-coordinate"><span>个人坐标</span><dl>{about.coordinates.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>
        <div className="about-method"><span>做事方式</span><div className="method-path">{about.methods.map((item) => <React.Fragment key={item.title}><i/><div><strong>{item.title}</strong><small>{item.detail}</small></div></React.Fragment>)}</div></div>
      </div>
    </section>
    <section className="about-life-section"><header><span>生活与兴趣</span><h2>专业之外，也应该看见一个完整的人。</h2><p>这里只展示真实整理过的内容；尚未准备好的部分会明确留空，不使用示例填充。</p></header><div className="life-collection"><nav className="life-collection-tabs" aria-label="生活与兴趣分类">{lifeCollections.map((collection, index) => <button type="button" className={lifeTab === collection.key ? "active" : ""} onClick={() => setLifeTab(collection.key)} aria-pressed={lifeTab === collection.key} key={collection.key}><span>0{index + 1}</span><strong>{collection.label}</strong><small>{collection.items.length ? `${collection.items.length} 条` : "尚未整理"}</small></button>)}</nav><div className="life-collection-panel" aria-live="polite"><header><div><span>当前集合</span><h3>{activeLifeCollection.label}</h3></div><p>{activeLifeCollection.intro}</p></header>{activeLifeCollection.items.length ? <div className="life-collection-items">{activeLifeCollection.items.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><small>{item.meta}</small><strong>{item.title}</strong><p>{item.text}</p></div><Icon name={lifeTab === "interests" ? "heart" : lifeTab === "inputs" ? "article" : "layers"}/></article>)}</div> : <div className="life-collection-empty"><Icon name={lifeTab === "interests" ? "heart" : lifeTab === "inputs" ? "article" : "layers"}/><strong>尚未整理</strong><p>{activeLifeCollection.emptyText}</p></div>}<footer><strong>内容原则</strong><span>只收录真实、愿意公开且值得长期保留的内容。</span></footer></div></div></section>
  </main>;
}

function WritingPage() {
  const fallback = useMemo(() => writing.fallbackPosts, []);
  const [posts, setPosts] = useState(fallback);
  useEffect(() => {
    fetch(writing.feedUrl).then((response) => response.text()).then((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const items = [...doc.querySelectorAll("item")].slice(0, 5).map((item) => ({
        title: item.querySelector("title")?.textContent || "未命名文章",
        link: item.querySelector("link")?.textContent || identity.blogUrl,
        date: new Date(item.querySelector("pubDate")?.textContent || Date.now()).toLocaleDateString("zh-CN"),
        text: (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "").slice(0, 100)
      }));
      if (items.length) setPosts(items);
    }).catch(() => {});
  }, [fallback]);
  return <main className="inner-page blog-page">
    <header className="inner-visual-hero blog-visual-hero"><div className="inner-hero-copy"><span>BLOG / 02</span><h1>博客文章，来自另一个长期空间。</h1><p>这里负责发现与导流。技术文章、学习笔记和完整归档继续发布在「阿峰的编程笔记」。</p></div><a className="blog-hero-mark" href={identity.blogUrl} target="_blank" rel="noreferrer" aria-label={`前往${identity.blogName}`}><img src={avatarUrl} alt="" draggable="false"/><div><span>BIANCHENGAFENG.XYZ</span><strong>{identity.blogName}</strong><small>独立博客 · 外部阅读</small></div><Icon name="external"/></a></header>
    <aside className="content-boundary"><div><span>这里展示</span><strong>博客标题、日期与摘要</strong></div><i/><div><span>不会放在这里</span><strong>论文、技术报告与研究发表</strong></div></aside>
    <section className="blog-feed"><header><span>最近更新</span><h2>从独立博客带来的文章。</h2><p>点击任意条目后，将前往 bianchengafeng.xyz 阅读全文。</p></header><div className="blog-article-grid">{posts.map((post, index) => <a className={index === 0 ? "featured-blog-post" : ""} key={`${post.link}-${index}`} href={post.link} target="_blank" rel="noreferrer"><div className="blog-post-meta"><span>0{index + 1}</span><time>{post.date}</time></div><div className="blog-post-glyph" aria-hidden="true"><Icon name="article"/></div>{index === 0 && <div className="featured-blog-context"><span>LATEST FROM THE BLOG</span><strong>最新文章</strong><i/></div>}<h3>{post.title}</h3><p>{post.text}</p>{index === 0 && <dl className="featured-blog-facts"><div><dt>来源</dt><dd>bianchengafeng.xyz</dd></div><div><dt>内容</dt><dd>标题 · 摘要 · 外部全文</dd></div></dl>}<small>前往独立博客阅读 <Icon name="external"/></small></a>)}</div></section>
    <a className="blog-portal" href={identity.blogUrl} target="_blank" rel="noreferrer"><span><small>完整归档、标签与系列</small>打开「{identity.blogName}」</span><Icon name="arrow"/></a>
  </main>;
}

function NotFoundPage() {
  return <main className="not-found-page">
    <section className="not-found-stage">
      <div className="not-found-code" aria-hidden="true"><span>404</span><small>PAGE NOT FOUND</small></div>
      <div className="not-found-copy">
        <span>ERROR / 404</span>
        <h1>这里没有对应的页面。</h1>
        <p>地址可能输入有误，页面也可能已经移动。你可以返回首页，或从下面三个入口继续浏览。</p>
        <div className="not-found-actions"><a className="primary-link" href={base}>返回首页 <Icon name="arrow"/></a><a href={`${base}projects/`}>查看项目</a><a href={`${base}writing/`}>前往博客</a></div>
      </div>
      <aside className="not-found-path" aria-label="当前未找到的地址"><small>REQUESTED PATH</small><code>{window.location.pathname}</code><span>没有匹配到站内页面</span></aside>
    </section>
  </main>;
}

function Footer() {
  const localPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.hostname.endsWith(".local");

  useEffect(() => {
    const statBaselines = {
      busuanzi_value_site_uv: statistics.baseline.visitors,
      busuanzi_value_site_pv: statistics.baseline.pageViews
    };
    const statIds = Object.keys(statBaselines);
    const setStatText = (text) => statIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.textContent = text;
    });
    if (localPreview) {
      setStatText("正式上线后统计");
      return undefined;
    }
    const showUnavailable = (node) => {
      const stat = node?.closest(".footer-stat");
      if (stat) stat.innerHTML = "<small>STATISTICS</small><span>统计暂不可用</span>";
    };
    const validateStat = (node) => {
      const value = (node?.textContent || "").trim();
      if (value === node?.dataset.counterDisplay || /读取中|加载中/.test(value)) return;
      if (!/^\d+$/.test(value)) {
        showUnavailable(node);
        return;
      }
      const current = Number.parseInt(value, 10);
      const baseline = statBaselines[node.id];
      const display = Math.max(0, current - baseline).toLocaleString("zh-CN");
      node.dataset.counterDisplay = display;
      node.textContent = display;
    };
    const statNodes = statIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new MutationObserver(() => statNodes.forEach(validateStat));
    statNodes.forEach((node) => observer.observe(node, { childList: true, characterData: true, subtree: true }));
    let script = document.getElementById("busuanzi-counter");
    if (!script) {
      script = document.createElement("script");
      script.id = "busuanzi-counter";
      script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
      script.defer = true;
      script.onerror = () => statNodes.forEach(showUnavailable);
      document.body.appendChild(script);
    }
    const timeout = window.setTimeout(() => statNodes.forEach((node) => {
      const value = (node.textContent || "").trim();
      if (value !== node.dataset.counterDisplay && !/^\d+$/.test(value)) showUnavailable(node);
    }), 8000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [localPreview]);

  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity"><span>{identity.siteLabel}</span><strong>感谢到访。</strong><p>这是{identity.name}的个人网站。近况、项目与入口会随真实内容更新。</p></div>
      <div className="footer-utility">
        <div className="footer-stats" aria-label={`自 ${statistics.since} 起的网站访问统计`}>
          <div className="footer-stat"><small>VISITORS · SINCE {statistics.since}</small><span><strong id="busuanzi_value_site_uv">读取中</strong> 位访客</span></div>
          <div className="footer-stat"><small>PAGE VIEWS · SINCE {statistics.since}</small><span><strong id="busuanzi_value_site_pv">读取中</strong> 次访问</span></div>
        </div>
        <nav className="footer-links" aria-label="页脚链接">
          <a href={`mailto:${identity.email}`}>Email <Icon name="arrow"/></a>
          <a href={identity.githubUrl} target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
          <a href={identity.blogUrl} target="_blank" rel="noreferrer">独立博客 <Icon name="external"/></a>
        </nav>
      </div>
    </div>
    <div className="footer-bottom"><small>© {identity.copyrightYear} {identity.name} · All rights reserved.</small><span>Personal site · Last updated {identity.lastUpdatedYear}</span></div>
  </footer>;
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const route = path === "/" || path === "/index.html"
    ? "home"
    : path === "/about" || path === "/about/index.html"
      ? "about"
      : path === "/projects" || path === "/projects/index.html"
        ? "projects"
        : path === "/writing" || path === "/writing/index.html"
          ? "writing"
          : "not-found";
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const pageSeo = seo[route === "not-found" ? "notFound" : route];
    document.title = pageSeo.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = pageSeo.description;
  }, [route]);
  return <><a className="skip-link" href="#content">跳到主要内容</a><GlassNav active={route} theme={theme} onTheme={toggle}/><div id="content">{route === "about" ? <AboutPage/> : route === "projects" ? <ProjectsPage Icon={Icon}/> : route === "writing" ? <WritingPage/> : route === "home" ? <HomePage/> : <NotFoundPage/>}</div><Footer/></>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
