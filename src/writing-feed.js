function getText(item, selector) {
  return item.querySelector(selector)?.textContent?.trim() || "";
}

// 外站 RSS 的 link 是第三方内容：白名单协议，javascript:/data: 等一律回退博客地址，
// 避免被篡改的 feed 把危险协议注入 <a href>。
function sanitizeLink(rawLink, blogUrl) {
  try {
    const url = new URL(rawLink);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    // 解析失败（相对链接、无效协议）走回退
  }
  return blogUrl;
}

export function parseWritingFeed(xml, blogUrl, parseXml) {
  const doc = parseXml(xml);
  if (doc.querySelector("parsererror")) throw new Error("RSS XML 解析失败");
  if (!doc.querySelector("rss > channel")) throw new Error("RSS 文档结构无效");

  return [...doc.querySelectorAll("item")].slice(0, 5).map((item) => {
    const rawDate = getText(item, "pubDate");
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const description = getText(item, "description")
      .replace(/<[^>]+>/g, "")
      .trim();
    return {
      title: getText(item, "title") || "未命名文章",
      link: sanitizeLink(getText(item, "link"), blogUrl),
      date:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString("zh-CN")
          : "日期未知",
      text: description.slice(0, 100)
    };
  });
}

export async function loadWritingFeed(feedUrl, blogUrl, options = {}) {
  const fetchFeed = options.fetchFeed || fetch;
  const parseXml =
    options.parseXml || ((xml) => new DOMParser().parseFromString(xml, "application/xml"));
  // 外站挂起时必须有超时，否则博客页会一直停在 loading；调用方传 signal 时以它为准（用于卸载取消）。
  const signal = options.signal ?? AbortSignal.timeout?.(10000);
  const response = await fetchFeed(feedUrl, { cache: "no-store", signal });
  if (!response.ok) throw new Error(`RSS 请求失败：${response.status}`);
  return parseWritingFeed(await response.text(), blogUrl, parseXml);
}

// 页面初次读取与手动重试共用同一状态边界，失败不恢复旧文章。
export async function loadWritingFeedState(feedUrl, blogUrl, options = {}) {
  try {
    const posts = await loadWritingFeed(feedUrl, blogUrl, options);
    return { status: "ready", posts };
  } catch {
    return { status: "error", posts: [] };
  }
}
