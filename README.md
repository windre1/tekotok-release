# ViralKit 🎬

AI-powered SaaS untuk generate konten video viral — A/B image pairs + voiceover otomatis.

Built with: **Next.js 14** · **Supabase** · **Replicate** · **ElevenLabs** · **Vercel**

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/kamu/viralkit.git
cd viralkit
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Isi semua value di `.env.local`:

| Variable | Cara Dapat |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard Supabase → Settings → API |
| `REPLICATE_API_TOKEN` | https://replicate.com/account/api-tokens |
| `ELEVENLABS_API_KEY` | https://elevenlabs.io/app/settings/api-keys |
| `ELEVENLABS_VOICE_ID_FEMALE` | https://api.elevenlabs.io/v1/voices |
| `ELEVENLABS_VOICE_ID_MALE` | https://api.elevenlabs.io/v1/voices |

### 3. Setup Supabase Database

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Buka **SQL Editor**
4. Copy-paste isi file `supabase/schema.sql` → Run

### 4. Jalankan Lokal

```bash
npm run dev
```

Buka http://localhost:3000

---

## 🏗️ Struktur Project

```
viralkit/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── register/page.tsx     # Register page
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard utama
│   │   │   ├── layout.tsx            # Layout dengan nav
│   │   │   ├── [id]/page.tsx         # Project studio
│   │   │   ├── new/page.tsx          # Buat project baru
│   │   │   └── library/page.tsx      # Library semua project
│   │   ├── api/
│   │   │   ├── generate-image/       # Replicate SDXL API
│   │   │   ├── generate-audio/       # ElevenLabs TTS API
│   │   │   ├── panels/               # Panel CRUD
│   │   │   └── projects/             # Project CRUD
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx            # Header dengan credits
│   │   │   └── BottomNav.tsx         # Mobile bottom navigation
│   │   ├── panels/
│   │   │   ├── ProjectStudio.tsx     # Main studio component
│   │   │   ├── PanelCard.tsx         # A/B image panel
│   │   │   ├── ProjectCard.tsx       # Project list card
│   │   │   └── NewProjectButton.tsx  # CTA button
│   │   └── audio/
│   │       └── AudioSection.tsx      # Global audio player/generator
│   ├── lib/
│   │   ├── supabase.ts               # Client-side Supabase
│   │   ├── supabase-server.ts        # Server-side Supabase
│   │   └── utils.ts                  # Helper functions
│   ├── types/
│   │   └── database.ts               # TypeScript types
│   └── middleware.ts                 # Auth middleware
├── supabase/
│   └── schema.sql                    # Database schema + RLS
├── public/
│   └── manifest.json                 # PWA manifest
├── .env.example                      # Template env vars
├── vercel.json                       # Vercel config
└── README.md
```

---

## 🔌 AI Integrations

### Replicate (Image Generation)
Model: `stability-ai/sdxl` — generates cinematic diorama images  
Cost: ~$0.003 per image  
Prompt auto-enhanced dengan: diorama miniature, tilt-shift, cinematic lighting

### ElevenLabs (Audio TTS)
Model: `eleven_multilingual_v2` — supports Bahasa Indonesia  
Cost: ~$0.30 per 1000 characters  
Supports: Female & Male voice selection

---

## 🚢 Deploy ke Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub Integration

1. Push ke GitHub
2. Import repo di https://vercel.com/new
3. Set environment variables di Vercel dashboard
4. Deploy!

### Set Environment Variables di Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add REPLICATE_API_TOKEN
vercel env add ELEVENLABS_API_KEY
vercel env add ELEVENLABS_VOICE_ID_FEMALE
vercel env add ELEVENLABS_VOICE_ID_MALE
```

---

## 💰 Credit System

| Aksi | Kredit |
|---|---|
| Generate image (1 panel 1 sisi) | 1 kredit |
| Generate audio | 2 kredit |
| Registrasi | 10 kredit gratis |

---

## 📱 Fitur

- ✅ Auth (Login/Register) dengan Supabase
- ✅ Dashboard project management
- ✅ A/B image panel (Setup vs Klimaks)
- ✅ AI image generation (Replicate SDXL)
- ✅ AI voiceover (ElevenLabs TTS)
- ✅ Female/Male voice toggle
- ✅ Download image & audio
- ✅ Copy prompt per panel
- ✅ Credit system
- ✅ Mobile-first responsive UI
- ✅ PWA ready
- ✅ Row Level Security (Supabase RLS)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Auth**: Supabase Auth
- **Database**: Supabase PostgreSQL + RLS
- **Storage**: Supabase Storage
- **AI Image**: Replicate (SDXL)
- **AI Audio**: ElevenLabs
- **Deploy**: Vercel

---

## 📞 Support

Ada pertanyaan? Buka issue di GitHub atau hubungi tim kami.
