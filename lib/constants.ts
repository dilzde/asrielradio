// ────────────────────────────────────────────────────────
// lib/constants.ts  –  Fallback values & shared config
// ────────────────────────────────────────────────────────

export const STREAM_URL =
  "https://stream.zeno.fm/iy8v0envboitv";

export const METADATA_URL =
  "https://api.zeno.fm/mounts/metadata/subscribe/iy8v0envboitv";

export const ZENO_RSS =
  "https://feeds.zenofm.com/iy8v0envboitv/podcast.rss";

export const WA_NUMBER = "254794731831";

export const YOUTUBE_LIVE_ID = "NNFUI2UFMag";

export interface SocialPlatform {
  name: string;
  url: string;
  icon: string; // react-icons name
}

export const SOCIAL_DEFAULTS: Record<string, string> = {
  youtube_url: "https://youtube.com/@asrieltv?si=g4pykHoylbN_A5-C",
  tiktok_url: "https://www.tiktok.com/@asriel_tv01?_r=1&_t=ZS-99WsIEVqngK",
  instagram_url: "https://www.instagram.com/vpmintl?stkn=dmhlcGdmamJmaG9l",
  facebook_url: "https://facebook.com/asrielradio24/7",
  twitter_url: "https://x.com/asrielradio24/7",
};

export const VPM_URL = "https://vpminternational.com";

export const YOUTUBE_CHANNEL =
  "https://youtube.com/@asrieltv?si=g4pykHoylbN_A5-C";

export const TIKTOK_URL =
  "https://www.tiktok.com/@asriel_tv01?_r=1&_t=ZS-99WsIEVqngK";

export const INSTAGRAM_URL =
  "https://www.instagram.com/vpmintl?stkn=dmhlcGdmamJmaG9l";

export const WHATSAPP_URL = "https://wa.me/254794731831";

/** Merge DB settings with hardcoded fallbacks for social links */
export function getFormattedSocialLinks(
  settings: Record<string, string>
): { name: string; url: string }[] {
  const links = [
    {
      name: "YouTube",
      url: settings.youtube_url || SOCIAL_DEFAULTS.youtube_url,
    },
    {
      name: "TikTok",
      url: settings.tiktok_url || SOCIAL_DEFAULTS.tiktok_url,
    },
    {
      name: "Instagram",
      url: settings.instagram_url || SOCIAL_DEFAULTS.instagram_url,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/${settings.wa_number || WA_NUMBER}`,
    },
  ];
  return links;
}
