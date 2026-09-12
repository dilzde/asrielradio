"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Broadcast Schedule", href: "/admin/schedule" },
    { name: "Station Settings", href: "/admin/settings" },
  ];

  return (
    <aside
      style={{
        width: "260px",
        background: "#1C1208",
        color: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        minHeight: "100vh",
        borderRight: "1px solid rgba(212, 134, 10, 0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px", paddingLeft: "8px" }}>
        <Image
          src="/asrielradio.jpeg"
          alt="Asriel Radio Logo"
          width={36}
          height={36}
          style={{ borderRadius: "50%", border: "2px solid #D4860A" }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "0.04em", color: "#F5F0E8" }}>
            ASRIEL ADMIN
          </div>
          <div style={{ fontSize: "11px", color: "rgba(245, 240, 232, 0.6)", textTransform: "uppercase" }}>
            Station Control
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                background: isActive ? "#D4860A" : "transparent",
                color: isActive ? "#1C1208" : "#A0A0A0",
                transition: "all 0.15s ease",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            fontSize: "13px",
            color: "rgba(245, 240, 232, 0.7)",
            padding: "8px 14px",
            display: "block",
            borderRadius: "6px",
          }}
        >
          &rarr; View Public Station
        </Link>

        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "rgba(255, 60, 60, 0.15)",
              color: "#FF8080",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
