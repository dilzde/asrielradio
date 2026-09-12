import { createServerClient } from "@/lib/supabase/server";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import type { Program } from "@/lib/actions/programs";

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  const supabase = await createServerClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <div>
      <ScheduleForm programs={(programs as Program[]) || []} />
    </div>
  );
}
