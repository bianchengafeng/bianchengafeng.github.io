import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

/**
 * 排版约定守护：这些规则来自 2026-08 的视觉走查结论，防止后续样式改动悄悄漂移。
 * - 中文站的字号地板：拉丁装饰眉标走 --text-2xs（≥11px），其余（含中文）≥12px；
 * - 字重只用 400 / 500 / 600 / 700（微软雅黑等回退字体没有中间字重）；
 * - 渲染中文的元素不允许负字距（仅 404 数字这类纯拉丁展示文本例外）。
 */

const stylesDir = fileURLToPath(new URL("../src/styles", import.meta.url));

// 「404」数字是纯拉丁展示文本，允许负字距（not-found.css .not-found-code > span）。
const negativeLetterSpacingAllowed = new Set(["not-found.css"]);

const styleSheets = readdirSync(stylesDir)
  .filter((name) => name.endsWith(".css"))
  .map((name) => ({ name, css: readFileSync(join(stylesDir, name), "utf8") }));

function declarations(css, property) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const pattern = new RegExp(`(?:^|[;{\\s])${property}\\s*:\\s*([^;}]+)`, "g");
  return [...withoutComments.matchAll(pattern)].map((match) => match[1].trim());
}

test("样式文件齐全，守护规则确实在扫描目标", () => {
  const names = styleSheets.map((sheet) => sheet.name);
  assert.ok(names.includes("base.css"));
  assert.ok(names.length >= 6);
});

test("字号令牌本身守住地板：--text-2xs ≥ 11px，--text-xs ≥ 12px", () => {
  const base = styleSheets.find((sheet) => sheet.name === "base.css").css;
  const twoXs = base.match(/--text-2xs:\s*(\d+(?:\.\d+)?)px/);
  const xs = base.match(/--text-xs:\s*(\d+(?:\.\d+)?)px/);
  assert.ok(twoXs && Number(twoXs[1]) >= 11, "--text-2xs 应存在且不低于 11px");
  assert.ok(xs && Number(xs[1]) >= 12, "--text-xs 应存在且不低于 12px");
});

test("不允许出现低于 12px 的字号字面量（小字请用 --text-2xs / --text-xs 令牌）", () => {
  const violations = [];
  for (const { name, css } of styleSheets) {
    for (const value of declarations(css, "font-size")) {
      const px = value.match(/^(\d+(?:\.\d+)?)px$/);
      if (px && Number(px[1]) < 12) violations.push(`${name}: font-size: ${value}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("字重只允许 400 / 500 / 600 / 700", () => {
  const allowed = new Set(["400", "500", "600", "700", "normal", "bold", "inherit"]);
  const violations = [];
  for (const { name, css } of styleSheets) {
    for (const value of declarations(css, "font-weight")) {
      if (!allowed.has(value)) violations.push(`${name}: font-weight: ${value}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("除 404 数字外不允许负字距（中文不做负字距）", () => {
  const violations = [];
  for (const { name, css } of styleSheets) {
    if (negativeLetterSpacingAllowed.has(name)) continue;
    for (const value of declarations(css, "letter-spacing")) {
      if (value.startsWith("-")) violations.push(`${name}: letter-spacing: ${value}`);
    }
  }
  assert.deepEqual(violations, []);
});
