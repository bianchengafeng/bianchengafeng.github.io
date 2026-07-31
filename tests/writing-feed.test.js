import assert from "node:assert/strict";
import test from "node:test";
import { loadWritingFeed, parseWritingFeed } from "../src/writing-feed.js";

function textNode(text) {
  return { textContent: text };
}

function createParser(items = [], parserError = false, validRss = true) {
  return () => ({
    querySelector(selector) {
      if (selector === "parsererror") return parserError ? {} : null;
      if (selector === "rss > channel") return validRss ? {} : null;
      return null;
    },
    querySelectorAll(selector) {
      if (selector !== "item") return [];
      return items.map((item) => ({
        querySelector(key) {
          return item[key] == null ? null : textNode(item[key]);
        }
      }));
    }
  });
}

test("RSS成功但没有文章时返回空数组，不恢复旧内容", () => {
  assert.deepEqual(parseWritingFeed("<rss />", "https://example.com", createParser()), []);
});

test("RSS文章被转换为站内展示数据", () => {
  const posts = parseWritingFeed(
    "<rss />",
    "https://example.com",
    createParser([
      {
        title: "新文章",
        link: "https://example.com/posts/new/",
        pubDate: "2026-07-31T12:00:00Z",
        description: "<p>这是摘要</p>"
      }
    ])
  );
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, "新文章");
  assert.equal(posts[0].link, "https://example.com/posts/new/");
  assert.equal(posts[0].text, "这是摘要");
});

test("无效XML会明确报错", () => {
  assert.throws(
    () => parseWritingFeed("broken", "https://example.com", createParser([], true)),
    /RSS XML 解析失败/
  );
});

test("返回HTML等非RSS文档时不会误判为零文章", () => {
  assert.throws(
    () => parseWritingFeed("<html />", "https://example.com", createParser([], false, false)),
    /RSS 文档结构无效/
  );
});

test("HTTP错误不会被解析成空RSS", async () => {
  await assert.rejects(
    () =>
      loadWritingFeed("https://example.com/index.xml", "https://example.com", {
        fetchFeed: async () => ({ ok: false, status: 503 })
      }),
    /RSS 请求失败：503/
  );
});

test("HTTP成功且RSS为空时保留真实空状态", async () => {
  let requestOptions;
  const posts = await loadWritingFeed("https://example.com/index.xml", "https://example.com", {
    fetchFeed: async (_url, options) => {
      requestOptions = options;
      return { ok: true, text: async () => "<rss />" };
    },
    parseXml: createParser()
  });
  assert.deepEqual(posts, []);
  assert.deepEqual(requestOptions, { cache: "no-store" });
});
