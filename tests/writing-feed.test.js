import assert from "node:assert/strict";
import test from "node:test";
import { loadWritingFeed, loadWritingFeedState, parseWritingFeed } from "../src/writing-feed.js";

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
  assert.equal(requestOptions.cache, "no-store");
  assert.ok(requestOptions.signal, "请求应带超时 signal");
});

test("外部 RSS 的 javascript:/data: 链接回退到博客地址", () => {
  const posts = parseWritingFeed(
    "<rss />",
    "https://example.com",
    createParser([{ title: "危险链接", link: "javascript:alert(1)", pubDate: "" }])
  );
  assert.equal(posts[0].link, "https://example.com");
});

test("调用方传入的 signal 会原样透传给 fetch", async () => {
  let receivedSignal;
  const controller = new AbortController();
  await loadWritingFeed("https://example.com/index.xml", "https://example.com", {
    fetchFeed: async (_url, options) => {
      receivedSignal = options.signal;
      return { ok: true, text: async () => "<rss />" };
    },
    parseXml: createParser(),
    signal: controller.signal
  });
  assert.equal(receivedSignal, controller.signal);
});

test("页面读取状态在失败时返回可重试的错误状态，不保留旧文章", async () => {
  const state = await loadWritingFeedState("https://example.com/index.xml", "https://example.com", {
    fetchFeed: async () => ({ ok: false, status: 503 })
  });
  assert.deepEqual(state, { status: "error", posts: [] });
});

test("页面读取状态在再次调用成功后返回最新文章", async () => {
  let attempts = 0;
  const fetchFeed = async () => {
    attempts += 1;
    if (attempts === 1) return { ok: false, status: 503 };
    return { ok: true, text: async () => "<rss />" };
  };
  const options = { fetchFeed, parseXml: createParser() };

  const failed = await loadWritingFeedState(
    "https://example.com/index.xml",
    "https://example.com",
    options
  );
  const retried = await loadWritingFeedState(
    "https://example.com/index.xml",
    "https://example.com",
    options
  );

  assert.equal(attempts, 2);
  assert.deepEqual(failed, { status: "error", posts: [] });
  assert.deepEqual(retried, { status: "ready", posts: [] });
});
