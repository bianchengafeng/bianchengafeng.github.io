/**
 * 生成液态玻璃药丸所用的透镜位移映射图（data URL）。
 * 在圆角矩形区域内，越靠近边缘位移越强，中心位移为零——
 * 让玻璃透镜产生"鼓起来"的放大感，同时避免了硬边跳动。
 *
 * 这是 v2 招牌版的核心——与 SVG feDisplacementMap 配合，
 * R/G/B 三通道分别以不同 scale 位移，形成边缘色散（chromatic aberration）。
 */

/**
 * 单个像素的位移通道值（纯函数，可单元测试）：
 * R 通道 = X 方向位移，B 通道 = Y 方向位移（feDisplacementMap 用 R / B 通道选择器）。
 * 中心区域返回 128（零位移）；越靠近圆角矩形外缘，偏离 128 越大。
 */
export function lensDisplacementAt(x, y, { width, height, radius, power }) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = cx - radius;
  const ry = cy - radius;
  const qx = Math.max(Math.abs(x - cx) - rx, 0);
  const qy = Math.max(Math.abs(y - cy) - ry, 0);
  const dist = Math.hypot(qx, qy);
  const t = Math.min(dist / radius, 1);
  const f = Math.pow(t, power);
  const nx = dist > 0 ? (qx / dist) * Math.sign(x - cx) : 0;
  const ny = dist > 0 ? (qy / dist) * Math.sign(y - cy) : 0;
  return { r: 128 + nx * f * 127, b: 128 + ny * f * 127 };
}

/**
 * @param {{ width: number, height: number, radius: number, power: number }} options
 * @returns {string | null} PNG data URL；canvas 不可用时返回 null 让调用方跳过注入
 */
export function generateLensMap({ width, height, radius, power }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  // CanvasBlocker 等隐私扩展会用 null 全禁 2d 上下文；返回 null 让调用方跳过注入，
  // SVG 滤镜保持 1x1 中性灰兜底（无色散但页面不崩）。
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { r, b } = lensDisplacementAt(x, y, { width, height, radius, power });
      const i = (y * width + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = 128;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
