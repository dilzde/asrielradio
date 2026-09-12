"use client";
import { useEffect, useState, useMemo } from "react";
import { getStationTime, timeToMinutes } from "@/lib/time";
import type { Program } from "@/lib/actions/programs";
import { getFallbackPrograms } from "@/lib/fallback-schedule";

interface LiveHeroStatusProps {
  todaysPrograms?: Program[];
  fallbackTitle?: string;
}

export default function LiveHeroStatus({
  todaysPrograms,
  fallbackTitle = "Morning Worship",
}: LiveHeroStatusProps) {
  const [mounted, setMounted] = useState(false);
  const [currentShow, setCurrentShow] = useState<Program | null>(null);
  const [progressPercent, setProgressPercent] = useState(25);
  const [timeRange, setTimeRange] = useState({ start: "12:00 AM", end: "05:30 AM" });

  const format12h = (hhmmss: string) => {
    const parts = hhmmss.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    if (h === 23 && parseInt(m, 10) >= 59) {
      return "12:00 AM";
    }
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  };

  const updateStatus = () => {
    const station = getStationTime();
    const nowMins = timeToMinutes(station.timeString);

    const available = todaysPrograms && todaysPrograms.length > 0
      ? todaysPrograms
      : getFallbackPrograms(station.dayOfWeek);

    const currentDayPrograms = available.filter(
      (p) => p.day_of_week === station.dayOfWeek
    );
    const targetList = currentDayPrograms.length > 0 ? currentDayPrograms : available;

    let active = targetList.find((p) => {
      const s = timeToMinutes(p.start_time);
      let e = timeToMinutes(p.end_time);
      if (p.end_time.startsWith("23:59")) e = 1440;
      return nowMins >= s && nowMins < e;
    });

    if (!active) {
      const pastShows = targetList.filter(
        (p) => timeToMinutes(p.end_time) <= nowMins
      );
      active = pastShows[pastShows.length - 1] || targetList[0];
    }

    if (active) {
      setCurrentShow(active);
      const startM = timeToMinutes(active.start_time);
      let endM = timeToMinutes(active.end_time);
      if (active.end_time.startsWith("23:59")) endM = 1440;
      const total = endM > startM ? endM - startM : 60;
      const elapsed = Math.max(0, nowMins - startM);
      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
      setProgressPercent(pct);
      setTimeRange({
        start: format12h(active.start_time),
        end: format12h(active.end_time),
      });
    }
  };

  useEffect(() => {
    setMounted(true);
    updateStatus();
    const interval = setInterval(updateStatus, 15000);
    return () => clearInterval(interval);
  }, [todaysPrograms]);

  if (!mounted) {
    return (
      <div style={{ opacity: 0 }}>
        <h1>
          Morning <em>Worship</em>
        </h1>
        <div className="hero-meta">
          <span>12:00 AM</span>
          <div className="hero-progress" />
          <span>05:30 AM</span>
        </div>
      </div>
    );
  }

  const title = currentShow ? currentShow.title : fallbackTitle;
  const words = title.split(" ");
  const line1 = words.slice(0, Math.max(1, words.length - 1)).join(" ");
  const line2 = words.length > 1 ? words[words.length - 1] : "";

  return (
    <>
      <div className="eyebrow">
        <span className="bar" /> Broadcasting live from Nairobi
      </div>
      <h1>
        {line1} {line2 && <em>{line2}</em>}
      </h1>

      <div className="hero-meta">
        <span>{timeRange.start}</span>
        <div className="hero-progress">
          <div
            className="hero-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>{timeRange.end}</span>
      </div>
    </>
  );
}
