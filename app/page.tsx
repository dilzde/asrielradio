import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/public";
import { getSettings } from "@/lib/settings";
import { YOUTUBE_CHANNEL, WA_NUMBER, STREAM_URL } from "@/lib/constants";
import LiveHeroStatus from "@/components/schedule/LiveHeroStatus";
import HeroPlayButton from "@/components/player/HeroPlayButton";
import NowPlaying from "@/components/player/NowPlaying";
import HeroSocialLinks from "@/components/shared/HeroSocialLinks";
import ScheduleView from "@/components/shared/ScheduleView";
import WhatsAppInvite from "@/components/shared/WhatsAppInvite";
import { FaYoutube } from "react-icons/fa6";
import type { Program } from "@/lib/actions/programs";

export const revalidate = 60; // 1-minute ISR

export default async function HomePage() {
  let programs: Program[] = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (data) {
      programs = data as Program[];
    }
  } catch (error) {
    console.warn("Could not load programs from Supabase, using defaults:", error);
  }

  const settings = await getSettings();
  const youtubeUrl = settings.youtube_url || YOUTUBE_CHANNEL;
  const waNumber = settings.wa_number || WA_NUMBER;
  const vpmLinksUrl = "https://vpm-website.vercel.app/links";

  return (
    <main>
      {/* Visually hidden <h1> for SEO */}
      <h1 className="sr-only">
        Asriel Radio 24/7 — The Digital Sanctuary | Prophet Dr. Samo Mtishiby | VPM International
      </h1>

      {/* ── HERO SECTION ── */}
      <section className="hero" id="listen">
        <div className="hero-grid">
          <div>
            <LiveHeroStatus
              todaysPrograms={programs}
              fallbackTitle="News & Partnership Impact"
            />

            <p className="desc">
              Join the Station Playlist for an uninterrupted spiritual experience —
              gospel music, sermons, and community conversation, streaming live from
              the sanctuary right now.
            </p>

            <div className="hero-cta">
              <HeroPlayButton />
              <Link href="#connect" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right column of hero with Now Playing + Horizontal Social Media Links */}
          <div className="hero-right-col">
            <NowPlaying
              initialTitle="Asriel Radio 24/7"
              initialHost="The Digital Sanctuary"
            />

            {/* Horizontal Social Media Links below Now Playing */}
            <HeroSocialLinks />
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="features">
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 12h4l3 8 4-16 3 8h4" />
              </svg>
            </div>
            <div>
              <h4>Live streaming, 24/7</h4>
              <p>Uninterrupted gospel music and sermons around the clock.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
              </svg>
            </div>
            <div>
              <h4>Authentic connection</h4>
              <p>A community-driven worship experience for believers everywhere.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" />
                <path d="M19 11a7 7 0 01-14 0M12 19v3" />
              </svg>
            </div>
            <div>
              <h4>Guest ministry slots</h4>
              <p>Share your voice with our congregation, live on air.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID (SCHEDULE + TV + SIDEBAR) ── */}
      <section className="section" id="schedule">
        <div className="content-grid">
          {/* Main Column */}
          <div>
            <div className="section-head">
              <div className="eyebrow">
                <span className="bar" /> On air
              </div>
              <h2>Broadcast Schedule</h2>
              <p>Divine rhythms of the week (East Africa Time / UTC+3)</p>
            </div>

            <ScheduleView initialPrograms={programs} />

            {/* Asriel 24/7 Live Always Section */}
            <div className="tv-block lively-tv" id="tv">
              <div className="tv-youtube-badge" title="Watch on YouTube">
                <svg viewBox="0 0 68 48" width="46" height="32" aria-hidden="true">
                  <path
                    d="M66.52 7.74c-.78-2.93-3.09-5.24-6.02-6.02C55.22 0 34 0 34 0S12.78 0 7.5 1.72c-2.93.78-5.24 3.09-6.02 6.02C0 13.02 0 24 0 24s0 10.98 1.48 16.26c.78 2.93 3.09 5.24 6.02 6.02C12.78 48 34 48 34 48s21.22 0 26.5-1.72c2.93-.78 5.24-3.09 6.02-6.02C68 34.98 68 24 68 24s0-10.98-1.48-16.26z"
                    fill="#CC0000"
                  />
                  <path d="M45 24L27 14v20z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="tv-content">
                <div className="tv-badge-pill">
                  <span className="live-dot red-dot" /> STREAMING 24/7 ON YOUTUBE
                </div>
                <h3>Asriel 24/7 Live Always</h3>
                <p>
                  Experience powerful live sermons, prophetic insights, and spiritual teachings with{" "}
                  <strong>Prophet Dr. Samo Mtishiby</strong>. Subscribe and join believers around the globe.
                </p>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-youtube-live"
                >
                  <FaYoutube size={19} />
                  <span>Watch on YouTube</span>
                  <span className="yt-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="sidebar-wrapper">
            {/* QR Code Card: Connect With Us, click or scan, links to https://vpm-website.vercel.app/links */}
            <div className="scan-card" style={{ marginBottom: "24px" }}>
              <div className="now-card-top">
                <span className="now-label">CONNECT WITH US</span>
                <div className="live-pill" style={{ padding: "4px 10px", fontSize: "11px" }}>
                  <span className="live-dot" /> Scan &amp; Follow
                </div>
              </div>

              <div className="scan-body">
                {/* Clickable QR Code with ample space for scanning */}
                <a
                  href={vpmLinksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="scan-qr-link"
                  title="Click to open our social media links page"
                >
                  <Image
                    src="/qr.png"
                    alt="Scan or Click to Connect with Asriel Radio Socials"
                    width={180}
                    height={180}
                    className="scan-qr"
                    priority
                  />
                </a>

                <div className="scan-text-content">
                  <h3>Scan or Click</h3>
                  <p className="scan-instructions">
                    Access our official YouTube, TikTok, Instagram, and WhatsApp channels in one tap.
                  </p>
                  <a
                    href={vpmLinksUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-qr-link"
                  >
                    Open Social Links &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className="explore-card">
              <h5>EXPLORE</h5>
              <a
                href={STREAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="explore-item"
              >
                <span className="dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Listen on ZenoFM <span className="arrow">&rsaquo;</span>
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="explore-item"
              >
                <span className="dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="4" width="20" height="14" rx="2" />
                  </svg>
                </span>
                Asriel 24/7 Live Always <span className="arrow">&rsaquo;</span>
              </a>

              <Link href="#schedule" className="explore-item">
                <span className="dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M3 9h18M8 3v3M16 3v3" />
                  </svg>
                </span>
                Full Schedule <span className="arrow">&rsaquo;</span>
              </Link>

              <Link href="#connect" className="explore-item">
                <span className="dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" />
                    <path d="M19 11a7 7 0 01-14 0M12 19v3" />
                  </svg>
                </span>
                Submit Your Ministry <span className="arrow">&rsaquo;</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── MINISTRY CTA SECTION ── */}
      <section className="ministry" id="connect">
        <div className="ministry-inner">
          <div>
            <h2>
              Share your <span>ministry</span>
            </h2>
            <p>
              Calling all artists and ministers — we want to amplify your voice in our sanctuary. Connect with us to book a guest slot on air.
            </p>
          </div>
          <WhatsAppInvite
            number={waNumber}
            label="Message us on WhatsApp"
            className="btn-whatsapp"
          />
        </div>
      </section>
    </main>
  );
}
