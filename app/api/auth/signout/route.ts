// ────────────────────────────────────────────────────────
// app/api/auth/signout/route.ts  –  POST sign out route
// ────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/login", url.origin), {
    status: 303,
  });
}
