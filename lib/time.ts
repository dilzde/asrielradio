// ────────────────────────────────────────────────────────
// lib/time.ts  –  Africa/Nairobi timezone utilities
// ────────────────────────────────────────────────────────

export interface StationTime {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  timeString: string; // "HH:MM:SS"
}

/**
 * Get the current station time in Africa/Nairobi timezone.
 * Uses Intl.DateTimeFormat for reliable server + client parity.
 */
export function getStationTime(date?: Date): StationTime {
  const now = date || new Date();
  const tz = "Africa/Nairobi";

  // Get time components
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const timeString = timeFmt.format(now).replace(/\u202f/g, ""); // Remove narrow no-break space

  // Get day of week
  let dayOfWeek: number;
  try {
    const dayFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
    });
    const dayStr = dayFmt.format(now);
    const days: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    dayOfWeek = days[dayStr] ?? now.getDay();
  } catch {
    dayOfWeek = now.getDay();
  }

  return { dayOfWeek, timeString };
}

/** Parse "HH:MM:SS" or "HH:MM" into total minutes from midnight */
export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}
