import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { identity, navPages, site } from "../content/site.js";
import { Icon } from "./Icon.jsx";
import { generateLensMap } from "../lens-map.js";

// 折射效果是装饰层，不该挡住首屏。单独成块后台加载，
// 到达前先用 CSS 玻璃质感占位，两者尺寸与圆角一致，不会跳版。
const LiquidGlass = lazy(() => import("liquid-glass-react"));

const GLASS_PROPS = {
  className: "liquid-site-nav",
  displacementScale: 60,
  blurAmount: 0.04,
  saturation: 140,
  aberrationIntensity: 1.55,
  elasticity: 0.12,
  cornerRadius: 30,
  padding: "0",
  mode: "shader",
  overLight: false,
  style: { position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%" }
};

/**
 * 激活态液态玻璃药丸 —— v2 招牌版的核心。
 * 在导航链接背后放一枚带着弹簧过渡的磨砂玻璃透镜，
 * 通过三通道 SVG 滤镜产生边缘色散（chromatic aberration），
 * 落位时有一道斜向高光扫过。
 */
function NavGlassPill({ active }) {
  const navRef = useRef(null);
  const activeRef = useRef(null);
  const pillRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, ready: false });
  const sheenTimer = useRef(0);
  const prevActive = useRef(active);

  // 注入透镜映射图到所有 .lens-map feImage 元素。
  useEffect(() => {
    const mapUrl = generateLensMap({ width: 240, height: 96, radius: 48, power: 1.6 });
    document.querySelectorAll(".lens-map").forEach((el) => {
      el.setAttribute("href", mapUrl);
    });
  }, []);

  const measure = useCallback((tab) => {
    const nav = navRef.current;
    if (!nav || !tab) return;
    const nr = nav.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    return { left: tr.left - nr.left, width: tr.width };
  }, []);

  // active 变化时，测量新标签位置并触发扫光。
  useEffect(() => {
    const pos = measure(activeRef.current);
    if (!pos) return;
    setPillStyle({ ...pos, ready: true });
    if (prevActive.current !== active) {
      prevActive.current = active;
      // 扫光：移除 sheen → 强制重排 → 加回 sheen
      const pill = pillRef.current;
      if (!pill) return;
      clearTimeout(sheenTimer.current);
      pill.classList.remove("sheen");
      void pill.offsetWidth;
      pill.classList.add("sheen");
      sheenTimer.current = setTimeout(() => pill.classList.remove("sheen"), 1000);
    }
  }, [active, measure]);

  // resize 时重新测量。
  useEffect(() => {
    const onResize = () => {
      const pos = measure(activeRef.current);
      if (pos) setPillStyle((prev) => ({ ...prev, ...pos }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, measure]);

  // hover 时药丸跟随指针下的标签（预览），离开后弹回当前激活标签。
  const handleTabEnter = useCallback(
    (event) => {
      const pos = measure(event.currentTarget);
      if (pos) setPillStyle((prev) => ({ ...prev, ...pos }));
    },
    [measure]
  );
  const handleNavLeave = useCallback(() => {
    const pos = measure(activeRef.current);
    if (pos) setPillStyle((prev) => ({ ...prev, ...pos }));
  }, [measure]);

  return (
    <nav ref={navRef} aria-label="主导航" onMouseLeave={handleNavLeave}>
      <span
        ref={pillRef}
        className="nav-glass-pill"
        style={{
          width: pillStyle.width,
          transform: `translateX(${pillStyle.left}px)`,
          opacity: pillStyle.ready ? 1 : 0
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
          onMouseEnter={handleTabEnter}
        >
          {page.navLabel}
        </a>
      ))}
    </nav>
  );
}

function HeaderInner({ active, theme, onToggleTheme }) {
  const toggleLabel = theme === "dark" ? "切换至浅色主题" : "切换至深色主题";
  return (
    <div className="header-inner">
      <a className="site-brand" href="/" aria-label={`${identity.name}的个人主页`}>
        <img src={site.socialImage} alt="" width="34" height="34" draggable="false" />
        <span>{identity.name}</span>
      </a>
      <NavGlassPill active={active} />
      <div className="header-actions">
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
      </div>
    </div>
  );
}

export function SiteHeader({ active, theme, onToggleTheme }) {
  // 高光跟随指针：把坐标写成 CSS 变量，交给样式层处理渐变位置。
  const trackGlassPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
  };
  const resetGlassPointer = (event) => {
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };
  const inner = <HeaderInner active={active} theme={theme} onToggleTheme={onToggleTheme} />;

  return (
    <header
      className="site-header"
      onPointerMove={trackGlassPointer}
      onPointerLeave={resetGlassPointer}
    >
      <Suspense fallback={<div className="liquid-site-nav liquid-site-nav-plain">{inner}</div>}>
        <LiquidGlass {...GLASS_PROPS}>{inner}</LiquidGlass>
      </Suspense>
    </header>
  );
}
