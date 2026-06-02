# Changelog

All notable changes to **Imposio** will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

---

## [0.1.0] — 2026-06-02

### Initial Release

First functional version of Imposio — a fully client-side PDF booklet imposition tool.

---

### Added

#### Core Algorithm
- **Booklet imposition algorithm** (`src/lib/booklet.ts`)
  - `padToMultipleOf4()` — automatically pads any page count up to the nearest multiple of 4 by calculating the required blank pages
  - `calculateImpositionOrder()` — generates the correct sheet order using the booklet folding formula (outermost pages paired inward)
  - `computeBookletInfo()` — aggregates original pages, added blank pages, final count, sheet count, and full imposition table
  - `generateImpositionSequence()` — flattens the imposition table into a linear page-slot sequence for PDF generation

#### PDF Processing
- **PDF utilities** (`src/lib/pdf-utils.ts`)
  - `analyzePdf()` — reads a `File` object and extracts page count, file name, and file size using `pdf-lib`
  - `generateBookletPdf()` — creates a new landscape PDF with two source pages embedded side-by-side per output page; preserves images, fonts, vector content, and text; supports progress callbacks
  - `downloadPdf()` — triggers a browser-native file download with a `Blob` URL
  - `getBookletFileName()` — derives output filename (e.g. `Notes.pdf` → `Notes-Booklet.pdf`)
  - `formatFileSize()` — human-readable size formatting (B / KB / MB)

#### UI Components
- **`UploadZone`** — drag-and-drop and file picker with visual drag-active/reject states, PDF-only filter, single-file limit, and inline error messages
- **`PdfInfoCard`** — displays analyzed PDF metadata (file name, page count, size) with a reset button
- **`BookletOptions`** — shows booklet summary stats (original pages, blank pages added, final pages, sheet count) and an imposition order preview table (up to 8 sheets); includes the Generate Booklet PDF button
- **`ProgressBar`** — animated red gradient progress bar used during PDF generation
- **`DownloadCard`** — success state with output file details, 6-step duplex printing guide, and download + reset actions
- **`Hero`** — landing hero section with animated badge, headline, subtitle, and primary CTA
- **`Features`** — 4-card feature grid (Automatic Imposition, Privacy First, Print Ready, No Watermarks)
- **`HowItWorks`** — 4-step numbered guide with connector lines

#### Application Shell
- **`app/page.tsx`** — stateful main page managing the full 6-step workflow: `upload → analyze → options → generating → done → error`
- **`app/layout.tsx`** — root layout with **Inter** font (Google Fonts), full SEO metadata, Open Graph tags
- **`app/globals.css`** — Tailwind v4 import, CSS design tokens, custom selection color, focus ring

#### Design System
- **Color palette:** Red `#c53030` primary, white surfaces, stone neutrals for secondary UI
- **Typography:** Inter (variable font, Google Fonts)
- **Visual language:** rounded-2xl cards, soft shadows, backdrop-blur navbar, animated hover states, gradient progress bar

---

### Technical Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| PDF Engine | pdf-lib | ^1.17.1 |
| File Drag & Drop | react-dropzone | ^15.0.0 |
| Icons | lucide-react | ^1.17.0 |
| Runtime | React | 19.2.4 |

---

### Architecture

- **100% client-side** — no backend, no file uploads, no server storage
- **Static export compatible** — the app prerenders as fully static HTML
- Processing runs in the browser using `pdf-lib` (WebAssembly-free, pure JS)

---

[0.1.0]: https://github.com/your-org/imposio/releases/tag/v0.1.0
