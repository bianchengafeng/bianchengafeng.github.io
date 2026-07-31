import React, { useEffect, useState } from "react";
import { identity, site, writing } from "../content/site.js";
import { Icon } from "../components/Icon.jsx";
import { loadWritingFeed } from "../writing-feed.js";
import "../styles/writing.css";

const FEED_STATES = {
  loading: {
    title: "正在读取独立博客",
    text: "文章列表会直接以 RSS 的当前内容为准。"
  },
  error: {
    title: "暂时无法读取文章",
    text: "没有使用本地旧文章代替。你仍可以直接前往独立博客查看当前内容。",
    className: "blog-feed-error"
  },
  empty: {
    title: "目前暂无公开文章",
    text: "RSS 当前没有文章；以后发布新内容后，这里会自动出现。"
  }
};

function useWritingFeed() {
  const [state, setState] = useState({ status: "loading", posts: [] });

  useEffect(() => {
    let cancelled = false;
    loadWritingFeed(writing.feedUrl, identity.blogUrl)
      .then((posts) => {
        if (!cancelled) setState({ status: "ready", posts });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", posts: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function FeedState({ variant }) {
  const { title, text, className = "" } = FEED_STATES[variant];
  return (
    <div className={`blog-feed-state ${className}`.trim()} role="status">
      <Icon name="article" />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function BlogPost({ post, index }) {
  const featured = index === 0;
  return (
    <a
      className={featured ? "featured-blog-post" : ""}
      href={post.link}
      target="_blank"
      rel="noreferrer"
    >
      <div className="blog-post-meta">
        <span>0{index + 1}</span>
        <time>{post.date}</time>
      </div>
      <div className="blog-post-glyph" aria-hidden="true">
        <Icon name="article" />
      </div>
      {featured && (
        <div className="featured-blog-context">
          <span>LATEST FROM THE BLOG</span>
          <strong>最新文章</strong>
          <i />
        </div>
      )}
      <h3>{post.title}</h3>
      <p>{post.text}</p>
      {featured && (
        <dl className="featured-blog-facts">
          <div>
            <dt>来源</dt>
            <dd>bianchengafeng.xyz</dd>
          </div>
          <div>
            <dt>内容</dt>
            <dd>标题 · 摘要 · 外部全文</dd>
          </div>
        </dl>
      )}
      <small>
        前往独立博客阅读 <Icon name="external" />
      </small>
    </a>
  );
}

function BlogFeed() {
  const { status, posts } = useWritingFeed();
  const variant = status === "ready" ? (posts.length ? null : "empty") : status;

  return (
    <section className="blog-feed">
      <header>
        <span>最近更新</span>
        <h2>从独立博客带来的文章。</h2>
        <p>点击任意条目后，将前往 bianchengafeng.xyz 阅读全文。</p>
      </header>
      {variant ? (
        <FeedState variant={variant} />
      ) : (
        <div className="blog-article-grid">
          {posts.map((post, index) => (
            <BlogPost post={post} index={index} key={`${post.link}-${index}`} />
          ))}
        </div>
      )}
    </section>
  );
}

export function WritingPage() {
  return (
    <main className="inner-page blog-page">
      <header className="inner-visual-hero blog-visual-hero">
        <div className="inner-hero-copy">
          <span>BLOG / 02</span>
          <h1>博客文章，来自另一个长期空间。</h1>
          <p>这里负责发现与导流。技术文章、学习笔记和完整归档继续发布在「阿峰的编程笔记」。</p>
        </div>
        <a
          className="blog-hero-mark"
          href={identity.blogUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`前往${identity.blogName}`}
        >
          <img src={site.socialImage} alt="" width="62" height="62" draggable="false" />
          <div>
            <span>BIANCHENGAFENG.XYZ</span>
            <strong>{identity.blogName}</strong>
            <small>独立博客 · 外部阅读</small>
          </div>
          <Icon name="external" />
        </a>
      </header>
      <aside className="content-boundary">
        <div>
          <span>这里展示</span>
          <strong>博客标题、日期与摘要</strong>
        </div>
        <i />
        <div>
          <span>不会放在这里</span>
          <strong>论文、技术报告与研究发表</strong>
        </div>
      </aside>
      <BlogFeed />
      <a className="blog-portal" href={identity.blogUrl} target="_blank" rel="noreferrer">
        <span>
          <small>完整归档、标签与系列</small>
          打开「{identity.blogName}」
        </span>
        <Icon name="arrow" />
      </a>
    </main>
  );
}
