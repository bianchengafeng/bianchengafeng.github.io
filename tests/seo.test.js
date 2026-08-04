import assert from "node:assert/strict";
import test from "node:test";
import { siteLastModified } from "../build/seo.js";

test("网站最近更新时间取整个仓库最后一次提交日期", () => {
  let receivedCommand;
  let receivedOptions;
  const updatedAt = siteLastModified((command, options) => {
    receivedCommand = command;
    receivedOptions = options;
    return "2026-08-02\n";
  });

  assert.equal(receivedCommand, "git log -1 --format=%cs -- .");
  assert.match(receivedOptions.cwd.replaceAll("\\", "/"), /\/bianchengafeng\.github\.io\/?$/);
  assert.equal(updatedAt, "2026-08-02");
});

test("无 Git 历史时使用明确的构建日期回退", () => {
  const updatedAt = siteLastModified(() => {
    throw new Error("git unavailable");
  }, "2099-01-02");

  assert.equal(updatedAt, "2099-01-02");
});
