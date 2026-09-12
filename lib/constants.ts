// ────────────────────────────────────────────────────────
// lib/constants.ts  –  Fallback values & shared config
// ────────────────────────────────────────────────────────

export const STREAM_URL =
  "https://stream.zeno.fm/iy8v0envboitv";

export const METADATA_URL =
  "https://api.zeno.fm/mounts/metadata/subscribe/iy8v0envboitv";

export const ZENO_RSS =
  "https://feeds.zenofm.com/iy8v0envboitv/podcast.rss";

export const WA_NUMBER = "254116304484";

export const YOUTUBE_LIVE_ID = "NNFUI2UFMag";

export interface SocialPlatform {
  name: string;
  url: string;
  icon: string; // react-icons name
}

export const SOCIAL_DEFAULTS: Record<string, string> = {
  facebook_url: "https://facebook.com/asrielradio24/7",
  instagram_url: "https://instagram.com/asrielradio24/7",
  twitter_url: "https://x.com/asrielradio24/7",
  youtube_url: "https://youtube.com/@asrielradio24/7",
};

export const VPM_URL = "https://vpminternational.com";

export const YOUTUBE_CHANNEL =
  "https://www.youtube.com/channel/UC5z_MlBqT0-uB9Y6IQlD68A";

/** Merge DB settings with hardcoded fallbacks for social links */
export function getFormattedSocialLinks(
  settings: Record<string, string>
): { name: string; url: string }[] {
  const links = [
    {
      name: "Facebook",
      url: settings.facebook_url || SOCIAL_DEFAULTS.facebook_url,
    },
    {
      name: "Instagram",
      url: settings.instagram_url || SOCIAL_DEFAULTS.instagram_url,
    },
    {
      name: "Twitter",
      url: settings.twitter_url || SOCIAL_DEFAULTS.twitter_url,
    },
    {
      name: "YouTube",
      url: settings.youtube_url || SOCIAL_DEFAULTS.youtube_url,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/${settings.wa_number || WA_NUMBER}`,
    },
  ];
  return links;
}
