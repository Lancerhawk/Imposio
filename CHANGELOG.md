# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-06-02

### Added

- Initial release of Imposio
- PDF upload via drag & drop and file picker (PDF only)
- Automatic booklet imposition algorithm — pads page count to nearest multiple of 4 and computes correct sheet order
- Imposition preview table showing front/back layout per sheet
- Booklet PDF generation using `pdf-lib` — two source pages embedded side-by-side per landscape output sheet
- Live progress bar during PDF generation
- One-click download of the output `filename-Booklet.pdf`
- Step-by-step duplex printing instructions on the download screen
- Landing page with Hero, Features, and How It Works sections
- 100% client-side — no file uploads, no backend, no watermarks

---

[0.1.0]: https://github.com/your-org/imposio/releases/tag/v0.1.0
