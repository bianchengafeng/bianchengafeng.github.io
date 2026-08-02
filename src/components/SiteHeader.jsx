import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { identity, navPages, site } from "../content/site.js";
import { Icon } from "./Icon.jsx";
import { generateLensMap } from "../lens-map.js";

/**
 * 激活态液态玻璃药丸 —— v2 招牌版。
 * 完全照 design-prototypes/v2-signature.html 的实现：
 * - 定位用 offsetLeft / offsetWidth（相对 position: relative 的 nav）
 * - 三层结构：外层（定位+弹簧过渡）→ pill-warp（SVG 三通道色散滤镜）→ pill-shine（高光+斜向扫光）
 * - hover 标签时药丸滑过去预览，离开弹回当前激活标签
 */
function NavGlassPill({ active }) {
  const activeRef = useRef(null);
  const pillRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const sheenTimer = useRef(0);
  const prevActive = useRef(active);

  // 注入透镜映射图到所有 .lens-map feImage 元素。
  useEffect(() => {
    const mapUrl = generateLensMap({ width: 240, height: 96, radius: 48, power: 1.6 });
    document.querySelectorAll(".lens-map").forEach((el) => {
      el.setAttribute("href", mapUrl);
      el.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", mapUrl);
    });
  }, []);

  const place = useCallback((tab, withSheen = false) => {
    if (!tab) return;
    setPill({ left: tab.offsetLeft, width: tab.offsetWidth, ready: true });
    if (withSheen) {
      const el = pillRef.current;
      if (!el) return;
      clearTimeout(sheenTimer.current);
      el.classList.remove("sheen");
      void el.offsetWidth;
      el.classList.add("sheen");
      sheenTimer.current = setTimeout(() => el.classList.remove("sheen"), 1000);
    }
  }, []);

  // 首次绘制前完成定位，避免药丸从宽度 0 闪入；active 变化时才触发扫光。
  useLayoutEffect(() => {
    place(activeRef.current, prevActive.current !== active);
    prevActive.current = active;
  }, [active, place]);

  // resize 时重新定位。
  useEffect(() => {
    const onResize = () => place(activeRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  return (
    <nav aria-label="主导航" onMouseLeave={() => place(activeRef.current)}>
      <span
        ref={pillRef}
        className="nav-glass-pill"
        style={{
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
          opacity: pill.ready ? 1 : 0
        }}
        aria-hidden="true"
      >
        <span className="pill-warp" />
        <span className="pill-shine" />
      </span>
      {navPages.map((page) => (
        <a
          key={page.key}
          ref={active === page.key ? activeRef : null}
          className={active === page.key ? "active" : ""}
          href={page.path}
          aria-current={active === page.key ? "page" : undefined}
          onMouseEnter={(event) => place(event.currentTarget, true)}
        >
          {page.navLabel}
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader({ active, theme, onToggleTheme }) {
  const toggleLabel = theme === "dark" ? "切换至浅色主题" : "切换至深色主题";

  // 高光跟随指针：把坐标写成 CSS 变量，玻璃上会有一片柔光跟着鼠标走。
  const trackGlassPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
  };
  const resetGlassPointer = (event) => {
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };

  return (
    <header
      className="site-header"
      onPointerMove={trackGlassPointer}
      onPointerLeave={resetGlassPointer}
    >
      <span className="bar-warp" aria-hidden="true" />
      <a className="site-brand" href="/" aria-label={`${identity.name}的个人主页`}>
        <img src={site.socialImage} alt="" width="34" height="34" draggable="false" />
        <span>{identity.name}</span>
      </a>
      <NavGlassPill active={active} />
      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        <Icon name="sun" />
        <Icon name="moon" />
      </button>
    </header>
  );
}
