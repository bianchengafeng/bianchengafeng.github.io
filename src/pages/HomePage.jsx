import React from "react";
import { home, identity, navPages, site } from "../content/site.js";
import { Icon } from "../components/Icon.jsx";
import "../styles/home.css";

const bridgeLabels = {
  projects: "PROJECTS",
  writing: "BLOG",
  about: "ABOUT"
};
const bridgePages = navPages.filter((page) => page.key !== "home");

function PortraitStage() {
  return (
    <div className="portrait-stage" aria-label={`${identity.name}的个人头像`}>
      <div className="portrait-aura" aria-hidden="true" />
      <div className="portrait-grid" aria-hidden="true" />
      <div className="portrait-frame">
        <img src={site.socialImage} alt={`${identity.name}的头像`} draggable="false" />
      </div>
      <div className="portrait-stamp">
        <span>{identity.romanizedName}</span>
        <small>PERSONAL SITE · {identity.copyrightYear}</small>
      </div>
      <div className="portrait-tag portrait-tag-focus">
        <span>CURRENT</span>
        <strong>{home.now.badge}</strong>
      </div>
      <div className="portrait-tag portrait-tag-stage">
        <span>STATUS</span>
        <strong>在场</strong>
      </div>
    </div>
  );
}

function NowBoard() {
  return (
    <aside className="now-board">
      <div className="now-board-head">
        <span>此刻 · {home.now.period}</span>
        <span className="live-mark">{home.now.badge}</span>
      </div>
      <div className="now-primary">
        <small>此刻状态</small>
        <strong>
          {home.now.headline[0]}
          <br />
          {home.now.headline[1]}
        </strong>
      </div>
      <div className="focus-list" aria-label="当前状态">
        {home.now.focus.map((item) => (
          <div key={item.label}>
            <Icon name={item.icon} />
            <span>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
      <dl>
        {home.now.facts.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function TraceSection() {
  return (
    <section className="trace-section">
      <header className="compact-section-head">
        <div>
          <span>RECENT TRACES</span>
          <h2>最近留下的痕迹</h2>
        </div>
        <p>不是任务流水，只保留能说明我正在发生什么的片段。</p>
      </header>
      <div className="trace-grid">
        {home.traces.map((item, index) => (
          <article className={`trace-card trace-${item.tone}`} key={`${item.type}-${item.title}`}>
            <div className="trace-meta">
              <span>
                0{index + 1} / {item.type}
              </span>
              <time>{item.date}</time>
            </div>
            <div className="trace-symbol" aria-hidden="true">
              <Icon name={item.icon} />
              <span>{item.symbol}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShelfCard() {
  const inputs = home.recentInputs;
  return (
    <article className="shelf-card">
      <div className="shelf-head">
        <span>最近输入</span>
        <small>{inputs.length ? `${inputs.length} 项` : "尚未整理"}</small>
      </div>
      {inputs.length ? (
        inputs.map((item) => (
          <a
            className="input-placeholder"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            key={item.title}
          >
            <span>{item.type}</span>
            <strong>{item.title}</strong>
            <i aria-hidden="true">
              <Icon name="article" />
            </i>
          </a>
        ))
      ) : (
        <div className="input-placeholder" aria-label="最近输入内容尚未整理">
          <span>BOOK / ARTICLE</span>
          <strong>真实内容整理后，会从这里开始。</strong>
          <i aria-hidden="true">
            <Icon name="article" />
          </i>
        </div>
      )}
      <p>这里只保留真正愿意推荐或重读的内容，并说明为什么留下。</p>
    </article>
  );
}

function PersonalBoard() {
  return (
    <section className="personal-board">
      <article className="viewpoint-card">
        <span>{home.viewpoint.label}</span>
        <p>
          {home.viewpoint.text[0]}
          <br />
          {home.viewpoint.text[1]}
        </p>
      </article>
      <article className="curiosity-card">
        <div className="orbit-visual" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div>
          <span>{home.curiosity.label}</span>
          <h2>{home.curiosity.title}</h2>
          <p>{home.curiosity.text}</p>
        </div>
      </article>
      <ShelfCard />
    </section>
  );
}

function SiteBridge() {
  return (
    <section className="site-bridge">
      <header>
        <span>EXPLORE FURTHER</span>
        <h2>想继续了解哪一面？</h2>
        <p>从三个入口继续，各自承载不同内容。</p>
      </header>
      <nav aria-label="深入了解">
        {bridgePages.map((page, index) => (
          <a href={page.path} key={page.key}>
            <span className="bridge-index">0{index + 1}</span>
            <span>
              <small>{bridgeLabels[page.key]}</small>
              <strong>{page.navLabel}</strong>
            </span>
            <Icon name="arrow" />
          </a>
        ))}
      </nav>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="home-main">
      <section className="home-intro">
        <div className="intro-copy">
          <p className="intro-line">
            <span className="status-dot" />
            {home.intro.greeting}
          </p>
          <h1>
            {home.intro.title[0]}
            <br />
            <em>{home.intro.title[1]}</em>
          </h1>
          <p className="intro-summary">{home.intro.summary}</p>
          <div className="hero-links">
            <a className="primary-link" href="/about/">
              进一步认识我 <Icon name="arrow" />
            </a>
            <a href={identity.githubUrl} target="_blank" rel="noreferrer">
              GitHub <Icon name="external" />
            </a>
          </div>
        </div>
        <PortraitStage />
        <NowBoard />
      </section>
      <TraceSection />
      <PersonalBoard />
      <SiteBridge />
    </main>
  );
}
