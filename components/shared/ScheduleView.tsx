"use client";

import { useEffect, useState } from "react";
import { getStationTime, timeToMinutes } from "@/lib/time";
import type { Program } from "@/lib/actions/programs";

interface ScheduleViewProps {
  initialPrograms: Program[];
}

type DayGroup = "weekday" | "saturday" | "sunday";

const DAY_GROUPS: { id: DayGroup; label: string }[] = [
  { id: "weekday", label: "Monday – Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

import {
  FALLBACK_WEEKDAY_PROGRAMS,
  FALLBACK_SATURDAY_PROGRAMS,
  FALLBACK_SUNDAY_PROGRAMS,
} from "@/lib/fallback-schedule";

export default function ScheduleView({ initialPrograms }: ScheduleViewProps) {
  const [stationTime, setStationTime] = useState({ dayOfWeek: 1, timeString: "12:00:00" });
  const [selectedGroup, setSelectedGroup] = useState<DayGroup>("weekday");
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getStationTime();
    setStationTime(initial);

    if (initial.dayOfWeek === 6) {
      setSelectedGroup("saturday");
    } else if (initial.dayOfWeek === 0) {
      setSelectedGroup("sunday");
    } else {
      setSelectedGroup("weekday");
    }

    const interval = setInterval(() => {
      setStationTime(getStationTime());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const format12h = (hhmmss: string) => {
    const parts = hhmmss.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    if (h === 23 && parseInt(m, 10) >= 59) {
      return { time: "12:00", ampm: "AM" };
    }
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return { time: `${h}:${m}`, ampm };
  };

  const currentDayOfWeek = mounted ? stationTime.dayOfWeek : 1;
  const nowMins = mounted ? timeToMinutes(stationTime.timeString) : 720;

  // Determine if selected group is today
  const isViewingToday =
    (selectedGroup === "weekday" && currentDayOfWeek >= 1 && currentDayOfWeek <= 5) ||
    (selectedGroup === "saturday" && currentDayOfWeek === 6) ||
    (selectedGroup === "sunday" && currentDayOfWeek === 0);

  // Pick the target day index
  let targetDay = 1;
  if (selectedGroup === "saturday") targetDay = 6;
  else if (selectedGroup === "sunday") targetDay = 0;
  else if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) targetDay = currentDayOfWeek;

  // Filter programs
  let dayShows = (initialPrograms || []).filter((p) => p.day_of_week === targetDay);

  if (dayShows.length === 0) {
    let fallbackTemplate = FALLBACK_WEEKDAY_PROGRAMS;
    if (selectedGroup === "saturday") fallbackTemplate = FALLBACK_SATURDAY_PROGRAMS;
    else if (selectedGroup === "sunday") fallbackTemplate = FALLBACK_SUNDAY_PROGRAMS;

    dayShows = fallbackTemplate.map((item, idx) => ({
      id: `fallback-${selectedGroup}-${idx}`,
      title: item.title,
      host: item.host,
      day_of_week: targetDay,
      start_time: item.start_time,
      end_time: item.end_time,
      created_at: new Date().toISOString(),
    }));
  }

  // Sort chronologically
  dayShows.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

  // Determine active show index
  const activeIdx = dayShows.findIndex((p) => {
    const s = timeToMinutes(p.start_time);
    let e = timeToMinutes(p.end_time);
    if (p.end_time.startsWith("23:59")) e = 1440;
    return nowMins >= s && nowMins < e;
  });

  // Calculate visible slice (3 or 4 shows: currently playing + upcoming 3)
  let visibleShows = dayShows;
  if (!showAll && dayShows.length > 4) {
    if (isViewingToday && activeIdx !== -1) {
      // Start from live show and take up to 4 shows
      const start = Math.max(0, Math.min(activeIdx, dayShows.length - 4));
      visibleShows = dayShows.slice(start, start + 4);
    } else {
      visibleShows = dayShows.slice(0, 4);
    }
  }

  return (
    <div className="schedule-container">
      {/* Group Selector: Monday - Friday, Saturday, Sunday */}
      <div className="schedule-tabs" role="tablist" aria-label="Broadcast Days">
        {DAY_GROUPS.map((g) => {
          const isSelected = g.id === selectedGroup;
          const isGroupToday =
            mounted &&
            ((g.id === "weekday" && currentDayOfWeek >= 1 && currentDayOfWeek <= 5) ||
              (g.id === "saturday" && currentDayOfWeek === 6) ||
              (g.id === "sunday" && currentDayOfWeek === 0));

          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`schedule-tab-btn ${isSelected ? "active" : ""}`}
              onClick={() => {
                setSelectedGroup(g.id);
                setShowAll(false);
              }}
            >
              <span>{g.label}</span>
              {isGroupToday && <span className="schedule-tab-badge">Today</span>}
            </button>
          );
        })}
      </div>

      {/* Program Rows */}
      <div className="schedule-list">
        {visibleShows.map((prog, idx) => {
          const startM = timeToMinutes(prog.start_time);
          let endM = timeToMinutes(prog.end_time);
          if (prog.end_time.startsWith("23:59")) endM = 1440;

          const isLive = isViewingToday && nowMins >= startM && nowMins < endM;
          const isPast = isViewingToday && nowMins >= endM;
          const isNext =
            isViewingToday && !isLive && !isPast && (activeIdx === -1 ? idx === 0 : idx === activeIdx + 1);

          const { time, ampm } = format12h(prog.start_time);

          return (
            <div
              key={prog.id}
              className={`schedule-row ${isLive ? "active" : ""}`}
            >
              <div className="schedule-time">
                <b>{time}</b>
                <span>{ampm}</span>
              </div>
              <div className="schedule-info">
                <h4>{prog.title}</h4>
                <span>{prog.host ? prog.host : "Asriel Radio"}</span>
              </div>
              <div>
                {isLive ? (
                  <span className="tag live">Live now</span>
                ) : isNext ? (
                  <span className="tag next">Next up</span>
                ) : (
                  <span className="tag later">Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* See All / Toggle Button */}
      {dayShows.length > 4 && (
        <div className="schedule-see-all-wrapper">
          <button
            type="button"
            className="btn-see-all-schedule"
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
          >
            {showAll ? "Show Less" : `See Full Schedule (${dayShows.length} shows)`}
            <span className="see-all-arrow">{showAll ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
