"use client";

import { FaYoutube, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa6";

interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  colorClass: string;
}

const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: "YouTube",
    url: "https://youtube.com/@asrieltv?si=g4pykHoylbN_A5-C",
    icon: <FaYoutube size={28} />,
    colorClass: "social-btn-yt",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@asriel_tv01?_r=1&_t=ZS-99WsIEVqngK",
    icon: <FaTiktok size={26} />,
    colorClass: "social-btn-tk",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/vpmintl?stkn=dmhlcGdmamJmaG9l",
    icon: <FaInstagram size={26} />,
    colorClass: "social-btn-ig",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/254116304484",
    icon: <FaWhatsapp size={28} />,
    colorClass: "social-btn-wa",
  },
];

export default function HeroSocialLinks() {
  return (
    <div className="hero-social-icons-wrapper" aria-label="Social Media Channels">
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`hero-social-icon-btn ${item.colorClass}`}
          aria-label={item.name}
          title={item.name}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
