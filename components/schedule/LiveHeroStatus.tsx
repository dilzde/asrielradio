"use client";

import { useEffect, useState } from "react";
import { getStationTime, timeToMinutes } from "@/lib/time";
import type { Program } from "@/lib/actions/programs";

interface LiveHeroStatusProps {
  todaysPrograms: Program[];
  fallbackTitle?: string;
}

export default function LiveHeroStatus({
  todaysPrograms,
  fallbackTitle = "News & Partnership Impact",
}: LiveHeroStatusProps) {
  const [mounted, setMounted] = useState(false);
  const [currentShow, setCurrentShow] = useState<Program | null>(null);
  const [progressPercent, setProgressPercent] = useState(45);
  const [timeRange, setTimeRange] = useState({ start: "03:30 PM", end: "04:30 PM" });

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

    if (todaysPrograms && todaysPrograms.length > 0) {
      const currentDayPrograms = todaysPrograms.filter(
        (p) => p.day_of_week === station.dayOfWeek
      );
      const targetList = currentDayPrograms.length > 0 ? currentDayPrograms : todaysPrograms;

      let active = targetList.find((p) => {
        const s = timeToMinutes(p.start_time);
        let e = timeToMinutes(p.end_time);
        if (p.end_time.startsWith("23:59")) e = 1440;
        return nowMins >= s && nowMins < e;
      });

      if (!active) {
        // Fallback: past show or first show
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
        const elapsed = nowMins - startM;
        const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
        setProgressPercent(pct);
        setTimeRange({
          start: format12h(active.start_time),
          end: format12h(active.end_time),
        });
        return;
      }
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
          News &amp; Partnership <em>Impact</em>
        </h1>
        <div className="hero-meta">
          <span>03:30 PM</span>
          <div className="hero-progress" />
          <span>04:30 PM</span>
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
