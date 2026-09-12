"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--card)",
          borderRadius: "var(--radius-m)",
          border: "1px solid var(--paper-line)",
          padding: "36px",
          boxShadow: "0 16px 40px rgba(20, 22, 26, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Image
            src="/asrielradio.jpeg"
            alt="Asriel Radio Logo"
            width={64}
            height={64}
            style={{
              borderRadius: "50%",
              margin: "0 auto 16px",
              border: "2px solid var(--gold)",
            }}
          />
          <h2 style={{ fontSize: "28px", color: "var(--ink)", textTransform: "uppercase" }}>
            Admin Sanctuary
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "14px", marginTop: "4px" }}>
            Sign in to manage broadcast schedule &amp; settings
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#FFF2F2",
              border: "1px solid #FFC9C9",
              color: "#D32F2F",
              padding: "12px 14px",
              borderRadius: "var(--radius-s)",
              fontSize: "13.5px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-ui)",
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@asrielradio.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-s)",
                border: "1px solid var(--paper-line)",
                background: "var(--paper)",
                color: "var(--ink)",
                fontSize: "14.5px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-ui)",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-s)",
                border: "1px solid var(--paper-line)",
                background: "var(--paper)",
                color: "var(--ink)",
                fontSize: "14.5px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              justifyContent: "center",
              marginTop: "8px",
              padding: "14px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Authenticating..." : "Enter Sanctuary &rarr;"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            href="/"
            style={{
              color: "var(--ink-soft)",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            &larr; Return to Live Stream
          </Link>
        </div>
      </div>
    </div>
  );
}
