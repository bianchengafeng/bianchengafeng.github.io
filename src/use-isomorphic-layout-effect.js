import { useEffect, useLayoutEffect } from "react";

// 浏览器用 useLayoutEffect（绘制前同步），服务器渲染时退化为 useEffect（无操作），
// 避免 React 在 renderToString 下对 useLayoutEffect 的警告。
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
