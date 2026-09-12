// ────────────────────────────────────────────────────────
// lib/settings.ts  –  React.cache() Supabase settings loader
// ────────────────────────────────────────────────────────
import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import {
  STREAM_URL,
  METADATA_URL,
  ZENO_RSS,
  WA_NUMBER,
  YOUTUBE_LIVE_ID,
  SOCIAL_DEFAULTS,
} from "./constants";

const DEFAULTS: Record<string, string> = {
  stream_url: STREAM_URL,
  metadata_url: METADATA_URL,
  zeno_rss: ZENO_RSS,
  wa_number: WA_NUMBER,
  youtube_live_id: YOUTUBE_LIVE_ID,
  ...SOCIAL_DEFAULTS,
};

/**
 * Fetch all settings from Supabase `settings` table.
 * Wrapped in React cache() so it runs once per request,
 * shared across all server components in the render tree.
 * Falls back to hardcoded constants if Supabase fails.
 */
export const getSettings = cache(
  async (): Promise<Record<string, string>> => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("settings")
        .select("key, value");

      if (error || !data) {
        return { ...DEFAULTS };
      }

      const settings: Record<string, string> = { ...DEFAULTS };
      for (const row of data) {
        if (row.key && row.value) {
          settings[row.key] = row.value;
        }
      }
      return settings;
    } catch {
      return { ...DEFAULTS };
    }
  }
);
