# JAMOO — Context untuk Claude Code

## Siapa kamu

Kamu membantu **Ikhsan**, backend developer di tim JAMOO untuk kompetisi **CAIEC (China ASEAN International Economic Competition)**.

---

## Tentang JAMOO

JAMOO adalah **AI-powered wellness beverage brand** yang memodernisasi jamu tradisional Indonesia. Produk utamanya adalah **vending machine berbasis web** yang menggunakan AI untuk merekomendasikan minuman herbal berdasarkan mood, kondisi kesehatan, atau ekspresi wajah user.

- Tagline: _"Where Heritage Meets Innovation"_ / _"Smart Jamu for Modern Life"_
- Target: Gen Z & young professionals 18-35 tahun di Jakarta
- Menu: 6 menu regular (3 signature + 3 classic) + 6 secret menu (face scan)

---

## Tugas Ikhsan (scope pekerjaan ini)

### 1. Backend — Next.js API Routes

| File                                  | Deskripsi                                                      |
| ------------------------------------- | -------------------------------------------------------------- |
| `src/app/api/sessions/route.ts`       | POST buat session, PATCH update status                         |
| `src/app/api/face-recommend/route.ts` | POST terima emotion → LLM pilih persona → return narasi recipe |
| `src/app/api/orders/route.ts`         | POST buat order, GET order by session_id                       |

### 2. face-api.js Hook

| File                            | Deskripsi                                      |
| ------------------------------- | ---------------------------------------------- |
| `src/hooks/useFaceDetection.ts` | Reusable hook untuk tim frontend (Zahra/Aliya) |

### Yang BUKAN tugasnya

- Halaman frontend (dikerjakan Zahra + Aliya)
- Flow manual order dan questionnaire (dikerjakan Azka)
- UI/UX design

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **LLM**: Gemini 1.5 Flash (primary) atau Groq Llama 3.3 70B (fallback)
- **Emotion Detection**: face-api.js (client-side only, tidak ada gambar ke server)
- **Hosting**: Vercel

---

## Arsitektur Sistem

### Flow "Make Your Own Jamoo" (tugas Ikhsan)

```
face-api.js detect emotion (BROWSER — tidak ada gambar ke server)
  ↓
dominant_emotion + confidence_score dikirim ke POST /api/face-recommend
  ↓
Backend query SEMUA secret persona dari Supabase
  ↓
Inject semua persona ke LLM (LLM yang pilih, bukan rule-based)
  ↓
LLM return JSON: persona, recipe_name, ingredients, benefits, narasi
  ↓
Simpan ke face_scan_sessions + update sessions
  ↓
Return recipe ke frontend
```

### Kenapa LLM yang pilih persona (bukan mapping table)

Sebelumnya ada `EMOTION_TO_PERSONA` mapping table tapi dihapus karena:

- LLM bisa reasoning lebih dalam (misal: confidence rendah = pilih persona lebih netral)
- Lebih "AI" — bukan sekedar if/else
- LLM dikasih semua 6 persona sekaligus, dia yang decide

### Kenapa tidak pakai RAG

Menu JAMOO cuma 12 item — context stuffing jauh lebih efisien. RAG worth it kalau
data ratusan item. Untuk 12 menu, inject langsung ke prompt sudah optimal.

---

## Database Schema (Supabase)

### Tabel yang relevan untuk Ikhsan:

**`menus`** — master data menu

```
id, name, category ('signature'|'classic'|'secret'), price,
benefits text[], mood_tags text[], is_active, is_secret,
stock_qty, secret_persona_name, secret_base_ingredients,
secret_base_benefits, health_badge
```

**`sessions`** — satu sesi per interaksi user

```
id, order_source ('manual'|'questions'|'face'),
detected_mood, questionnaire jsonb, ai_response jsonb,
status ('active'|'completed'|'abandoned'), created_at, completed_at
```

**`orders`** — transaksi pembelian

```
id, session_id (FK), menu_id (FK),
sweetness_level ('normal'|'less'|'no_sugar'),
unit_price, status ('pending'|'processing'|'done'|'cancelled'),
qr_code, created_at
```

**`face_scan_sessions`** — hasil deteksi ekspresi (compliance UU PDP)

```
id, session_id (FK), dominant_emotion, mapped_mood,
confidence_score, consent_given, image_deleted_at, created_at
```

> ⚠️ `image_deleted_at` diisi otomatis saat insert — ini bukti compliance bahwa
> gambar tidak pernah disimpan, sesuai UU Pelindungan Data Pribadi Indonesia.

---

## Lib Files

| File                   | Fungsi                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `src/lib/supabase.ts`  | Supabase client                                                   |
| `src/lib/llm.ts`       | Unified LLM client — support Gemini & Groq via `LLM_PROVIDER` env |
| `src/lib/constants.ts` | `JAMOO_SYSTEM_PROMPT`, `SWEETNESS_OPTIONS`, `MOOD_OPTIONS`, dll   |
| `src/lib/types.ts`     | Semua TypeScript types sesuai schema DB                           |

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=          # opsional
LLM_PROVIDER=gemini    # 'gemini' atau 'groq'
```

---

## Konvensi Kode

- Semua API route pakai `try/catch` dan log error dengan prefix `[route name]`
- Response error selalu include `{ error: string }` dengan status code yang tepat
- Supabase query selalu check error sebelum pakai data
- face-api.js hanya di-import di client side (`'use client'` + dynamic import)
- Komentar penting pakai `── Section ──` style

---

## PRD Highlights (yang relevan)

- **Target release**: 9 Mei 2026
- **Out of scope**: Payment gateway, IoT hardware, authentication, simpan data wajah ke server
- **KPI utama**: 100% user berhasil sampai Order Summary tanpa crash
- **Acceptance criteria face scan**: hasil keluar < 15 detik, setiap sesi generate fresh

---

## Catatan Penting

1. **face-api.js TIDAK boleh jalan di server** — hanya browser. `next.config.js` sudah
   dikonfigurasi dengan `externals` untuk ini.
2. **Tidak ada authentication** — semua endpoint bisa diakses anon (sesuai PRD)
3. **LLM key belum ada** — saat testing, `/api/face-recommend` akan error di step LLM.
   Untuk test face-api.js saja, cukup test sampai `scanEmotion()` return hasil.
4. Model face-api.js ada di `public/models/` — download dulu dengan `bash download-models.sh`
