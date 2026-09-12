"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import playerState from "@/lib/player-state";
import { STREAM_URL } from "@/lib/constants";

const CastButton = dynamic(() => import("./CastButton"), { ssr: false });

interface GlobalPlayerProps {
  streamUrl?: string;
}

export default function GlobalPlayer({ streamUrl }: GlobalPlayerProps) {
  const audioUrl = streamUrl || STREAM_URL;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      playerState.setIsLive(false);
    } else {
      setIsLoading(true);
      // If src wasn't set or stream stalled, set live source with timestamp cache-buster if needed
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        audioRef.current.src = audioUrl;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          playerState.setIsLive(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsLoading(false);
          setIsPlaying(false);
          playerState.setIsLive(false);
        });
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    // Register toggle function with singleton
    const unregister = playerState.registerToggle(handleToggle);

    // Fallback event listener
    const onCustomToggle = () => handleToggle();
    window.addEventListener("player-toggle", onCustomToggle);

    return () => {
      unregister();
      window.removeEventListener("player-toggle", onCustomToggle);
    };
  }, [handleToggle]);

  return (
    <div className="floating-player-wrapper" role="region" aria-label="Audio player">
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
          playerState.setIsLive(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          playerState.setIsLive(false);
        }}
        onError={() => {
          setIsPlaying(false);
          setIsLoading(false);
          playerState.setIsLive(false);
        }}
      />

      <div className="floating-player-capsule">
        {/* Golden Circular Play/Pause Button */}
        <button
          type="button"
          className={`floating-play-circle ${isPlaying ? "playing" : ""} ${isLoading ? "loading" : ""}`}
          onClick={handleToggle}
          aria-label={isPlaying ? "Pause live broadcast" : "Play live broadcast"}
          title={isPlaying ? "Pause broadcast" : "Listen live"}
        >
          {isLoading ? (
            <span className="spinner-icon" />
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#111111" style={{ display: "block" }}>
              <rect x="6" y="5" width="4" height="14" rx="1.5" />
              <rect x="14" y="5" width="4" height="14" rx="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#111111" style={{ display: "block", marginLeft: "1px" }}>
              <path d="M8.5 6.5C8.5 5.7 9.4 5.2 10.1 5.6L18.6 11.1C19.2 11.5 19.2 12.5 18.6 12.9L10.1 18.4C9.4 18.8 8.5 18.3 8.5 17.5V6.5Z" />
            </svg>
          )}
        </button>

        {/* Vertical Divider Line */}
        <div className="floating-divider" />

        {/* Cast Icon */}
        <div className="floating-cast-wrapper">
          <CastButton />
        </div>
      </div>
    </div>
  );
}
