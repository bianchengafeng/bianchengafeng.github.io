import assert from "node:assert/strict";
import test from "node:test";
import {
  isNewVisitSession,
  parseStatisticsCache,
  selectUsableStorage,
  updateVisitSession
} from "../src/statistics.js";

const MINUTE = 60 * 1000;
const WINDOW = 20 * MINUTE;

test("首次访问开启新会话", () => {
  assert.equal(isNewVisitSession(Number.NaN, 1000, WINDOW), true);
});

test("20分钟内切页或刷新沿用当前会话并续期", () => {
  const result = updateVisitSession({ id: "current", lastActivityAt: 1000 }, 1000 + WINDOW - 1, WINDOW);
  assert.equal(result.newSession, false);
  assert.deepEqual(result.session, { id: "current", lastActivityAt: 1000 + WINDOW - 1 });
});

test("连续20分钟无活动后开启新会话", () => {
  const result = updateVisitSession({ id: "old", lastActivityAt: 1000 }, 1000 + WINDOW, WINDOW, () => 0.5);
  assert.equal(result.newSession, true);
  assert.equal(result.session.id, `${1000 + WINDOW}-0.5`);
});

test("最后一次活动会滑动延长会话窗口", () => {
  const first = updateVisitSession({ id: "current", lastActivityAt: 0 }, 19 * MINUTE, WINDOW);
  const second = updateVisitSession(first.session, 38 * MINUTE, WINDOW);
  assert.equal(first.newSession, false);
  assert.equal(second.newSession, false);
  assert.equal(second.session.lastActivityAt, 38 * MINUTE);
});

test("损坏的统计缓存被拒绝，合法缓存被规范化", () => {
  assert.equal(parseStatisticsCache({ visitors: "1", sessions: 2 }), null);
  assert.deepEqual(parseStatisticsCache({ visitors: -1, sessions: 3, updatedAt: 4 }), {
    visitors: 0,
    sessions: 3,
    updatedAt: 4
  });
});

test("localStorage不可用时回退到下一个存储", () => {
  const blocked = {
    setItem() { throw new Error("blocked"); },
    removeItem() {},
    getItem() { return null; }
  };
  const fallback = new Map();
  fallback.getItem = fallback.get.bind(fallback);
  fallback.setItem = fallback.set.bind(fallback);
  fallback.removeItem = fallback.delete.bind(fallback);
  assert.equal(selectUsableStorage([blocked, fallback]), fallback);
});
