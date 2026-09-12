"use client";

import { useEffect, useState } from "react";
import playerState from "@/lib/player-state";

export default function HeroPlayButton() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const cleanup = playerState.subscribe((live) => {
      setIsLive(live);
    });
    return cleanup;
  }, []);

  const handleToggle = () => {
    playerState.toggle();
  };

  return (
    <button
      type="button"
      className="btn-primary"
      onClick={handleToggle}
      aria-label={isLive ? "Pause Live Broadcast" : "Listen Live Broadcast"}
    >
      {isLive ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <span>Pause Stream</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Listen Live</span>
        </>
      )}
    </button>
  );
}
