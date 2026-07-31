import React, { lazy, Suspense } from "react";
import { identity, navPages, site } from "../content/site.js";
import { Icon } from "./Icon.jsx";

// 折射效果是装饰层，不该挡住首屏。单独成块后台加载，
// 到达前先用 CSS 玻璃质感占位，两者尺寸与圆角一致，不会跳版。
const LiquidGlass = lazy(() => import("liquid-glass-react"));

const GLASS_PROPS = {
  className: "liquid-site-nav",
  displacementScale: 58,
  blurAmount: 0,
  saturation: 140,
  aberrationIntensity: 1.55,
  elasticity: 0.08,
  cornerRadius: 30,
  padding: "0",
  mode: "shader",
  overLight: false,
  style: { position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%" }
};

function HeaderInner({ active, theme, onToggleTheme }) {
  const toggleLabel = theme === "dark" ? "切换至浅色主题" : "切换至深色主题";
  return (
    <div className="header-inner">
      <a className="site-brand" href="/" aria-label={`${identity.name}的个人主页`}>
        <img src={site.socialImage} alt="" width="34" height="34" draggable="false" />
        <span>{identity.name}</span>
      </a>
      <nav aria-label="主导航">
        {navPages.map((page) => (
          <a
            key={page.key}
            className={active === page.key ? "active" : ""}
            href={page.path}
            aria-current={active === page.key ? "page" : undefined}
          >
            {page.navLabel}
          </a>
        ))}
      </nav>
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
