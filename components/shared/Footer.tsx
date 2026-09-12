import Link from "next/link";
import {
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { VPM_URL } from "@/lib/constants";

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings = {} }: FooterProps) {
  const socialItems = [
    {
      name: "YouTube",
      url: settings.youtube_url || "https://youtube.com/@asrieltv?si=g4pykHoylbN_A5-C",
      icon: <FaYoutube size={19} />,
      colorClass: "footer-icon-yt",
    },
    {
      name: "TikTok",
      url: settings.tiktok_url || "https://www.tiktok.com/@asriel_tv01?_r=1&_t=ZS-99WsIEVqngK",
      icon: <FaTiktok size={17} />,
      colorClass: "footer-icon-tk",
    },
    {
      name: "Instagram",
      url: settings.instagram_url || "https://www.instagram.com/vpmintl?stkn=dmhlcGdmamJmaG9l",
      icon: <FaInstagram size={18} />,
      colorClass: "footer-icon-ig",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/${settings.wa_number || "254794731831"}`,
      icon: <FaWhatsapp size={19} />,
      colorClass: "footer-icon-wa",
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h4>Asriel Radio 24/7</h4>
          <p>
            The Digital Sanctuary — streaming uninterrupted gospel music, prophetic insights,
            and spiritual teachings worldwide, 24 hours a day, 7 days a week.
          </p>
          <div className="social-row">
            {socialItems.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`footer-social-btn ${item.colorClass}`}
                aria-label={item.name}
                title={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h5>NAVIGATION</h5>
          <Link href="#listen">Listen Live</Link>
          <Link href="#schedule">Broadcast Schedule</Link>
          <Link href="#tv">Asriel 24/7 Live Always</Link>
          <Link href="#connect">Contact Sanctuary</Link>
          <Link href="/login">Admin Access</Link>
        </div>

        <div className="footer-col">
          <h5>PARTNER MINISTRY</h5>
          <p>
            VPM International (Voice of The Potter&apos;s Messengers) — under the spiritual
            leadership of Prophet Dr. Samo Mtishiby.
          </p>
          <a
            href={VPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ext"
          >
            vpminternational.com &rarr;
          </a>
        </div>

        <div className="footer-col">
          <h5>BROADCAST HOURS</h5>
          <p>Broadcasting Live 24/7 from Nairobi, Kenya (UTC+3).</p>
          <p className="footer-tagline">Heaven All The Time</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Asriel Radio 24/7. All rights reserved.</span>
        <span>Voice of The Potter&apos;s Messengers (VPM International)</span>
      </div>
    </footer>
  );
}
