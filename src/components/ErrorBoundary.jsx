import React from "react";

/**
 * 极简错误边界：任一子树渲染抛错时用 fallback 替换该子树，
 * 避免 React 卸载整棵 root 导致全站白屏（纯 CSR 下等于站点不可用）。
 * 无依赖、约 15 行，专为本站的简单需求而设。
 */
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
