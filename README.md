# RegMap AI

> **Regulatory Intelligence Platform for ESCAP's RDTII 2024**
> Map ASEAN digital trade laws to RDTII indicators — automatically, multilingually, in seconds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-regmap--ai.vercel.app-6366F1?style=for-the-badge&logo=vercel)](https://regmap-ai.vercel.app)
[![Built for ESCAP](https://img.shields.io/badge/Built%20for-ESCAP%20%2F%20UN-009EDB?style=for-the-badge)](https://www.unescap.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-F55036?style=for-the-badge)](https://groq.com)

---

## What is RegMap AI?

ESCAP researchers manually read hundreds of pages of ASEAN legislation — in Thai, Lao, Vietnamese, Bahasa — to locate provisions that map to [RDTII](https://www.unescap.org/resources/digital-trade-integration-indicators) indicators. That process takes weeks.

**RegMap AI does it in seconds.**

Upload any digital trade or data protection law. The platform extracts the text, identifies every relevant provision across RDTII Pillars 6 and 7, cites the exact article, scores confidence, and exports a database-ready JSON/CSV — all verified by a human reviewer before it goes anywhere.

---

## Features

| Feature | Description |
|---|---|
| **PDF & Image Upload** | Upload law PDFs or scanned images in any ASEAN language |
| **Multilingual OCR** | Typhoon OCR handles Thai, Lao, Khmer, and Latin scripts |
| **AI Legal Mapping** | llama-3.3-70b identifies RDTII provisions with article citations |
| **Live Streaming** | See the model reasoning in real time as it reads the law |
| **Human Verification** | Verify or reject each mapping before export |
| **Coverage Heatmap** | RDTII indicator × country matrix across all 9 ASEAN nations |
| **RDTII-2024 Export** | One-click JSON and CSV in ESCAP's official schema |

---

## Pipeline

```
  INPUT
  ┌──────────────┐     ┌──────────────┐
  │  Pre-loaded  │     │  User Upload │
  │  ASEAN Laws  │     │  PDF / Image │
  └──────┬───────┘     └──────┬───────┘
         │                    │
         │         ┌──────────┴──────────┐
         │         │                     │
         │    ┌────▼─────┐         ┌─────▼──────┐
         │    │   PDF    │         │   Image    │
         │    │ pdf-parse│         │ Typhoon OCR│
         │    │(Node.js) │         │  preview   │
         │    └────┬─────┘         └─────┬──────┘
         │         │  raw text           │  raw text
         └─────────┴──────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   smartSlice()     │
                    │ first 16k + last   │
                    │ 16k chars of doc   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Groq Streaming    │
                    │  llama-3.3-70b     │
                    │  max_tokens: 2500  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Stream Parser     │
                    │  • jsonrepair      │
                    │  • object extract  │
                    │  • truncation safe │
                    └─────────┬──────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
        ┌──────▼──────┐               ┌──────▼──────┐
        │  JSON Export│               │  CSV Export │
        │  RDTII-2024 │               │  ESCAP DB   │
        └─────────────┘               └─────────────┘
```

---

## RDTII Indicators Covered

**Pillar 6 — Cross-border Data Flows**
- `6.1` Free flow of data principle
- `6.2` Data localization requirements
- `6.3` Government access to data
- `6.4` Conditional flow regimes (adequacy decisions)
- `6.5` Sector-specific data flow rules
- `6.6` International framework alignment (CBPR, APEC, GDPR)

**Pillar 7 — Domestic Data Protection**
- `7.1` Comprehensive data protection legislation
- `7.2` Independent supervisory authority
- `7.3` Individual rights (access, correction, deletion, portability)
- `7.4` Data breach notification obligations

---

## Countries

🇱🇦 Laos · 🇰🇭 Cambodia · 🇲🇲 Myanmar · 🇹🇭 Thailand · 🇻🇳 Vietnam · 🇮🇩 Indonesia · 🇵🇭 Philippines · 🇸🇬 Singapore · 🇲🇾 Malaysia

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Deployment | Vercel (Edge + Serverless) |
| AI Analysis | Groq — `llama-3.3-70b-versatile` |
| OCR | Typhoon OCR — `typhoon-ocr-preview` |
| PDF Extraction | `pdf-parse` (Node.js serverless) |
| JSON Repair | `jsonrepair` |
| Charts | Recharts (radar + heatmap) |
| Styling | CSS glassmorphism, custom animations |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/E27-25/DEMO-UN.git
cd DEMO-UN
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Groq API — https://console.groq.com
GROQ_KEY=your_groq_api_key
NEXT_PUBLIC_GROQ_KEY=your_groq_api_key

# Typhoon OCR — https://api.opentyphoon.ai
NEXT_PUBLIC_TYPHOON_KEY=your_typhoon_api_key
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/E27-25/DEMO-UN)

Add the three environment variables above in your Vercel project settings, then deploy.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/      # Groq streaming proxy (Edge)
│   │   ├── extract-pdf/  # PDF text extraction (Node.js)
│   │   └── ocr/          # Typhoon OCR proxy (Edge)
│   ├── globals.css
│   └── page.js
├── components/
│   ├── sections/
│   │   ├── Analyze.jsx   # Upload → OCR → AI mapping → verify
│   │   ├── Coverage.jsx  # Heatmap + radar chart
│   │   └── Export.jsx    # JSON / CSV export
│   ├── ui/
│   │   ├── ResultCard.jsx
│   │   └── Toast.jsx
│   ├── App.jsx
│   └── Landing.jsx
└── lib/
    └── data.js           # ASEAN laws, indicators, coverage data
```

---

## Sample PDFs to Try

Any ASEAN data protection law will produce results. Good starting points:

- 🇹🇭 [Thailand PDPA 2019](https://www.mdes.go.th/law/detail/3577-Personal-Data-Protection-Act-B-E--2562--2019-)
- 🇸🇬 Singapore Personal Data Protection Act 2012
- 🇵🇭 Philippines Data Privacy Act 2012 (RA 10173)
- 🇮🇩 Indonesia PDP Law No. 27/2022
- 🇻🇳 Vietnam Decree 13/2023/ND-CP

---

## License

MIT — Built for ESCAP RDTII 2024 Data Collection.
