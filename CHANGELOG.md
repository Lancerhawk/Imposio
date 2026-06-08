# Changelog

All notable changes to **Imposio** will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

---

## [1.0.3] — 2026-06-08

### Added
- **Global Version History**:
  - Added a new `versions.json` data file structured from the CHANGELOG to hold all release notes.
  - Created a `VersionHistory` client component with a persistent floating bottom-right button and an animated, scrollable modal timeline to display past releases.
  - Injected the component into the global `layout.tsx` for app-wide accessibility.

---

## [1.0.2] — 2026-06-07

### Added
- **Interactive Page Selector Modal**:
  - Integrated `pdfjs-dist` to render client-side thumbnail previews of uploaded PDFs.
  - Added a new `PageSelectorModal` component allowing users to visually select or deselect specific pages to include in their booklet.
  - Implemented "Select All" and "Deselect All" bulk actions for rapid filtering.
- **Application Flow Enhancements**:
  - The upload flow now automatically opens the Page Selector after analyzing the PDF.
  - Added a "Using X of Y pages" status banner with an "Edit selection" link in the Booklet Options view.

### Changed
- **PDF Generation Logic**:
  - Upgraded `generateBookletPdf` to accept an optional `selectedPages` filter, safely copying only the user-selected pages into a temporary document before executing the booklet imposition sequence.
- **Webpack Configuration**:
  - Configured Turbopack `resolveAlias` in `next.config.ts` to alias the Node.js `canvas` dependency required by `pdfjs-dist` but unused in the browser.

---

## [0.1.1] — 2026-06-02

### Added
- **Unit Testing Suite** (`src/lib/booklet.test.ts`):
  - Comprehensive unit test coverage using **Vitest** for booklet page calculations, padding logic, imposition calculations, and sequence flattening.
- **GitHub Actions CI Pipeline** (`.github/workflows/ci.yml`):
  - Automated continuous integration runner to execute lint checks, TypeScript type-checks, and Vitest unit tests automatically on push and pull requests to `main`.

### Changed
- **Professional Loading States**:
  - Replaced basic analysis text loader with a sophisticated, dual-ring pulsing branded loader for the PDF upload parsing step.
  - Upgraded the booklet generation screen with dynamic stage-by-stage status indicators (`Loading source`, `Imposing pages`, `Saving PDF`).
  - Added a file preparation state ("Preparing Download...") with a loading spinner to the booklet download button to prevent double-clicks and provide visual feedback.
- **Global Pointer Cursor**:
  - Added global stylesheet rules in `src/app/globals.css` ensuring all interactive buttons and anchor tags display the `pointer` cursor on hover, and `not-allowed` when disabled.
- **Linter Command Update**:
  - Replaced `next lint` with direct `eslint .` execution to support ESLint flat configurations on Next.js 16 projects correctly.

### Fixed
- **Spine Gutter (Fold Margin)**:
  - Integrated custom margin space between pages on imposed sheets to ensure the text isn't lost in the fold.

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

[1.0.3]: https://github.com/Lancerhawk/Imposio/releases/tag/v1.0.3
[1.0.2]: https://github.com/Lancerhawk/Imposio/releases/tag/v1.0.2
[0.1.1]: https://github.com/Lancerhawk/Imposio/releases/tag/v0.1.1
[0.1.0]: https://github.com/Lancerhawk/Imposio/releases/tag/v0.1.0
