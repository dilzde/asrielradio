"use client";

import { useEffect, useState, useTransition } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { updateMultipleSettings } from "@/lib/actions/settings";
import {
  STREAM_URL,
  METADATA_URL,
  ZENO_RSS,
  WA_NUMBER,
  YOUTUBE_LIVE_ID,
  SOCIAL_DEFAULTS,
  YOUTUBE_CHANNEL,
} from "@/lib/constants";

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<Record<string, string>>({
    stream_url: STREAM_URL,
    metadata_url: METADATA_URL,
    zeno_rss: ZENO_RSS,
    wa_number: WA_NUMBER,
    youtube_live_id: YOUTUBE_LIVE_ID,
    facebook_url: SOCIAL_DEFAULTS.facebook_url,
    instagram_url: SOCIAL_DEFAULTS.instagram_url,
    twitter_url: SOCIAL_DEFAULTS.twitter_url,
    youtube_url: YOUTUBE_CHANNEL,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createBrowserClient();
        const { data } = await supabase.from("settings").select("key, value");

        if (data && data.length > 0) {
          const loaded: Record<string, string> = {};
          data.forEach((row) => {
            loaded[row.key] = row.value;
          });
          setSettings((prev) => ({ ...prev, ...loaded }));
        }
      } catch (err) {
        console.warn("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const payload = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    startTransition(async () => {
      try {
        await updateMultipleSettings(payload);
        setSaved(true);
      } catch (err: any) {
        setError(err?.message || "Failed to save settings");
      }
    });
  };

  if (loading) {
    return <div style={{ padding: "40px", color: "#6B7573" }}>Loading station settings...</div>;
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1C1208", textTransform: "uppercase" }}>
          Station Settings
        </h1>
        <p style={{ color: "#6B7573", fontSize: "14.5px", marginTop: "4px" }}>
          Configure broadcast endpoints, social media links, and WhatsApp hotline. Updates invalidate the station cache live.
        </p>
      </div>

      {saved && (
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "14px 18px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px", fontWeight: 600 }}>
          ✓ Settings successfully saved and live across the station!
        </div>
      )}

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "14px 18px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Streaming Section */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1C1208", marginBottom: "16px" }}>
            Broadcast &amp; Stream URLs
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Live Stream URL (Zeno FM audio)
              </label>
              <input
                type="url"
                value={settings.stream_url || ""}
                onChange={(e) => handleChange("stream_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                SSE Metadata URL (Zeno FM track titles)
              </label>
              <input
                type="url"
                value={settings.metadata_url || ""}
                onChange={(e) => handleChange("metadata_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Podcast RSS Feed URL
              </label>
              <input
                type="url"
                value={settings.zeno_rss || ""}
                onChange={(e) => handleChange("zeno_rss", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        {/* Contact & Media Section */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1C1208", marginBottom: "16px" }}>
            Contact &amp; Video Streams
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                WhatsApp Number (E.164 without +)
              </label>
              <input
                type="text"
                value={settings.wa_number || ""}
                onChange={(e) => handleChange("wa_number", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                YouTube Live ID
              </label>
              <input
                type="text"
                value={settings.youtube_live_id || ""}
                onChange={(e) => handleChange("youtube_live_id", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1C1208", marginBottom: "16px" }}>
            Social Media Links
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Facebook Page URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ""}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={settings.instagram_url || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                X / Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitter_url || ""}
                onChange={(e) => handleChange("twitter_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.youtube_url || ""}
                onChange={(e) => handleChange("youtube_url", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            background: "#D4860A",
            color: "#1C1208",
            fontWeight: 700,
            fontSize: "15px",
            padding: "14px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            alignSelf: "flex-start",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Saving Settings..." : "Save All Station Settings"}
        </button>
      </form>
    </div>
  );
}
