import assert from "node:assert/strict";
import test from "node:test";
import { lensDisplacementAt } from "../src/lens-map.js";

const OPTIONS = { width: 240, height: 96, radius: 48, power: 1.6 };

test("中心像素位移为零（128）", () => {
  const { r, b } = lensDisplacementAt(120, 48, OPTIONS);
  assert.equal(r, 128);
  assert.equal(b, 128);
});

test("圆角内区域基本不变形（接近 128）", () => {
  const { r, b } = lensDisplacementAt(100, 48, OPTIONS); // 中心左侧 20px，仍在圆角内
  assert.ok(Math.abs(r - 128) < 10, `r 应接近 128，实际 ${r}`);
  assert.ok(Math.abs(b - 128) < 10, `b 应接近 128，实际 ${b}`);
});

test("四角位移最大且方向正确", () => {
  // 左上角：x 负向（r < 128）、y 负向（b < 128）
  const tl = lensDisplacementAt(0, 0, OPTIONS);
  assert.ok(tl.r < 128);
  assert.ok(tl.b < 128);
  // 右下角：x 正向（r > 128）、y 正向（b > 128）
  const br = lensDisplacementAt(239, 95, OPTIONS);
  assert.ok(br.r > 128);
  assert.ok(br.b > 128);
});

test("位移随距中心距离增强", () => {
  const near = lensDisplacementAt(100, 48, OPTIONS);
  const edge = lensDisplacementAt(0, 48, OPTIONS);
  assert.ok(Math.abs(edge.r - 128) > Math.abs(near.r - 128));
});
