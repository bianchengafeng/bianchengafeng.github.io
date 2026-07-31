import React, { useEffect, useState } from "react";
import { siteContent } from "../content/site.js";
import { getProjectPagination } from "../project-pagination.js";

const { projects } = siteContent;

function ProjectEntry({ project, index, icon, Icon }) {
  return (
    <article className="project-entry project-entry-real">
      <div className="project-entry-index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <Icon name={icon} />
      </div>
      <div className="project-entry-copy">
        <small>{project.eyebrow}</small>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
      <dl>
        <div><dt>角色</dt><dd>{project.role}</dd></div>
        <div><dt>技术</dt><dd>{project.stack}</dd></div>
        <div><dt>状态</dt><dd>{project.status}</dd></div>
      </dl>
      <div className="project-entry-action">
        {project.href && <a href={project.href} target="_blank" rel="noreferrer">{project.linkLabel} <Icon name="external" /></a>}
      </div>
    </article>
  );
}

export function ProjectsPage({ Icon }) {
  const categories = projects.categories;
  const codeCategory = categories[0];
  const [projectPage, setProjectPage] = useState(0);
  const {
    page,
    pageCount,
    hasMultiplePages,
    visibleProjects
  } = getProjectPagination(codeCategory.items, projects.pageSize, projectPage);

  useEffect(() => {
    if (projectPage !== page) {
      setProjectPage(page);
    }
  }, [page, projectPage]);

  return (
    <main className="inner-page projects-page">
      <header className="inner-visual-hero projects-visual-hero">
        <div className="inner-hero-copy"><span>PROJECTS / 01</span><h1>项目不只存在于 GitHub。</h1><p>代码仓库只是证据之一。这里同时容纳现实实践、学习实验，以及未来真正形成的研究成果。</p></div>
        <div className="project-hero-visual" aria-hidden="true"><div className="project-window"><i/><i/><i/><span>&lt; build something real /&gt;</span></div><div className="project-stack"><i/><i/><i/></div></div>
      </header>

      <section className="project-categories">
        <header><span>项目目录</span><h2>按内容类型查看。</h2><p>四个入口分别通向对应内容区域。</p></header>
        <nav className="category-grid" aria-label="项目分类目录">
          {categories.map((category) => (
            <a href={`#project-${category.id}`} className={`category-card category-${category.tone}`} key={category.id}>
              <div><span>{category.id}</span><Icon name={category.icon}/></div>
              <h3>{category.title}</h3>
              <p>{category.text}</p>
              <small>{category.items.length ? `${category.items.length} 项` : "尚未整理"} · 查看详情</small>
            </a>
          ))}
        </nav>
      </section>

      <section className="project-detail-list" aria-label="项目分类详情">
        <article id={`project-${codeCategory.id}`} className="project-detail project-code-collection">
          <header><span>{codeCategory.id} / {codeCategory.title}</span><strong>{codeCategory.items.length} 项真实内容</strong></header>
          <div className="project-collection-intro"><div><small>项目浏览器</small><h2>只展示真实项目和可核实证据。</h2></div><p>以后只需要在内容配置中增删项目条目，分页会自动变化。</p></div>
          {codeCategory.items.length ? (
            <div className="project-browser" aria-live="polite">
              {hasMultiplePages && (
                <div className="project-browser-toolbar">
                  <span>PAGE {String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span>
                  <div>{Array.from({ length: pageCount }, (_, index) => <button type="button" className={page === index ? "active" : ""} onClick={() => setProjectPage(index)} aria-label={`查看第 ${index + 1} 页项目`} aria-pressed={page === index} key={index}>{String(index + 1).padStart(2, "0")}</button>)}</div>
                </div>
              )}
              <div className="project-entry-list">{visibleProjects.map((project, index) => <ProjectEntry project={project} index={page * projects.pageSize + index} icon={codeCategory.icon} Icon={Icon} key={project.title} />)}</div>
              {hasMultiplePages && (
                <div className="project-browser-nav">
                  <button type="button" onClick={() => setProjectPage((currentPage) => Math.max(0, currentPage - 1))} disabled={page === 0}>上一页</button>
                  <span>本页 {visibleProjects.length} 项 · 共 {codeCategory.items.length} 项</span>
                  <button type="button" onClick={() => setProjectPage((currentPage) => Math.min(pageCount - 1, currentPage + 1))} disabled={page === pageCount - 1}>下一页</button>
                </div>
              )}
            </div>
          ) : (
            <div className="project-detail-empty"><Icon name={codeCategory.icon}/><h3>{codeCategory.emptyTitle}</h3><p>{codeCategory.emptyText}</p></div>
          )}
        </article>

        {categories.slice(1).map((category) => (
          <article id={`project-${category.id}`} className={`project-detail ${category.items.length ? "" : "project-detail-empty"}`} key={category.id}>
            <header><span>{category.id} / {category.title}</span><strong>{category.items.length ? `${category.items.length} 项真实内容` : "尚无公开内容"}</strong></header>
            {category.items.length ? <div className="project-entry-list">{category.items.map((project, index) => <ProjectEntry project={project} index={index} icon={category.icon} Icon={Icon} key={project.title} />)}</div> : <div><Icon name={category.icon}/><h3>{category.emptyTitle}</h3><p>{category.emptyText}</p></div>}
          </article>
        ))}
      </section>
    </main>
  );
}
