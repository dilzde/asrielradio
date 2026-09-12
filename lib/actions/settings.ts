// ────────────────────────────────────────────────────────
// lib/actions/settings.ts  –  Server actions for settings upsert
// ────────────────────────────────────────────────────────
"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function updateSetting(key: string, value: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("settings").upsert(
    {
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateMultipleSettings(data: { key: string; value: string }[]) {
  const supabase = await createServerClient();

  const payload = data.map((item) => ({
    key: item.key,
    value: item.value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("settings").upsert(payload, {
    onConflict: "key",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
