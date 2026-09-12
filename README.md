# asrielradio

**Asriel Radio 24/7 — The Digital Sanctuary**

Streaming uninterrupted gospel music, prophetic ministry, and spiritual teachings worldwide 24 hours a day, 7 days a week from Nairobi, Kenya. Under the spiritual leadership of Prophet Dr. Samo Mtishiby (VPM International).

---

## 🎧 Features

- **Live 24/7 Audio Streaming**: Seamless connection to the live ZenoFM stream.
- **Floating Audio Player**: Persistent, non-intrusive floating play pill with real-time status and TV/AirPlay casting capabilities.
- **Now Playing Metadata**: Real-time SSE updates for current songs and ministering hosts.
- **Dynamic Program Schedule**: Weekly schedules grouped by weekdays and weekends, tracking the live on-air show and progress.
- **Social Media Hub**: Instant direct links to official YouTube, TikTok, Instagram, and WhatsApp channels.
- **Asriel 24/7 Live Always**: Dedicated video broadcast section linking to the official YouTube channel.
- **Admin Dashboard**: Secure management interface powered by Supabase for broadcast scheduling and station settings.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Design System with Apple SF Pro native aesthetics
- **Database & Auth**: Supabase (PostgreSQL + Auth SSR)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/dilzde/asrielradio.git
cd asrielradio
npm install
```

### 2. Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add the Supabase environment variables in **Vercel Settings → Environment Variables**.
4. Deploy!
