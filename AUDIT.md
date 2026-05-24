# Statify Code Audit

> Comprehensive audit of the Statify project — syntax errors, semantic errors, logical breaks, shortcomings, future scope, and interactive additions.
> **Date:** 2026-05-22

---

## Table of Contents

1. [Syntax Errors](#1-syntax-errors)
2. [Semantic Errors](#2-semantic-errors)
3. [Logical Breaks](#3-logical-breaks)
4. [Shortcomings](#4-shortcomings)
5. [Future Scope](#5-future-scope)
6. [Interactive Additions](#6-interactive-additions)
7. [Priority Matrix](#7-priority-matrix)

---

## 1. Syntax Errors

| ID | Location | Issue | Severity | Solution |
|----|----------|-------|----------|----------|
| **SE-1** | `index (16).html` ~line 5710 | **Unclosed HTML tag** — `<button ...>FOLLOWING</button` is missing the final `>`. This will break DOM parsing in some browsers. | 🔴 High | Add the missing `>`: `</button>` |
| **SE-2** | `sw.js` line 4 | **Broken cache reference** — `URLS` array includes `'./Statify_v3.html'` but the actual file is `index (16).html`. Cache will fail to populate. | 🔴 High | Update `sw.js` line 4: change `'./Statify_v3.html'` to `'./index (16).html'` (or rename the file to `index.html` and use `'./'`). |
| **SE-3** | `manifest.json` line 5 | **Broken start_url** — `"start_url": "./Statify_v3.html"` points to a non-existent file. | 🟡 Medium | Update `manifest.json` line 5: `"start_url": "./"` instead of `"./Statify_v3.html"`. |
| **SE-4** | CSS ~line 5300 | **Empty selector block** — `/* FIX 13 */` comment exists but the rule has no body. | 🟢 Low | Remove the empty block, or add a real rule: `#np-bar { width: 100% !important; }`. |
| **SE-5** | `index (16).html` ~line 14543 | **Stray closing tag review** — multiple `<script>` blocks in one file make open/close alignment hard to verify. | 🟢 Low | Ensure `<script>` open/close pairs are visually aligned. Use an HTML formatter. |

---

## 2. Semantic Errors

Logic that runs but produces wrong or misleading behavior.

| ID | Location | Issue | Impact | Solution |
|----|----------|-------|--------|----------|
| **SM-1** | `renderPlatform()` ~line 8126 | **Hardcoded platform icons** — Only recognizes `iOS`, `Android`, `Windows`, `Web Player`, `macOS`. Everything else shows as `❓ Unknown`. | Wrong UX for many users | Build a reverse lookup map from actual `platform` values seen in the data, falling back to `❓` only for truly unknown strings. |
| **SM-2** | `renderSkipPsychology()` ~line 10656 | **Flawed skip proxy** — `ms < 30000` assumes all tracks are ~3–4 min. Podcasts, long mixes, or classical pieces get falsely flagged as "skipped." | Incorrect skip rate | Make skip detection configurable: if `skipped` field exists use it; otherwise use `ms_played < (track_duration_ms * 0.25)` (skip if <25% played), with a min floor of 10s for very short tracks. |
| **SM-3** | `renderDecade()` ~line 8113 | **Static artist→decade mapping** — Only ~20 artists are mapped. Everyone else defaults to `2010s`, making the chart meaningless for most users. | Meaningless data visualization | Replace hardcoded map with a fuzzy match against a small local artist→decade DB (e.g., 500 entries), or derive decade from the *year of first stream* as a proxy. Show a disclaimer that it's inferred. |
| **SM-4** | `renderGenre()` ~line 8648 | **Genre inference relies on artist names** — Uses a hardcoded `GENRE_MAP` of ~100 pop/rock artists. If user listens to jazz, classical, or indie artists not on the list, they all show as "Other." | Incomplete genre breakdown | Use a larger static genre map (1,000+ artists), or integrate an offline artist→genre lookup table (can be a separate JSON loaded on demand). |
| **SM-5** | Session detection (multiple locations) | **Inconsistent gap thresholds** — `renderDeep()` uses 20 minutes, `renderCommuteDetector()` uses 30 minutes, `buildSpiral()` uses 20 minutes. A "session" isn't defined consistently. | Conflicting metrics | Define a single `SESSION_GAP_MS = 20 * 60 * 1000` constant at the top of the script and import/reference it everywhere. |
| **SM-6** | `buildWatchTime()` ~line 14574 | **Hardcoded average video length** — `const avgMin = 12;` hardcoded. No actual duration data is used. | Wildly inaccurate time estimates | If video duration isn't in the data, estimate per video using a lookup table of common lengths by channel type, or let the user manually input an average. Better: skip the stat if no duration data exists rather than lying. |
| **SM-7** | `renderWrapped()` ~line 8146 | **Month mode uses current month** — `const ym = now.toISOString().slice(0, 7)` gets *today's* month/year, not the month from the data. If user uploads 2022 data, "This Month" still means May 2026. | Completely wrong for historical data | Change "This Month" to "Latest Month in Data" — find `max(ts)` from `S` and use that month, not `new Date()`. |
| **SM-8** | `toggleTheme()` ~line 8336 | **Theme toggle lock can desync** — Guard checks `if (dashboardOpen) return;` but `dashboardOpen` is a global boolean that might be out of sync if an error occurs mid-render. | Toggle can get stuck | Use a data attribute on `<body>` (e.g., `data-view="home"|"dashboard"`) instead of a JS boolean. The toggle reads the attribute directly. |
| **SM-9** | `shareCard()` ~line 9107 | **No html2canvas availability check** — If CDN fails, `shareCard` throws a raw error instead of graceful degradation. | Crash on poor connectivity | Wrap `shareCard()` in a guard: `if (!window.html2canvas) { showToast('Image library unavailable — check connection'); return; }`. |
| **SM-10** | `_dpipStats()` ~line 15285 | **References `S` directly without length check** — If `S` is defined but not yet populated, it returns empty stats without warning. | Silent data failure | Check `S.length` explicitly and show a loading skeleton instead of empty stats if data is still being parsed. |

---

## 3. Logical Breaks

Architecture & design flaws.

| ID | Issue | Explanation | Solution |
|----|-------|-------------|----------|
| **LB-1** | **15,624-line single file** | The entire app — HTML, CSS, 10 phases of JS, PiP logic, SW registration — lives in one file. Any edit risks breaking unrelated features. | Split into a proper project structure: `index.html`, `css/main.css`, `js/core.js`, `js/phases/p2.js`, `js/phases/p3.js`, etc. Use a build tool (Vite) to bundle back to a single file for deployment if needed. |
| **LB-2** | **Function monkey-patching across phases** | Phases 2, 8, and 10 each wrap `render()` in an IIFE. Order matters, debugging is a nightmare, and race conditions are likely. | Replace monkey-patching with a proper event system: `const renderHooks = []; renderHooks.push(initPhase2);` — then `render()` loops through hooks. Each phase registers itself once. |
| **LB-3** | **Global namespace pollution** | `S`, `tkMap`, `isYT`, `dashboardOpen`, `SP`, `DPIP`, `window._p2Initialized`, etc. all live on `window`. Name collisions are inevitable as phases grow. | Move everything into a single `const Statify = {}` namespace (or ES modules with `import/export`). No more globals. |
| **LB-4** | **Chart.js instance leaks** | Some phases destroy old charts, but others (e.g., Phase 10's spiral chart) may leak canvas contexts when re-rendered. | Create a `destroyChart(id)` helper that nulls the reference and calls `.destroy()`. Call it at the start of every render function that uses charts. |
| **LB-5** | **No data validation layer** | Uploaded JSON/CSV is parsed with `JSON.parse()` and regex directly. Malformed input can crash the entire dashboard with no recovery path. | Add a `validateData(obj)` function that checks for required fields (`ts`, `artist`, `track`) and returns a `{valid, errors}` object. Show a toast if validation fails. |
| **LB-6** | **PWA is fundamentally broken** | External `sw.js` caches a non-existent file. Inline SW blob is better but still tries to cache CDNs that may have CORS issues. Manifest icon is a data URI some browsers reject. | Fix `sw.js` to cache only the app shell and use network-first for everything else. Remove the external `sw.js` and use the inline blob exclusively. Fix the manifest icon to use a real `.png` file or a properly encoded SVG without `<` characters. |
| **LB-7** | **Accessibility is absent** | No `aria-label`s, heatmap is grid of `<div>`s with no keyboard navigation, modal lacks `role="dialog"` or focus trapping. | Add `aria-label`, `role="dialog"`, `tabindex="-1"`, and trap focus inside modals. Make heatmap cells `<button>` elements for keyboard navigation. |
| **LB-8** | **Mobile hamburger menu exists in CSS but not HTML** | `.ham-btn` and `.hdr-collapse` styles are fully written, but the HTML never renders a hamburger button or collapse container. | Add the actual HTML elements for the hamburger menu in the `<header>`, controlled by a simple `onclick="toggleHeaderCollapse()"` toggle class. |
| **LB-9** | **Export/Import mismatch** | `exportStatifyJSON()` exports a custom schema, but `importStatifyJSON()` expects the same schema with zero versioning. Old imports may silently fail or corrupt `S`. | Add a `version` field to exported JSON. On import, check `version`; if mismatch, run a migration function before loading into `S`. |
| **LB-10** | **Spotify Live button visible in YT mode** | HTML has `<button id="spotifyConnectBtn" ... style="display:flex">`. JS patches this after page load, but on slow networks there's a visible Spotify button in YouTube mode. | Make the button hidden by default (`style="display:none"`) and let JS show it only if Spotify mode is active. Or render it conditionally in JS instead of HTML. |

---

## 4. Shortcomings

| # | Shortcoming | Solution |
|---|-------------|----------|
| 1 | **No build tooling** | Introduce Vite as the build tool. It handles dev server, bundling, and minification with near-zero config. |
| 2 | **No TypeScript** | Convert core data structures (stream objects, artist maps) to TypeScript interfaces. Even a `.d.ts` file without full migration helps. |
| 3 | **No tests** | Add Vitest for unit tests. Start with `topBy()`, `fmt()`, `p2Season()`, and data parsers. |
| 4 | **Performance bottlenecks** | Memoize expensive computations. Cache `tkMap`, `aMap`, and genre breakdowns. Only rebuild when `S` changes, not on every UI interaction. |
| 5 | **No Web Workers** | Move `parseFiles()`, `parseYTFiles()`, and heavy stats computation into a Web Worker. Post the result back to main thread. |
| 6 | **File naming** | Rename the file to `index.html` and use a proper version tag in the file or git. |
| 7 | **CDN dependency fragility** | Add local fallback copies of CDN scripts in a `vendor/` folder, loaded via `try { await import('https://cdn...') } catch { await import('./vendor/...') }`. |
| 8 | **No progressive enhancement** | Add a `<noscript>` block with instructions, and show a "JavaScript is required" message inside the dropzone if JS is disabled. |
| 9 | **Memory leaks** | Store interval IDs in a `window._intervals` array. On `goHome()` or `beforeunload`, clear them all. |
| 10 | **Incomplete YT Music support** | Build a proper YT Music parser that reads `music-library-songs` and `music-library-artists` CSVs, then reuses the same visualization pipeline as Spotify. |

---

## 5. Future Scope

| Category | Idea | How to Implement |
|----------|------|------------------|
| **Performance** | Move data parsing to a Web Worker; use WASM for large CSV parsing. | Create `worker.js` that accepts raw file buffers, parses them, and returns `{S, stats}`. Main thread only receives the final object. |
| **Architecture** | Split into ES modules (Vite or Rollup); separate phases into lazy-loaded chunks. | Use dynamic `import()` for each phase: `if (phaseEnabled) await import('./phases/p4.js')`. This keeps initial bundle tiny. |
| **Backend** | Optional cloud sync with end-to-end encryption; OAuth for Spotify/YouTube APIs instead of manual file upload. | Add an optional Supabase/Firebase integration with `libsodium` client-side encryption. User holds the key; backend stores ciphertext only. |
| **ML/AI** | On-device genre classification using artist embeddings; automatic playlist generation based on "comfort" and "commute" patterns. | Use TensorFlow.js or a lightweight ONNX model for music embeddings. Run inference in a worker; no server needed. |
| **Export** | PDF report generation, printable posters, and social-ready image templates. | Integrate `html2canvas` + `jspdf` for PDF. For posters, use the existing canvas rendering but at 2× or 3× scale for print quality. |
| **Mobile** | Capacitor or Tauri wrapper for a native app feel with background session tracking. | Wrap in Tauri (desktop) or Capacitor (mobile). Both support native background audio detection APIs. |
| **Collaboration** | Taste overlap with friends (Phase 8 is already prototyping this). | Extend Phase 8's `.statify.json` profile export to include a `publicKey`. Friends can encrypt shared profiles so only the recipient can read them. |
| **Accessibility** | Full WCAG 2.1 AA compliance, screen reader support, keyboard-only navigation. | Audit with Lighthouse Accessibility tab. Fix color contrast ratios (some purples on dark fail WCAG). Add skip links. |

---

## 6. Interactive Additions

Delight features to make the app feel more alive.

| # | Feature | How to Implement |
|---|---------|------------------|
| **1** | **Audio Preview on Hover** | If Spotify Live is connected, fetch 30s preview URLs from Spotify API. Render a tiny `<audio>` element on hover, or show a CSS waveform animation as a placeholder. |
| **2** | **Draggable Period Compare** | Replace `<select>` dropdowns with a dual-handle range slider (no-ui-slider or native `<input type="range">` with two thumbs). Use a canvas timeline underneath. |
| **3** | **Interactive Radar Chart** | Attach a `Chart.js` `onClick` event to the radar chart. Clicking a season label filters `S` to that season and re-renders the dashboard. |
| **4** | **Flip Cards in Artist Grid** | Use CSS `transform: rotateY(180deg)` on a `.card-inner` with `transform-style: preserve-3d`. Back face shows a mini Chart.js sparkline. |
| **5** | **Real-time Playback Sync** | Connect the existing `SP` polling loop to GSAP: animate the `.wb` bars in `.waveform` using `gsap.to()` with randomized heights on every poll tick. |
| **6** | **Scroll-driven Story Mode** | Create a hidden "Story" button. On click, use GSAP ScrollTrigger `pin: true` sections that auto-advance with `scrub: 1`. Add a `<dialog>` for narration text. |
| **7** | **Gesture Support** | Add a lightweight touch library (Hammer.js or 100-line custom swipe detector). Swipe switches Wrapped tabs; pinch zooms the heatmap via CSS `scale()`. |
| **8** | **Confetti on Milestones** | Use `canvas-confetti` (3KB) or a tiny custom particle burst (reuse the existing `spawnBurst()` function). Trigger from the Phase 5 badge unlock logic. |
| **9** | **Inline Track Editing** | Add `contenteditable` or a small inline `<input>` on right-click. Store edits in a `metadataOverrides` map keyed by `track+artist`. Recompute stats with overrides applied. |
| **10** | **Dark/Light Transition Animation** | Reuse the existing `theme-overlay` ripple technique. Trigger it from `toggleMode()` with a white/black ripple instead of green/red. |

---

## 7. Priority Matrix

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| Fix SE-1 (unclosed tag) | 1 min | High | **P0** |
| Fix SE-2 / SE-3 (PWA broken refs) | 5 min | High | **P0** |
| Fix SM-5 (session gap inconsistency) | 10 min | Medium | **P1** |
| Extract to modules (LB-1) | 2–3 hrs | Very High | **P1** |
| Add Web Worker (LB-5 / Shortcoming 5) | 3–4 hrs | Very High | **P1** |
| Add memoization (Shortcoming 4) | 1 hr | High | **P2** |
| Add gesture support (Interactive 7) | 2 hrs | Medium | **P3** |
| Scroll-driven Story (Interactive 6) | 4 hrs | High Delight | **P3** |
| Tauri/Capacitor wrapper (Future Scope) | 1–2 days | Product-level | **P4** |

---

## Notes

- All line numbers refer to the file `index (16).html` as of the audit date.
- The `sw.js` and `manifest.json` files are located in the project root alongside the HTML file.
- This audit should be revisited after any major refactoring (e.g., module extraction) as line numbers and file structures will change.
