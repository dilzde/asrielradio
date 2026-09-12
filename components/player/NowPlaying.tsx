"use client";

import { useEffect, useState } from "react";
import playerState from "@/lib/player-state";

interface NowPlayingProps {
  initialTitle?: string;
  initialHost?: string;
}

export default function NowPlaying({
  initialTitle = "Asriel Radio 24/7",
  initialHost = "The Digital Sanctuary",
}: NowPlayingProps) {
  const [trackTitle, setTrackTitle] = useState(initialTitle);
  const [trackHost, setTrackHost] = useState(initialHost);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const unsub = playerState.subscribe((live) => setIsLive(live));
    return unsub;
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource("/api/metadata");

      eventSource.onmessage = (event) => {
        if (!event.data) return;
        try {
          const parsed = JSON.parse(event.data);
          const rawTitle =
            parsed.streamTitle ||
            parsed.title ||
            parsed.name ||
            (typeof parsed === "string" ? parsed : null);

          if (rawTitle) {
            if (rawTitle.includes(" - ")) {
              const [artist, song] = rawTitle.split(" - ");
              setTrackTitle(song.trim());
              setTrackHost(artist.trim());
            } else {
              setTrackTitle(rawTitle);
            }
          }
        } catch {
          if (typeof event.data === "string" && event.data.trim()) {
            setTrackTitle(event.data.trim());
          }
        }
      };

      eventSource.onerror = () => {};
    } catch (e) {
      console.warn("EventSource metadata connection not available", e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="now-card">
      <div className="now-card-top">
        <span className="now-label">NOW PLAYING</span>
        <div className="live-pill">
          <span className="live-dot" /> LIVE
        </div>
      </div>

      <div className="now-track">
        <div className="now-badge">
          {/* Microphone outline icon */}
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
        <div className="now-meta-text">
          <h3>{trackTitle}</h3>
          <div className="host">{trackHost}</div>
        </div>
      </div>

      {/* Chunky waveform bars matching reference */}
      <div className={`chunky-waveform ${isLive ? "active" : ""}`}>
        <span className="bar b1" />
        <span className="bar b2" />
        <span className="bar b3 active-bar" />
        <span className="bar b4" />
        <span className="bar b5" />
        <span className="bar b6" />
        <span className="bar b7" />
        <span className="bar b8" />
      </div>

      <div className="stat-row">
        <div className="stat">
          <b>24/7</b>
          <span>STREAM</span>
        </div>
        <div className="stat">
          <b>10</b>
          <span>SHOWS</span>
        </div>
        <div className="stat">
          <b>5</b>
          <span>HOSTS</span>
        </div>
      </div>
    </div>
  );
}
