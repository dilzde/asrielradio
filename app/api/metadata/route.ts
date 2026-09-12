// ────────────────────────────────────────────────────────
// app/api/metadata/route.ts  –  Edge runtime SSE proxy
// ────────────────────────────────────────────────────────
import { METADATA_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await fetch(METADATA_URL, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to connect to stream metadata", {
        status: 502,
      });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("SSE proxy error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
