import React, { useState } from "react";
import { about, identity, site } from "../content/site.js";
import { Icon } from "../components/Icon.jsx";
import "../styles/about.css";

const collectionIcons = {
  interests: "heart",
  inputs: "article",
  traces: "layers"
};

function AboutHero() {
  return (
    <header className="inner-visual-hero about-visual-hero">
      <div className="inner-hero-copy">
        <span>ABOUT / 03</span>
        <h1>{about.heroTitle}</h1>
        <p>{about.heroSummary}</p>
      </div>
      <div className="about-portrait">
        <div className="about-portrait-ring" />
        <img src={site.socialImage} alt={`${identity.name}的头像`} draggable="false" />
        <span>
          {identity.romanizedName} · {identity.copyrightYear}
        </span>
      </div>
      <aside className="about-principles">
        <span>我更在意</span>
        {about.principles.map((item) => (
          <strong key={item}>{item}</strong>
        ))}
      </aside>
    </header>
  );
}

function ProfileFlow() {
  return (
    <section className="about-profile-flow">
      <div className="about-profile-lead">
        <span>现在的我</span>
        <p>{about.profileSummary}</p>
      </div>
      <div className="about-profile-details">
        <div className="about-coordinate">
          <span>个人坐标</span>
          <dl>
            {about.coordinates.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="about-method">
          <span>做事方式</span>
          <div className="method-path">
            {about.methods.map((item) => (
              <React.Fragment key={item.title}>
                <i />
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LifeCollection() {
  const collections = about.lifeCollections;
  const [activeKey, setActiveKey] = useState(collections[0].key);
  const active = collections.find((item) => item.key === activeKey) || collections[0];
  const activeIcon = collectionIcons[active.key];

  return (
    <div className="life-collection">
      <div role="group" className="life-collection-tabs" aria-label="生活与兴趣分类">
        {collections.map((collection, index) => (
          <button
            type="button"
            className={activeKey === collection.key ? "active" : ""}
            onClick={() => setActiveKey(collection.key)}
            aria-pressed={activeKey === collection.key}
            key={collection.key}
          >
            <span>0{index + 1}</span>
            <strong>{collection.label}</strong>
            <small>{collection.items.length ? `${collection.items.length} 条` : "尚未整理"}</small>
          </button>
        ))}
      </div>
      <div className="life-collection-panel">
        <header>
          <div>
            <span>当前集合</span>
            <h3>{active.label}</h3>
          </div>
          <p>{active.intro}</p>
        </header>
        {active.items.length ? (
          <div className="life-collection-items">
            {active.items.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <div>
                  <small>{item.meta}</small>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                <Icon name={activeIcon} />
              </article>
            ))}
          </div>
        ) : (
          <div className="life-collection-empty">
            <Icon name={activeIcon} />
            <strong>尚未整理</strong>
            <p>{active.emptyText}</p>
          </div>
        )}
        <footer>
          <strong>内容原则</strong>
          <span>只收录真实、愿意公开且值得长期保留的内容。</span>
        </footer>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <main className="inner-page about-page">
      <AboutHero />
      <ProfileFlow />
      <section className="about-life-section">
        <header>
          <span>生活与兴趣</span>
          <h2>专业之外，也应该看见一个完整的人。</h2>
          <p>这里只展示真实整理过的内容；尚未准备好的部分会明确留空，不使用示例填充。</p>
        </header>
        <LifeCollection />
      </section>
    </main>
  );
}
