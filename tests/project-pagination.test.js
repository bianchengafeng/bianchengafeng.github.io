import assert from "node:assert/strict";
import test from "node:test";
import { getProjectPagination } from "../src/project-pagination.js";

function projects(count) {
  return Array.from({ length: count }, (_, index) => ({ title: `项目 ${index + 1}` }));
}

test("没有项目时返回稳定的空单页状态", () => {
  const pagination = getProjectPagination([], 3, 0);

  assert.equal(pagination.page, 0);
  assert.equal(pagination.pageCount, 1);
  assert.equal(pagination.hasMultiplePages, false);
  assert.deepEqual(pagination.visibleProjects, []);
});

test("项目不足一页时只返回真实条目且不启用分页", () => {
  const items = projects(2);
  const pagination = getProjectPagination(items, 3, 0);

  assert.equal(pagination.pageCount, 1);
  assert.equal(pagination.hasMultiplePages, false);
  assert.deepEqual(pagination.visibleProjects, items);
});

test("项目恰好一页时不显示多页控件", () => {
  const pagination = getProjectPagination(projects(3), 3, 0);

  assert.equal(pagination.pageCount, 1);
  assert.equal(pagination.hasMultiplePages, false);
  assert.equal(pagination.visibleProjects.length, 3);
});

test("项目超过一页时保留正常分页能力", () => {
  const pagination = getProjectPagination(projects(4), 3, 1);

  assert.equal(pagination.page, 1);
  assert.equal(pagination.pageCount, 2);
  assert.equal(pagination.hasMultiplePages, true);
  assert.deepEqual(pagination.visibleProjects.map(({ title }) => title), ["项目 4"]);
});

test("项目删除导致当前页越界时自动回到最后一个合法页面", () => {
  const pagination = getProjectPagination(projects(2), 3, 3);

  assert.equal(pagination.page, 0);
  assert.equal(pagination.pageCount, 1);
  assert.deepEqual(pagination.visibleProjects.map(({ title }) => title), ["项目 1", "项目 2"]);
});
