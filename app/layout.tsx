import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import Footer from "@/components/shared/Footer";
import GlobalPlayer from "@/components/player/GlobalPlayer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://asrielradio.com"),
  title: "Asriel Radio 24/7 — Prophet Samo Mtishiby | Asriel 24/7 Live Always | Digital Sanctuary",
  description:
    "Gospel music, prophetic insights, and spiritual guidance from VPM International. Streaming 24 hours a day, 7 days a week from Nairobi, Kenya.",
  keywords: [
    "Asriel Radio",
    "Asriel Radio 247",
    "Prophet Dr. Samo Mtishiby",
    "VPM International",
    "Gospel Radio Kenya",
    "Nairobi Radio",
    "Digital Sanctuary",
    "Heaven All The Time",
    "Christian Streaming",
  ],
  authors: [{ name: "VPM International" }],
  openGraph: {
    title: "Asriel Radio 24/7 — The Digital Sanctuary",
    description:
      "Gospel music, prophetic insights, and spiritual guidance from VPM International. Streaming live 24/7.",
    type: "website",
    siteName: "Asriel Radio 24/7",
    images: [
      {
        url: "/asrielradio.jpeg",
        width: 800,
        height: 800,
        alt: "Asriel Radio 24/7 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asriel Radio 24/7 — The Digital Sanctuary",
    description: "Streaming gospel music and prophetic ministry 24/7.",
    images: ["/asrielradio.jpeg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body>
        <header className="nav">
          <div className="nav-inner">
            <Link href="/" className="brand">
              <Image
                src="/asrielradio.jpeg"
                alt="Asriel Radio 247 Logo"
                width={42}
                height={42}
                className="brand-logo-img"
                priority
              />
              <div>
                <div className="brand-name">ASRIEL RADIO</div>
                <div className="brand-sub">The Digital Sanctuary</div>
              </div>
            </Link>

            <nav className="links">
              <Link href="#listen">Listen</Link>
              <Link href="#schedule">Schedule</Link>
              <Link href="#tv">Asriel 24/7 Live Always</Link>
              <Link href="#connect">Connect</Link>
            </nav>

            <div className="nav-right">
              <div className="live-pill">
                <span className="live-dot" /> Live Now
              </div>
            </div>
          </div>
        </header>

        {children}

        <Footer settings={settings} />

        {/* The floating play button pill fixed at bottom */}
        <GlobalPlayer streamUrl={settings.stream_url} />
      </body>
    </html>
  );
}
