// ────────────────────────────────────────────────────────
// lib/actions/programs.ts  –  Server actions for program CRUD
// ────────────────────────────────────────────────────────
"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export interface Program {
  id: string;
  title: string;
  host: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

export async function addProgram(formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("programs").insert({
    title: formData.get("title") as string,
    host: (formData.get("host") as string) || null,
    day_of_week: Number(formData.get("day_of_week")),
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateProgram(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("programs")
    .update({
      title: formData.get("title") as string,
      host: (formData.get("host") as string) || null,
      day_of_week: Number(formData.get("day_of_week")),
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function deleteProgram(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("programs").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
