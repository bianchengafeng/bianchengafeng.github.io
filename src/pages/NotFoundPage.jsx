import React from "react";
import { Icon } from "../components/Icon.jsx";
import "../styles/not-found.css";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-stage">
        <div className="not-found-code" aria-hidden="true">
          <span>404</span>
          <small>PAGE NOT FOUND</small>
        </div>
        <div className="not-found-copy">
          <span>ERROR / 404</span>
          <h1>这里没有对应的页面。</h1>
          <p>地址可能输入有误，页面也可能已经移动。你可以返回首页，或从下面三个入口继续浏览。</p>
          <div className="not-found-actions">
            <a className="primary-link" href="/">
              返回首页 <Icon name="arrow" />
            </a>
            <a href="/projects/">查看项目</a>
            <a href="/writing/">前往博客</a>
          </div>
        </div>
        <aside className="not-found-path" aria-label="当前未找到的地址">
          <small>REQUESTED PATH</small>
          <code>{window.location.pathname}</code>
          <span>没有匹配到站内页面</span>
        </aside>
      </section>
    </main>
  );
}
