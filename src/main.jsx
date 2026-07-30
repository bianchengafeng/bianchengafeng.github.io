import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import LiquidGlass from "liquid-glass-react";
import avatarUrl from "../assets/avatar.png";
import "./site.css";

const base = "/";

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
          <a className="site-brand" href={base} aria-label="阿峰的个人主页">
            <img src={avatarUrl} alt="" draggable="false" />
            <span>阿峰</span>
          </a>
          <nav aria-label="主导航">
            {navItems.map((item) => <a key={item.key} className={active === item.key ? "active" : ""} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <a className="contact-link" href="mailto:3095635643@qq.com">联系</a>
            <button className="theme-toggle" onClick={onTheme} aria-label={theme === "dark" ? "切换至浅色主题" : "切换至深色主题"} title={theme === "dark" ? "切换至浅色主题" : "切换至深色主题"}><Icon name="sun"/></button>
          </div>
        </div>
      </LiquidGlass>
    </header>
  );
}

function PortraitStage() {
  return (
    <div className="portrait-stage" aria-label="阿峰的个人头像">
      <div className="portrait-aura" aria-hidden="true" />
      <div className="portrait-grid" aria-hidden="true" />
      <div className="portrait-frame">
        <img src={avatarUrl} alt="阿峰的头像" draggable="false" />
      </div>
      <div className="portrait-stamp"><span>AFENG</span><small>PERSONAL SITE · 2026</small></div>
      <div className="portrait-tag portrait-tag-focus"><span>CURRENT</span><strong>持续更新</strong></div>
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
  const traces = [
    { type: "UPDATE", date: "现在", title: "重新整理这里", text: "让这个空间更接近此刻真实的我。", tone: "blue" },
    { type: "LEARN", date: "近期", title: "保持输入", text: "把读过、看过和真正留下来的东西慢慢整理出来。", tone: "cyan" },
    { type: "WRITE", date: "持续", title: "留下表达", text: "完整文章仍发布在独立博客。", tone: "slate" }
  ];
  return (
    <>
      <main className="home-main">
        <section className="home-intro">
          <div className="intro-copy">
            <p className="intro-line"><span className="status-dot"/>你好，我是阿峰</p>
            <h1>这里记录此刻，<br/><em>也为变化留白。</em></h1>
            <p className="intro-summary">这是一个持续变化的个人空间。放下当下的状态、最近留下的痕迹，以及那些愿意长久保留的东西。</p>
            <div className="hero-links">
              <a className="primary-link" href={`${base}about/`}>进一步认识我 <Icon name="arrow"/></a>
              <a href="https://github.com/bianchengafeng" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
            </div>
          </div>
          <PortraitStage />
          <aside className="now-board">
            <div className="now-board-head"><span>此刻 · 2026.07</span><span className="live-mark">持续更新</span></div>
            <div className="now-primary"><small>此刻状态</small><strong>保持输入，<br/>也认真留下</strong></div>
            <div className="focus-list" aria-label="当前状态">
              <div><Icon name="layers"/><span><small>正在做</small><strong>整理最近的输入</strong></span></div>
              <div><Icon name="window"/><span><small>正在完善</small><strong>这个个人空间</strong></span></div>
              <div><Icon name="article"/><span><small>正在留下</small><strong>值得保留的片段</strong></span></div>
            </div>
            <dl>
              <div><dt>近况</dt><dd>学习、尝试、整理</dd></div>
              <div><dt>更新</dt><dd>随真实变化发生</dd></div>
              <div><dt>状态</dt><dd>继续向前</dd></div>
            </dl>
          </aside>
        </section>

        <section className="trace-section">
          <header className="compact-section-head"><div><span>RECENT TRACES</span><h2>最近留下的痕迹</h2></div><p>不是任务流水，只保留能说明我正在发生什么的片段。</p></header>
          <div className="trace-grid">
            {traces.map((item, index) => {
              const visual = item.type === "UPDATE" ? "window" : item.type === "LEARN" ? "layers" : "article";
              return <article className={`trace-card trace-${item.tone}`} key={item.type}><div className="trace-meta"><span>0{index + 1} / {item.type}</span><time>{item.date}</time></div><div className="trace-symbol" aria-hidden="true"><Icon name={visual}/><span>{item.type === "UPDATE" ? "当下记录" : item.type === "LEARN" ? "输入 → 留下" : "独立博客"}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>;
            })}
          </div>
        </section>

        <section className="personal-board">
          <article className="viewpoint-card">
            <span>ONE THOUGHT</span>
            <p>先做出真实的东西，<br/>再决定如何定义自己。</p>
            <small>当前观点占位 · 可随时替换</small>
          </article>
          <article className="curiosity-card">
            <div className="orbit-visual" aria-hidden="true"><span/><span/><span/><i/></div>
            <div><span>CURIOSITY MAP</span><h2>好奇心并不只在专业里。</h2><p>兴趣、生活状态、喜欢的作品和去过的地方，会在这里逐步出现。</p></div>
          </article>
          <article className="shelf-card">
            <div className="shelf-head"><span>最近输入</span><small>尚未整理</small></div>
            <div className="input-placeholder" aria-label="最近输入内容尚未整理">
              <span>BOOK / ARTICLE</span>
              <strong>内容整理后，会从这里开始。</strong>
              <i aria-hidden="true"><Icon name="article"/></i>
            </div>
            <p>以后可以放书、文章、音乐、影视、工具或收藏链接；每项同时说明“为什么留下”，不做无意义清单。</p>
          </article>
        </section>

        <section className="site-bridge">
          <header><span>EXPLORE FURTHER</span><h2>想继续了解哪一面？</h2><p>从三个入口继续，各自承载不同内容。</p></header>
          <nav aria-label="深入了解"><a href={`${base}projects/`}><span className="bridge-index">01</span><span><small>PROJECTS</small><strong>项目</strong></span><Icon name="arrow"/></a><a href={`${base}writing/`}><span className="bridge-index">02</span><span><small>BLOG</small><strong>博客</strong></span><Icon name="arrow"/></a><a href={`${base}about/`}><span className="bridge-index">03</span><span><small>ABOUT</small><strong>关于</strong></span><Icon name="arrow"/></a></nav>
        </section>
      </main>
    </>
  );
}

function AboutPage() {
  const lifeCollections = [
    {
      key: "interests",
      label: "兴趣与爱好",
      note: "3 条测试内容",
      intro: "用于展示长期兴趣如何被整理：不是列关键词，而是说明为什么愿意持续投入。",
      items: [
        { title: "影像与叙事", meta: "测试内容 · 非真实资料", text: "演示兴趣条目的标题、缘由和状态应如何组合。" },
        { title: "长距离散步", meta: "测试内容 · 非真实资料", text: "演示生活类兴趣不依赖图片也能形成完整表达。" },
        { title: "工具与物件", meta: "测试内容 · 非真实资料", text: "演示收藏类内容可以说明使用体验和留下原因。" }
      ]
    },
    {
      key: "inputs",
      label: "最近输入",
      note: "3 条测试内容",
      intro: "书、文章、影视、音乐或工具都可以进入这里，但每项必须解释为什么留下。",
      items: [
        { title: "一本尚未命名的书", meta: "测试内容 · 阅读", text: "重点不是完成清单，而是保留真正改变想法的一句话。" },
        { title: "一篇值得重读的文章", meta: "测试内容 · 文章", text: "正式内容可链接到原文，同时附上简短个人判断。" },
        { title: "一张循环播放的专辑", meta: "测试内容 · 音乐", text: "用于验证不同媒介在同一集合里的统一呈现。" }
      ]
    },
    {
      key: "traces",
      label: "收藏与足迹",
      note: "3 条测试内容",
      intro: "把重要链接、喜欢的物件和去过的地方整理为有限集合，而不是无限纵向堆积。",
      items: [
        { title: "一个长期保留的网站", meta: "测试内容 · 链接", text: "正式内容可展示链接、收藏时间和保留原因。" },
        { title: "一件经常使用的物件", meta: "测试内容 · 物件", text: "用于展示个人选择和日常体验，而不是商品推荐。" },
        { title: "一个想再次到访的地方", meta: "测试内容 · 地点", text: "未来可加入照片，但没有图片时也保持完整。" }
      ]
    }
  ];
  const [lifeTab, setLifeTab] = useState("interests");
  const activeLifeCollection = lifeCollections.find((collection) => collection.key === lifeTab) || lifeCollections[0];
  return <main className="inner-page about-page">
    <header className="inner-visual-hero about-visual-hero">
      <div className="inner-hero-copy"><span>ABOUT / 03</span><h1>认识标签之外的我。</h1><p>这里不只列出身份和经历，也记录兴趣、做事方式，以及仍在形成中的部分。</p></div>
      <div className="about-portrait"><div className="about-portrait-ring"/><img src={avatarUrl} alt="阿峰的头像" draggable="false"/><span>AFENG · 2026</span></div>
      <aside className="about-principles"><span>我更在意</span><strong>真实地完成一件事</strong><strong>把复杂问题讲清楚</strong><strong>给变化保留空间</strong></aside>
    </header>
    <section className="about-profile-flow">
      <div className="about-profile-lead"><span>现在的我</span><p>正在探索，也正在研究。通过学习、项目和写作，把模糊的问题一步步变成可见的结果。</p></div>
      <div className="about-profile-details">
        <div className="about-coordinate"><span>个人坐标</span><dl><div><dt>专业</dt><dd>计算机</dd></div><div><dt>关注</dt><dd>AI / Computer Vision</dd></div><div><dt>表达</dt><dd>代码 · 设计 · 写作</dd></div><div><dt>状态</dt><dd>探索与研究中</dd></div></dl></div>
        <div className="about-method"><span>做事方式</span><div className="method-path"><i/><div><strong>先理解</strong><small>不急着套答案</small></div><i/><div><strong>再动手</strong><small>用可见结果验证</small></div><i/><div><strong>后复盘</strong><small>留下可复用经验</small></div></div></div>
      </div>
    </section>
    <section className="about-life-section"><header><span>生活与兴趣</span><h2>专业之外，也应该看见一个完整的人。</h2><p>这里使用固定高度的集合切换，而不是每增加一项就继续拉长页面。当前内容全部是结构测试，之后可整体替换。</p></header><div className="life-collection"><nav className="life-collection-tabs" aria-label="生活与兴趣分类">{lifeCollections.map((collection, index) => <button type="button" className={lifeTab === collection.key ? "active" : ""} onClick={() => setLifeTab(collection.key)} aria-pressed={lifeTab === collection.key} key={collection.key}><span>0{index + 1}</span><strong>{collection.label}</strong><small>{collection.note}</small></button>)}</nav><div className="life-collection-panel" aria-live="polite"><header><div><span>当前集合</span><h3>{activeLifeCollection.label}</h3></div><p>{activeLifeCollection.intro}</p></header><div className="life-collection-items">{activeLifeCollection.items.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><small>{item.meta}</small><strong>{item.title}</strong><p>{item.text}</p></div><Icon name={lifeTab === "interests" ? "heart" : lifeTab === "inputs" ? "article" : "layers"}/></article>)}</div><footer><strong>测试内容说明</strong><span>本区域所有条目均为非真实测试资料，仅用于验证内容增加后的切换结构。</span></footer></div></div></section>
  </main>;
}

function ProjectsPage() {
  const codeProjects = [
    {
      id: "01",
      title: "这个个人网站",
      eyebrow: "真实项目",
      summary: "关于个人表达、信息架构、视觉设计和 React 实现的一次长期尝试。它本身就是当前最完整的项目证据。",
      role: "设计与开发",
      stack: "React · Vite · Liquid Glass",
      status: "持续迭代",
      href: "https://github.com/bianchengafeng/bianchengafeng.github.io",
      linkLabel: "查看 GitHub 仓库",
      real: true
    },
    {
      id: "02",
      title: "图像整理小工具",
      eyebrow: "测试案例 · 非真实成果",
      summary: "用于演示同一分类出现多个项目时的排版。未来可替换为真实工具，并补充问题背景、主要功能、截图和仓库链接。",
      role: "个人练习",
      stack: "Python · CLI",
      status: "测试占位",
      real: false
    },
    {
      id: "03",
      title: "轻量阅读清单",
      eyebrow: "测试案例 · 非真实成果",
      summary: "用于演示项目列表继续增长后的结构。测试内容不会被视为个人经历，初始化真实内容时可直接删除整个条目。",
      role: "结构示例",
      stack: "Web · Local Data",
      status: "测试占位",
      real: false
    },
    {
      id: "04",
      title: "课程资料索引",
      eyebrow: "测试案例 · 非真实成果",
      summary: "测试项目数量超过首屏容量后的第二页。这里演示一个偏内容整理类项目应如何呈现。",
      role: "结构示例",
      stack: "Static Site · Search",
      status: "测试占位",
      real: false
    },
    {
      id: "05",
      title: "桌面效率脚本",
      eyebrow: "测试案例 · 非真实成果",
      summary: "测试更多代码项目加入后的分页状态，以及较短项目说明在统一信息骨架中的表现。",
      role: "结构示例",
      stack: "Python · Automation",
      status: "测试占位",
      real: false
    },
    {
      id: "06",
      title: "小型数据看板",
      eyebrow: "测试案例 · 非真实成果",
      summary: "测试项目列表增长到两页时的浏览与切换，不代表真实成果，也不参与个人能力陈述。",
      role: "结构示例",
      stack: "React · Charts",
      status: "测试占位",
      real: false
    },
    {
      id: "07",
      title: "实验记录工具",
      eyebrow: "测试案例 · 非真实成果",
      summary: "用于验证第三页和不足一页的尾部状态。未来可直接替换为真实项目数据。",
      role: "结构示例",
      stack: "Web · IndexedDB",
      status: "测试占位",
      real: false
    }
  ];
  const [projectPage, setProjectPage] = useState(0);
  const projectPageSize = 3;
  const projectPageCount = Math.ceil(codeProjects.length / projectPageSize);
  const visibleCodeProjects = codeProjects.slice(projectPage * projectPageSize, (projectPage + 1) * projectPageSize);
  const categories = [
    { id: "01", icon: "code", title: "代码与开源", text: "GitHub 仓库、独立工具、网站和可公开查看的代码成果。", count: "1 项真实 · 6 项测试", tone: "blue" },
    { id: "02", icon: "window", title: "实践与协作", text: "现实中参与的产品、活动、团队协作或解决具体问题的实践。", count: "等待补充", tone: "cyan" },
    { id: "03", icon: "layers", title: "学习与实验", text: "课程作品、论文复现、小型实验和探索过程，不必包装成成熟项目。", count: "等待补充", tone: "slate" },
    { id: "04", icon: "article", title: "研究与发表", text: "未来的论文、技术报告、海报或可公开研究文章；与博客内容明确分开。", count: "尚无公开内容", tone: "dark" }
  ];
  return <main className="inner-page projects-page">
    <header className="inner-visual-hero projects-visual-hero"><div className="inner-hero-copy"><span>PROJECTS / 01</span><h1>项目不只存在于 GitHub。</h1><p>代码仓库只是证据之一。这里同时容纳现实实践、学习实验，以及未来真正形成的研究成果。</p></div><div className="project-hero-visual" aria-hidden="true"><div className="project-window"><i/><i/><i/><span>&lt; build something real /&gt;</span></div><div className="project-stack"><i/><i/><i/></div></div></header>
    <section className="project-categories"><header><span>项目目录</span><h2>按内容类型查看。</h2><p>四个入口分别通向对应内容区域。</p></header><nav className="category-grid" aria-label="项目分类目录">{categories.map((item) => <a href={`#project-${item.id}`} className={`category-card category-${item.tone}`} key={item.id}><div><span>{item.id}</span><Icon name={item.icon}/></div><h3>{item.title}</h3><p>{item.text}</p><small>{item.count} · 查看详情</small></a>)}</nav></section>
    <section className="project-detail-list" aria-label="项目分类详情">
      <article id="project-01" className="project-detail project-code-collection"><header><span>01 / 代码与开源</span><strong>1 项真实 · 6 项测试</strong></header><div className="project-collection-intro"><div><small>分页项目浏览器</small><h2>项目再多，也不让页面无限变长。</h2></div><p>每页固定展示三个项目。以后只需要增删数据条目，页数会自动变化；每条仍保留性质、简介、角色、技术、状态和证据链接。</p></div><div className="project-browser" aria-live="polite"><div className="project-browser-toolbar"><span>PAGE {String(projectPage + 1).padStart(2, "0")} / {String(projectPageCount).padStart(2, "0")}</span><div>{Array.from({ length: projectPageCount }, (_, index) => <button type="button" className={projectPage === index ? "active" : ""} onClick={() => setProjectPage(index)} aria-label={`查看第 ${index + 1} 页项目`} aria-pressed={projectPage === index} key={index}>{String(index + 1).padStart(2, "0")}</button>)}</div></div><div className="project-entry-list">{visibleCodeProjects.map((project) => <article className={`project-entry ${project.real ? "project-entry-real" : "project-entry-demo"}`} key={project.id}><div className="project-entry-index"><span>{project.id}</span><Icon name={project.real ? "window" : "code"}/></div><div className="project-entry-copy"><small>{project.eyebrow}</small><h3>{project.title}</h3><p>{project.summary}</p></div><dl><div><dt>角色</dt><dd>{project.role}</dd></div><div><dt>技术</dt><dd>{project.stack}</dd></div><div><dt>状态</dt><dd>{project.status}</dd></div></dl><div className="project-entry-action">{project.href ? <a href={project.href} target="_blank" rel="noreferrer">{project.linkLabel} <Icon name="external"/></a> : <span>仅用于测试布局</span>}</div></article>)}</div><div className="project-browser-nav"><button type="button" onClick={() => setProjectPage((page) => Math.max(0, page - 1))} disabled={projectPage === 0}>上一页</button><span>本页 {visibleCodeProjects.length} 项 · 共 {codeProjects.length} 项</span><button type="button" onClick={() => setProjectPage((page) => Math.min(projectPageCount - 1, page + 1))} disabled={projectPage === projectPageCount - 1}>下一页</button></div></div><p className="project-demo-note"><strong>测试内容说明：</strong>除“这个个人网站”外，其余六项均为分页与增长场景测试，不代表真实项目或个人经历，正式填充内容时可直接删除。</p></article>
      <article id="project-02" className="project-detail project-detail-empty"><header><span>02 / 实践与协作</span><strong>等待真实内容</strong></header><div><Icon name="window"/><h3>现实项目会放在这里</h3><p>产品实践、团队协作、活动成果，以及解决具体问题的过程证据。</p></div></article>
      <article id="project-03" className="project-detail project-detail-empty"><header><span>03 / 学习与实验</span><strong>等待真实内容</strong></header><div><Icon name="layers"/><h3>探索过程也值得保留</h3><p>课程作品、论文复现、小型实验，以及阶段性的目标、方法与结论。</p></div></article>
      <article id="project-04" className="project-detail project-detail-empty project-detail-research"><header><span>04 / 研究与发表</span><strong>尚无公开内容</strong></header><div><Icon name="article"/><h3>正式研究输出的位置</h3><p>未来用于论文、技术报告和学术海报；内容足够后再独立为 Research 页面。</p></div></article>
    </section>
  </main>;
}

function WritingPage() {
  const fallback = useMemo(() => [
    { title: "Hugo SEO 配置指南", date: "2026.06.06", text: "从现有独立博客聚合的文章摘要。", link: "https://bianchengafeng.xyz/posts/hugo-seo-guide/" },
    { title: "使用 Mermaid 绘制流程图", date: "2026.06.06", text: "完整文章仍在 bianchengafeng.xyz 阅读。", link: "https://bianchengafeng.xyz/posts/mermaid-flowchart/" },
    { title: "Docker 容器化与轻量级部署实践", date: "2026.06.01", text: "Writing 页面只负责发现和导流。", link: "https://bianchengafeng.xyz/posts/docker-containerization/" }
  ], []);
  const [posts, setPosts] = useState(fallback);
  useEffect(() => {
    fetch("https://bianchengafeng.xyz/index.xml").then((response) => response.text()).then((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const items = [...doc.querySelectorAll("item")].slice(0, 5).map((item) => ({
        title: item.querySelector("title")?.textContent || "未命名文章",
        link: item.querySelector("link")?.textContent || "https://bianchengafeng.xyz",
        date: new Date(item.querySelector("pubDate")?.textContent || Date.now()).toLocaleDateString("zh-CN"),
        text: (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "").slice(0, 100)
      }));
      if (items.length) setPosts(items);
    }).catch(() => {});
  }, [fallback]);
  return <main className="inner-page blog-page">
    <header className="inner-visual-hero blog-visual-hero"><div className="inner-hero-copy"><span>BLOG / 02</span><h1>博客文章，来自另一个长期空间。</h1><p>这里负责发现与导流。技术文章、学习笔记和完整归档继续发布在「阿峰的编程笔记」。</p></div><a className="blog-hero-mark" href="https://bianchengafeng.xyz" target="_blank" rel="noreferrer" aria-label="前往阿峰的编程笔记"><img src={avatarUrl} alt="" draggable="false"/><div><span>BIANCHENGAFENG.XYZ</span><strong>阿峰的编程笔记</strong><small>独立博客 · 外部阅读</small></div><Icon name="external"/></a></header>
    <aside className="content-boundary"><div><span>这里展示</span><strong>博客标题、日期与摘要</strong></div><i/><div><span>不会放在这里</span><strong>论文、技术报告与研究发表</strong></div></aside>
    <section className="blog-feed"><header><span>最近更新</span><h2>从独立博客带来的文章。</h2><p>点击任意条目后，将前往 bianchengafeng.xyz 阅读全文。</p></header><div className="blog-article-grid">{posts.map((post, index) => <a className={index === 0 ? "featured-blog-post" : ""} key={`${post.link}-${index}`} href={post.link} target="_blank" rel="noreferrer"><div className="blog-post-meta"><span>0{index + 1}</span><time>{post.date}</time></div><div className="blog-post-glyph" aria-hidden="true"><Icon name="article"/></div>{index === 0 && <div className="featured-blog-context"><span>LATEST FROM THE BLOG</span><strong>最新文章</strong><i/></div>}<h3>{post.title}</h3><p>{post.text}</p>{index === 0 && <dl className="featured-blog-facts"><div><dt>来源</dt><dd>bianchengafeng.xyz</dd></div><div><dt>内容</dt><dd>标题 · 摘要 · 外部全文</dd></div></dl>}<small>前往独立博客阅读 <Icon name="external"/></small></a>)}</div></section>
    <a className="blog-portal" href="https://bianchengafeng.xyz" target="_blank" rel="noreferrer"><span><small>完整归档、标签与系列</small>打开「阿峰的编程笔记」</span><Icon name="arrow"/></a>
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
    const statIds = ["busuanzi_site_uv", "busuanzi_site_pv"];
    const setStatText = (text) => statIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.textContent = text;
    });
    if (localPreview) {
      setStatText("正式上线后统计");
      return undefined;
    }
    const markUnavailable = () => statIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node && /读取中|加载中/.test(node.textContent || "")) node.textContent = "暂未读取";
    });
    let script = document.getElementById("busuanzi-counter");
    if (!script) {
      script = document.createElement("script");
      script.id = "busuanzi-counter";
      script.src = "https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js";
      script.defer = true;
      script.onerror = markUnavailable;
      document.body.appendChild(script);
    }
    const timeout = window.setTimeout(markUnavailable, 8000);
    return () => window.clearTimeout(timeout);
  }, [localPreview]);

  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity"><span>AFENG · PERSONAL SITE</span><strong>感谢到访。</strong><p>这是阿峰的个人网站。近况、项目与入口会随真实内容更新。</p></div>
      <div className="footer-utility">
        <div className="footer-stats" aria-label="网站访问统计">
          <div><small>VISITORS</small><span><strong id="busuanzi_site_uv">读取中</strong> 位访客</span></div>
          <div><small>PAGE VIEWS</small><span><strong id="busuanzi_site_pv">读取中</strong> 次访问</span></div>
        </div>
        <nav className="footer-links" aria-label="页脚链接">
          <a href="mailto:3095635643@qq.com">Email <Icon name="arrow"/></a>
          <a href="https://github.com/bianchengafeng" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
          <a href="https://bianchengafeng.xyz" target="_blank" rel="noreferrer">独立博客 <Icon name="external"/></a>
        </nav>
      </div>
    </div>
    <div className="footer-bottom"><small>© 2026 阿峰 · All rights reserved.</small><span>Personal site · Last updated 2026</span></div>
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
    if (route === "not-found") document.title = "页面未找到｜阿峰";
  }, [route]);
  return <><a className="skip-link" href="#content">跳到主要内容</a><GlassNav active={route} theme={theme} onTheme={toggle}/><div id="content">{route === "about" ? <AboutPage/> : route === "projects" ? <ProjectsPage/> : route === "writing" ? <WritingPage/> : route === "home" ? <HomePage/> : <NotFoundPage/>}</div><Footer/></>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
