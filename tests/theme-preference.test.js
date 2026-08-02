import assert from "node:assert/strict";
import test from "node:test";
import { resolveTheme } from "../src/theme-preference.js";

test("显式存储的 light/dark 直接返回，忽略系统偏好", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("无存储时跟随系统偏好", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
});

test("非法存储值回退到系统偏好", () => {
  assert.equal(resolveTheme("auto", true), "dark");
  assert.equal(resolveTheme("", false), "light");
  assert.equal(resolveTheme("LIGHT", true), "dark");
});
