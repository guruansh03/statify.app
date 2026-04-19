# Statify

> Analyze your Spotify & YouTube watch history. Beautifully. Privately.

**Statify** is a fully client-side data visualization tool for your personal listening and watch history. Drop in your exported data files and instantly get deep insights — no accounts, no servers, no tracking. Everything runs in your browser.

---

## ✨ Features

### 🎵 Spotify Mode
- **Total streams, listening time, skip rate, unique tracks & artists** — full overview stats
- **Top 50 Tracks** — sortable by stream count or total time, with search/filter
- **Top Artists** — ranked with per-artist deep dive modal (peak hour, top tracks, best month)
- **Monthly Explorer** — drill into any month or year with charts and track breakdowns
- **Heatmap** — hourly + day-of-week listening patterns
- **Activity Calendar** — GitHub-style contribution graph of your listening history
- **Listening Journey** — month-by-month scroll through your top artist/track evolution
- **Personality Cards** — Night Owl vs Early Bird, Loyalty Score, Discovery Rate, Skip Personality, and more
- **Deep Stats** — longest binge, streak tracker, peak hour, best day ever, avg session
- **Genre Breakdown** — donut chart with artist-to-genre mapping
- **Listening DNA** — visual breakdown of morning/afternoon/evening/night listening share
- **Period Comparison** — compare any two time ranges head-to-head
- **Your Day Timeline** — replay any single day's listening session by session
- **Decade & Platform breakdown** — which era and device you listen on most
- **Wrapped Card** — shareable Instagram story or Twitter card export
- **Live Spotify Integration** — connect via OAuth (PKCE) to see Now Playing + Recently Played in real time, with playback controls, progress bar, and like button
- **Playlists Panel** — live-fetched playlists grouped by inferred genre

### 📺 YouTube Mode
- **Watch History** — parsed from Google Takeout `watch-history.html`
- **Top 50 Videos & Channels** — same ranking engine as Spotify mode
- **Search History Analysis** — top search terms, unique queries
- **Subscriptions Audit** — actual watched vs ghost subs (subscribed but never watched)
- **Comments Browser** — your comment history with stats
- **Playlist Viewer** — all your YT playlists with video listings
- **YouTube Music Library** — saved songs, artists, albums from `music-library-songs.csv`
- All shared sections: heatmap, calendar, journey, personality, deep stats, genre chart, DNA

### 🎨 UI & UX
- Smooth GSAP scroll animations with ScrollTrigger
- Theme toggle: Spotify Green ↔ YouTube Red with full radial ripple transition
- 6 accent color options (Spotify Green, Cyan, Purple, Rose, Amber, Sky)
- Light / Dark mode
- Sticky Now Playing bar with real-time progress ticker
- Keyboard shortcuts (arrow keys for tabs, Esc to close modals, Home to scroll top)
- Fully responsive, mobile-friendly
- PWA-ready (manifest + service worker)
- Demo mode — try everything without uploading any files

---

## 🔒 Privacy

**100% local.** Your data never leaves your device. There is no backend, no analytics, no cookies. All file parsing and computation happens in-browser using vanilla JS.

---

## 🚀 Getting Started

### Spotify

1. Go to **Spotify → Account → Privacy Settings → Download your data**
2. Wait for the email (can take up to 30 days for extended history)
3. Extract the ZIP and drop the `StreamingHistory_music_*.json` files into Statify
4. Optionally drop `YourLibrary.json` for library stats

### YouTube

1. Go to **[Google Takeout](https://takeout.google.com)**
2. Select **YouTube and YouTube Music** → choose **History** format as HTML
3. Export and extract the ZIP
4. Drop any combination of these files into Statify:

| File | Data |
|---|---|
| `watch-history.html` | Full watch history |
| `search-history.html` | Search queries |
| `subscriptions.csv` | Channel subscriptions |
| `comments.csv` | Your comments |
| `*.csv` (playlists) | Playlist contents |
| `music-library-songs.csv` | YouTube Music saved songs |

---

## ⚡ Spotify Live Integration

Connect your Spotify account for real-time Now Playing data:

1. Create a free app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Add your Statify URL as a **Redirect URI** in the app settings
3. Click **Login** in the Statify header and enter your Client ID
4. Authorize — you'll be redirected back and connected instantly

Supports playback controls (play/pause, skip, previous), progress tracking, and track liking. Uses PKCE OAuth — your credentials are never exposed.

---

## 🛠 Tech Stack

| Library | Purpose |
|---|---|
| [GSAP + ScrollTrigger](https://greensock.com/gsap/) | Animations |
| [Chart.js](https://www.chartjs.org/) | Line and donut charts |
| [html2canvas](https://html2canvas.hertzen.com/) | Dashboard / Wrapped export |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | UI font |
| [Space Mono](https://fonts.google.com/specimen/Space+Mono) | Monospace labels |

No frameworks. No build step. Single `index.html`.

---

## 📁 File Structure

```
statify.app/
├── index.html      # Entire app — UI, logic, styles
├── manifest.json   # PWA manifest
└── sw.js           # Service worker (offline support)
```

---

## 📸 Export

- **Dashboard Export** — screenshot the full dashboard as a JPEG
- **Wrapped Card** — generate a shareable card in Instagram Story (1080×1920) or Twitter/X Card (1200×675) format

---

## 🙏 Acknowledgements

Data sourced entirely from official platform exports:
- [Spotify Privacy Settings](https://www.spotify.com/account/privacy/)
- [Google Takeout](https://takeout.google.com)

---

<div align="center">
  <sub>Built with ♥ · All data stays on your device · v4.0</sub>
</div>
