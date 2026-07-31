function getText(item, selector) {
  return item.querySelector(selector)?.textContent?.trim() || "";
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
      link: getText(item, "link") || blogUrl,
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
  const response = await fetchFeed(feedUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`RSS 请求失败：${response.status}`);
  return parseWritingFeed(await response.text(), blogUrl, parseXml);
}
