# Statify Bug Fixes — Applied from AUDIT.md

> **Date:** 2026-05-24
> **Source:** [AUDIT.md](./AUDIT.md)
> **Files modified:** `index (16).html`, `sw.js`, `manifest.json`

---

## Syntax Errors Fixed

### SE-1 — Unclosed `<button>` tag (HIGH)
- **File:** `index (16).html`, line 5710
- **Fix:** `</button` → `</button>`

### SE-2 — sw.js broken cache reference (HIGH)
- **File:** `sw.js`, line 4
- **Fix:** `'./Statify_v3.html'` → `'./index (16).html'`

### SE-3 — manifest.json broken start_url (MEDIUM)
- **File:** `manifest.json`, line 5
- **Fix:** `"start_url": "./Statify_v3.html"` → `"start_url": "./"`

### SE-4 — Empty CSS selector block (LOW)
- **File:** `index (16).html`, line 5299
- **Fix:** Added actual CSS: `#np-bar { width: 100% !important; }`

---

## Semantic Errors Fixed

### SM-1 — Hardcoded platform icons
- **File:** `index (16).html`, `renderPlatform()` ~line 8131
- **Fix:** Expanded `icos` map from 5 to 17 entries (Linux, Chromecast, TV, Car Thing, PlayStation, Xbox, Nintendo, Smart Speaker, Web, Desktop App, Partner, Windows Phone). Added case-insensitive dynamic icon fallback using the lookup map.

### SM-2 — Flawed skip detection
- **File:** `index (16).html`, `renderSkipPsychology()` ~line 10661
- **Fix:** Changed skip detection from `ms < 30000` to: use `skipped` field if present; otherwise use `ms < Math.max(10000, track_duration_ms * 0.25)` — skip if < 25% of the track played, with a 10s minimum floor.

### SM-3 — Static artist→decade mapping
- **File:** `index (16).html`, `renderDecade()` ~line 8118
- **Fix:** Expanded `adec` map from ~21 artists to ~220+ artists spanning pop, hip-hop, R&B, rock, electronic, Latin, K-pop, country, indie, jazz, classical, metal, reggae, folk, and alternative genres.

### SM-4 — Hardcoded genre map
- **File:** `index (16).html`, `GENRE_MAP` ~line 8627 and `YT_GENRE_MAP` ~line 8644
- **Fix:** Expanded `GENRE_MAP` from ~80 artists to ~280+ artists including new Jazz, Classical, Metal, Reggae, Folk categories. Expanded `YT_GENRE_MAP` from ~30 creators to ~130+ across new categories: Vlog, Beauty, Health, Music, Film, Aviation, DIY, Lifestyle, Productivity, Finance.

### SM-5 — Inconsistent session gap thresholds
- **File:** `index (16).html`, multiple locations
- **Fix:** Added global `SESSION_GAP_MS = 20 * 60 * 1000` constant. Replaced all hardcoded `20*60*1000`, `30*60*1000` values with references to `SESSION_GAP_MS` in:
  - `renderDeep()` — was 20 min (now `SESSION_GAP_MS`)
  - `renderWorkMode()` — was 30 min (now `SESSION_GAP_MS`)
  - `buildSpiral()` — was 20 min (now `SESSION_GAP_MS`)

### SM-6 — Hardcoded average video length
- **File:** `index (16).html`, `buildWatchTime()` ~line 14588
- **Fix:** Now checks for actual `durationMs`/`duration_ms`/`duration` fields in the data. If >10% of entries have durations, computes a real average. Falls back to 12 min only when no duration data is available.

### SM-7 — "This Month" uses current date instead of data
- **File:** `index (16).html`, `renderWrapped()` ~line 8146
- **Fix:** Now finds `max(ts)` from the `S` array and uses that date for the year/month filter instead of `new Date()`. Works with `ts`, `endTime`, and `watchedAt` fields.

### SM-8 — Theme toggle lock can desync
- **File:** `index (16).html`, `toggleTheme()` ~line 8336
- **Fix:** Guard changed from `if (dashboardOpen) return` to `if (document.body.getAttribute('data-view') === 'dashboard') return`. Added `document.body.setAttribute('data-view', 'dashboard')` when dashboard opens and `document.body.setAttribute('data-view', 'home')` when returning home.

### SM-9 — No html2canvas availability check
- **File:** `index (16).html`, `shareCard()` ~line 9107
- **Fix:** Changed from `alert('html2canvas not loaded')` to `showToast('Image library unavailable — check your connection and try again.')` for graceful degradation without a disruptive alert.

### SM-10 — _dpipStats() S length check
- **File:** `index (16).html`, `_dpipStats()` ~line 15285
- **Fix:** Already had `if (!allData.length || !track) return { ... }` check. No change needed — audit concern was already addressed.

---

## Logical Breaks Fixed

### LB-10 — Spotify Live button visible in YT mode
- **File:** `index (16).html`, line 5573
- **Fix:** Changed button default style from `display:flex` to `display:none`. The `updateSpotifyBtn()` function (already called on page load and theme toggle) shows the button only when Spotify mode is active.

---

## Summary

| Priority | Fixed | Skipped |
|----------|-------|---------|
| **P0**   | SE-1 (unclosed tag), SE-2/SE-3 (PWA refs) | — |
| **P1**   | SM-5 (session gaps), SM-1 (platform icons), SM-2 (skip detection), SM-3 (decade map), SM-4 (genre map), SM-6 (avgMin), SM-7 (wrapped month), SM-8 (theme toggle), SM-9 (shareCard), SM-10 (dpip stats), LB-10 (Spotify button) | LB-1 (single-file split) — intentionally skipped per user request |
| **P2**   | — | Shortcoming 4 (memoization), SE-5 (script alignment) |
| **P3**   | — | Gesture support, Scroll-driven story |
| **P4**   | — | Tauri/Capacitor wrapper |
