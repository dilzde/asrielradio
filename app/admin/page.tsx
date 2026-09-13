import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { STREAM_URL, WA_NUMBER, YOUTUBE_LIVE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();
  const { count: programCount } = await supabase
    .from("programs")
    .select("*", { count: "exact", head: true });

  const settings = await getSettings();

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1C1208", textTransform: "uppercase" }}>
          Station Dashboard
        </h1>
        <p style={{ color: "#6B7573", fontSize: "14.5px", marginTop: "4px" }}>
          Real-time overview of Asriel Radio 24/7 broadcast operations and CMS configurations.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E0D4",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7573", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Scheduled Programs
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#D4860A", marginTop: "8px" }}>
            {programCount || 0}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
            Across 7 days of broadcasting
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E0D4",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7573", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Audio Stream Status
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#10B981", marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
            Active (Zeno FM)
          </div>
          <div style={{ fontSize: "12px", color: "#6B7573", marginTop: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {settings.stream_url || STREAM_URL}
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E0D4",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7573", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            WhatsApp Hotline
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#1C1208", marginTop: "10px" }}>
            {(settings.wa_number || WA_NUMBER).startsWith("0") ? (settings.wa_number || WA_NUMBER) : "+" + (settings.wa_number || WA_NUMBER)}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
            Listener contact &amp; guest bookings
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E0D4",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7573", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            YouTube Live ID
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#1C1208", marginTop: "10px" }}>
            {settings.youtube_live_id || YOUTUBE_LIVE_ID}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
            Prophet Dr. Samo Mtishiby stream
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C1208", marginBottom: "8px" }}>
            Weekly Program Schedule
          </h3>
          <p style={{ color: "#6B7573", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
            Configure daily programs, hosts, and broadcast time slots. Programs appear on the homepage with live progress tracking.
          </p>
          <Link
            href="/admin/schedule"
            style={{
              display: "inline-block",
              background: "#D4860A",
              color: "#1C1208",
              fontWeight: 700,
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            Manage Schedule &rarr;
          </Link>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C1208", marginBottom: "8px" }}>
            Station Configuration
          </h3>
          <p style={{ color: "#6B7573", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
            Update stream URLs, social media profiles, WhatsApp hotline, and YouTube broadcast links with zero code changes.
          </p>
          <Link
            href="/admin/settings"
            style={{
              display: "inline-block",
              background: "#1C1208",
              color: "#F5F0E8",
              fontWeight: 700,
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            Edit Settings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
