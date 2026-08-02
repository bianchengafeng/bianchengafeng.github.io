// 液态玻璃导航所需的 SVG 滤镜 <defs> 内部内容。
// 在 vite.config.js 注入 HTML 时包进 <svg>。三通道 feDisplacementMap
// 产生边缘 RGB 色散（chromatic aberration）；feImage 的 href 默认是 1x1
// 中性灰（RGB 128：零位移）兜底，JS 就绪后由 src/lens-map.js 注入真透镜替换。

const NEUTRAL_LENS_MAP =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNoaGgAAAMEAYFL09IQAAAAAElFTkSuQmCC";

export const lensFilterDefs = [
  "<defs>",
  '<filter id="pill-lens" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">',
  // href 默认是 1x1 中性灰（RGB 128：零位移）兜底：贴图未注入时不产生整层错位，JS 就绪后换真透镜。
  `<feImage class="lens-map" href="${NEUTRAL_LENS_MAP}" x="0" y="0" width="100%" height="100%" result="MAP" preserveAspectRatio="none"/>`,
  '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="72" xChannelSelector="R" yChannelSelector="B" result="RD"/>',
  '<feColorMatrix in="RD" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="RC"/>',
  '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="64" xChannelSelector="R" yChannelSelector="B" result="GD"/>',
  '<feColorMatrix in="GD" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="GC"/>',
  '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="56" xChannelSelector="R" yChannelSelector="B" result="BD"/>',
  '<feColorMatrix in="BD" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="BC"/>',
  '<feBlend in="GC" in2="BC" mode="screen" result="GB"/>',
  '<feBlend in="RC" in2="GB" mode="screen"/>',
  "</filter>",
  // 整条导航本体的轻折射：很小的位移，让 bar 也有"活玻璃"感但不夸张
  '<filter id="bar-lens" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">',
  // href 默认是 1x1 中性灰（RGB 128：零位移）兜底：贴图未注入时不产生整层错位，JS 就绪后换真透镜。
  `<feImage class="lens-map" href="${NEUTRAL_LENS_MAP}" x="0" y="0" width="100%" height="100%" result="MAP" preserveAspectRatio="none"/>`,
  '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="18" xChannelSelector="R" yChannelSelector="B"/>',
  "</filter>",
  "</defs>"
].join("\n");
