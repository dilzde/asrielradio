// ────────────────────────────────────────────────────────
// lib/rss.ts  –  Zero-dependency regex RSS/XML parser
// ────────────────────────────────────────────────────────

export interface PodcastEpisode {
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
}

/** Extract text between tags, handling CDATA */
function tagContent(xml: string, tag: string): string {
  const regex = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`,
    "i"
  );
  const match = xml.match(regex);
  if (!match) return "";
  return (match[1] || match[2] || "").trim();
}

/** Extract attribute value */
function attrValue(xml: string, tag: string, attr: string): string {
  const regex = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["']`, "i");
  const match = xml.match(regex);
  return match?.[1] || "";
}

/** Parse RSS/XML podcast feed into episodes */
export function parseRssFeed(xml: string): PodcastEpisode[] {
  const episodes: PodcastEpisode[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    episodes.push({
      title: tagContent(item, "title"),
      description: tagContent(item, "description"),
      pubDate: tagContent(item, "pubDate"),
      duration: tagContent(item, "itunes:duration"),
      audioUrl: attrValue(item, "enclosure", "url"),
      imageUrl:
        attrValue(item, "itunes:image", "href") ||
        attrValue(item, "media:content", "url"),
    });
  }

  return episodes;
}

/** Fetch and parse the podcast RSS feed (server-side) */
export async function fetchPodcastFeed(
  rssUrl: string
): Promise<PodcastEpisode[]> {
  try {
    const res = await fetch(rssUrl, {
      next: { revalidate: 3600 }, // 1-hour ISR
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssFeed(xml);
  } catch {
    return [];
  }
}
