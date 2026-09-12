// ────────────────────────────────────────────────────────
// lib/player-state.ts  –  Singleton pub/sub for audio play state
// ────────────────────────────────────────────────────────
// HeroPlayButton.onClick → playerState.toggle()
//   → registered callback in GlobalPlayer
//     → audioRef.current.play() / .pause()
//       → playerState.setIsLive(true/false)
//         → all subscribed listeners notified

type Listener = (isLive: boolean) => void;
type ToggleFn = () => void;

let isLive = false;
let toggleCb: ToggleFn | null = null;
const listeners = new Set<Listener>();

const playerState = {
  /** GlobalPlayer calls this on mount; returns cleanup. */
  registerToggle(cb: ToggleFn): () => void {
    toggleCb = cb;
    return () => {
      if (toggleCb === cb) toggleCb = null;
    };
  },

  /** Any component calls this to play/stop. */
  toggle() {
    if (toggleCb) {
      toggleCb();
    } else {
      // Fallback: fire custom event if no callback registered
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("player-toggle"));
      }
    }
  },

  /** Subscribe to isLive: boolean changes. Returns cleanup. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    // Immediately notify with current state
    listener(isLive);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Called by GlobalPlayer when play state changes */
  setIsLive(live: boolean) {
    isLive = live;
    listeners.forEach((fn) => fn(isLive));
  },

  getIsLive() {
    return isLive;
  },
};

export default playerState;
