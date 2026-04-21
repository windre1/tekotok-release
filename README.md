# ViralKit — Updated API Stack 🎬

> **Update:** Replicate → **Fal.ai (FLUX)** | ElevenLabs → **Gemini TTS**
> Sekarang 100% bisa jalan dengan kredit gratis!

---

## 🆕 Yang Berubah

| Sebelumnya | Sekarang | Kenapa |
|---|---|---|
| Replicate (berbayar) | **Fal.ai FLUX** | $10 kredit gratis saat daftar |
| ElevenLabs (limit 10rb karakter) | **Gemini TTS** | Gratis, limit besar, kualitas bagus |

---

## Environment Variables (Vercel)

Tambahkan ini di **Vercel Dashboard → Settings → Environment Variables**:

| Name | Value | Cara Dapat |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase → Settings → API → **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase → Settings → API → **service_role** |
| `FAL_API_KEY` | `fal-xxx...` | fal.ai → Dashboard → API Keys |
| `GEMINI_API_KEY` | `AIzaSy...` | aistudio.google.com/app/apikey |

✅ **Hanya 5 env vars!** Tidak perlu ElevenLabs lagi.

---

## Cara Dapat API Keys

### Fal.ai (untuk generate gambar)
1. Buka **fal.ai** → Sign Up (gratis, dapat $10 kredit)
2. Masuk ke **Dashboard** → klik **API Keys** di sidebar
3. Klik **"Add Key"** → beri nama → copy key
4. Key formatnya: `fal-xxxxxxxxxxxxxxxxxxxxxxxx`

### Gemini (untuk audio TTS)
1. Buka **aistudio.google.com/app/apikey**
2. Login dengan akun Google
3. Klik **"Create API Key"**
4. Key formatnya: `AIzaSyXXXXXXXXXXXXXX`

### Supabase
1. Buka **supabase.com** → pilih project
2. Sidebar → **Settings** → **API**
3. Copy **Project URL**, **anon key**, **service_role key**

---

## Deploy ke Vercel

```bash
# 1. Push ke GitHub
git add .
git commit -m "update: fal.ai + gemini tts"
git push

# 2. Di Vercel dashboard:
# Settings → Environment Variables → tambah 5 vars di atas
# Deployments → Redeploy
```

---

## File yang Diupdate

```
src/app/api/
├── generate-image/route.ts   ← Fal.ai FLUX (ganti Replicate)
└── generate-audio/route.ts   ← Gemini TTS (ganti ElevenLabs)

.env.example                  ← hanya 5 vars, lebih simple
vercel.json                   ← hapus bagian "env" yang error
package.json                  ← hapus replicate & elevenlabs deps
```

---

## Estimasi Biaya

| Layanan | Harga | Kredit Gratis |
|---|---|---|
| **Fal.ai FLUX** | ~$0.003/gambar | $10 = ~3.300 gambar |
| **Gemini TTS** | Gratis | 15 RPM free tier |
| **Supabase** | Gratis | 500MB storage + 2GB bandwidth |
| **Vercel** | Gratis | Hobby plan |

**Total: ~$0 untuk memulai!** 🎉
