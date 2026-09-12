import type { Program } from "@/lib/actions/programs";

export const FALLBACK_WEEKDAY_PROGRAMS = [
  { title: "Early Morning Worship", host: "Asriel Radio", start_time: "00:00:00", end_time: "06:00:00" },
  { title: "Morning Deep Dive", host: "Valentine Achieng", start_time: "06:00:00", end_time: "09:00:00" },
  { title: "Prophetic Insight", host: "Prophet Samo Mtishiby", start_time: "09:00:00", end_time: "09:30:00" },
  { title: "Faith Fuel", host: "The Peace Captain", start_time: "09:30:00", end_time: "12:30:00" },
  { title: "Prophetic Insight", host: "Prophet Samo Mtishiby", start_time: "12:30:00", end_time: "13:30:00" },
  { title: "GenZ for Christ", host: "Brother Moses", start_time: "13:30:00", end_time: "16:00:00" },
  { title: "Prophetic Insight", host: "Prophet Samo Mtishiby", start_time: "16:00:00", end_time: "16:30:00" },
  { title: "Shangilia", host: "Brother Stallon", start_time: "16:30:00", end_time: "19:00:00" },
  { title: "Family Talk", host: "Prophet Samo Mtishiby", start_time: "19:00:00", end_time: "20:00:00" },
  { title: "Night of Worship", host: "Asriel Radio", start_time: "20:00:00", end_time: "23:59:59" },
];

export const FALLBACK_SATURDAY_PROGRAMS = [
  { title: "Purely Worship", host: "Asriel Radio", start_time: "00:00:00", end_time: "23:59:59" },
];

export const FALLBACK_SUNDAY_PROGRAMS = [
  { title: "Morning Worship", host: "Asriel Radio", start_time: "00:00:00", end_time: "05:30:00" },
  { title: "Charge Your Morning", host: "Prophet Dr Samo Mtishiby", start_time: "05:30:00", end_time: "08:00:00" },
  { title: "Purely Worship", host: "Asriel Radio", start_time: "08:00:00", end_time: "23:59:59" },
];

export function getFallbackPrograms(dayOfWeek: number): Program[] {
  let template = FALLBACK_WEEKDAY_PROGRAMS;
  if (dayOfWeek === 6) template = FALLBACK_SATURDAY_PROGRAMS;
  else if (dayOfWeek === 0) template = FALLBACK_SUNDAY_PROGRAMS;

  return template.map((item, idx) => ({
    id: `fallback-${dayOfWeek}-${idx}`,
    title: item.title,
    host: item.host,
    day_of_week: dayOfWeek,
    start_time: item.start_time,
    end_time: item.end_time,
    created_at: new Date().toISOString(),
  }));
}

export function getAllFallbackPrograms(): Program[] {
  const all: Program[] = [];
  // Days 0 to 6
  for (let d = 0; d <= 6; d++) {
    all.push(...getFallbackPrograms(d));
  }
  return all;
}
