"use client";

import { useEffect, useState, useRef } from "react";
import { STREAM_URL } from "@/lib/constants";

declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    cast?: any;
    chrome?: any;
  }
}

export default function CastButton() {
  const [castAvailable, setCastAvailable] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [airPlayAvailable, setAirPlayAvailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check AirPlay
    if (typeof window !== "undefined") {
      const audio = document.createElement("audio");
      audioRef.current = audio;
      if ((window as any).WebKitPlaybackTargetAvailabilityEvent) {
        audio.addEventListener(
          "webkitplaybacktargetavailabilitychanged",
          (event: any) => {
            setAirPlayAvailable(event.availability === "available");
          }
        );
      }
    }

    // Google Cast SDK setup
    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable && window.cast && window.cast.framework) {
        try {
          const context = window.cast.framework.CastContext.getInstance();
          context.setOptions({
            receiverApplicationId:
              window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
          });

          context.addEventListener(
            window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
            (event: any) => {
              const state = event.sessionState;
              setIsCasting(
                state === window.cast.framework.SessionState.SESSION_STARTED ||
                  state === window.cast.framework.SessionState.SESSION_RESUMED
              );
            }
          );
          setCastAvailable(true);
        } catch (e) {
          console.error("Cast SDK init error:", e);
        }
      }
    };

    // Load cast sender script if not already loaded
    if (!document.getElementById("cast-sender-script")) {
      const script = document.createElement("script");
      script.id = "cast-sender-script";
      script.src =
        "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
      document.body.appendChild(script);
    } else if (window.cast?.framework) {
      setCastAvailable(true);
    }
  }, []);

  const handleCastClick = () => {
    if (castAvailable && window.cast?.framework) {
      try {
        const context = window.cast.framework.CastContext.getInstance();
        context.requestSession().then(
          () => {
            const session = context.getCurrentSession();
            if (session) {
              const mediaInfo = new window.chrome.cast.media.MediaInfo(
                STREAM_URL,
                "audio/mp3"
              );
              mediaInfo.metadata =
                new window.chrome.cast.media.MusicTrackMediaMetadata();
              mediaInfo.metadata.title = "Asriel Radio 24/7";
              mediaInfo.metadata.artist = "The Digital Sanctuary";
              const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
              session.loadMedia(request);
            }
          },
          (err: any) => {
            console.log("Cast session request rejected or cancelled", err);
          }
        );
        return;
      } catch (e) {
        console.error("Error triggering cast session", e);
      }
    }

    // Fallback: AirPlay
    if (airPlayAvailable && audioRef.current && (audioRef.current as any).webkitShowPlaybackTargetPicker) {
      (audioRef.current as any).webkitShowPlaybackTargetPicker();
    }
  };

  return (
    <button
      type="button"
      className={`floating-cast-btn ${isCasting ? "active" : ""}`}
      onClick={handleCastClick}
      title={isCasting ? "Casting live audio" : "Cast to TV / Speaker"}
      aria-label="Cast to TV / Speaker"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        style={{ display: "block" }}
      >
        <path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.92-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      </svg>
    </button>
  );
}
