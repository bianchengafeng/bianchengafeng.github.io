/**
 * 生成液态玻璃药丸所用的透镜位移映射图（data URL）。
 * 在圆角矩形区域内，越靠近边缘位移越强，中心位移为零——
 * 让玻璃透镜产生"鼓起来"的放大感，同时避免了硬边跳动。
 *
 * 这是 v2 招牌版的核心——与 SVG feDisplacementMap 配合，
 * R/G/B 三通道分别以不同 scale 位移，形成边缘色散（chromatic aberration）。
 *
 * @param {{ width: number, height: number, radius: number, power: number }} options
 * @returns {string} PNG data URL
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
  const cx = width / 2;
  const cy = height / 2;
  const rx = cx - radius;
  const ry = cy - radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 超出圆角矩形内接区域的像素才产生位移，中心区域不变形。
      const qx = Math.max(Math.abs(x - cx) - rx, 0);
      const qy = Math.max(Math.abs(y - cy) - ry, 0);
      const dist = Math.hypot(qx, qy);
      const t = Math.min(dist / radius, 1);
      const f = Math.pow(t, power);
      const nx = dist > 0 ? (qx / dist) * Math.sign(x - cx) : 0;
      const ny = dist > 0 ? (qy / dist) * Math.sign(y - cy) : 0;

      const i = (y * width + x) * 4;
      // R 通道 = X 方向位移，B 通道 = Y 方向位移（feDisplacementMap 用 xChannelSelector="R" / yChannelSelector="B"）
      img.data[i] = 128 + nx * f * 127;
      img.data[i + 1] = 128;
      img.data[i + 2] = 128 + ny * f * 127;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
