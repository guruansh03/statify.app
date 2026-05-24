/* Statify TypeScript type definitions */

interface StreamEntry {
  ts?: string;
  endTime?: string;
  watchedAt?: string;
  artist?: string;
  artistName?: string;
  track?: string;
  title?: string;
  ms?: number;
  msPlayed?: number;
  ms_played?: number;
  skipped?: boolean;
  platform?: string;
  channel?: string;
  duration_ms?: number;
  durationMs?: number;
  duration?: number;
  fullMs?: number;
  _src?: string;
}

interface TrackMapEntry {
  count: number;
  ms: number;
}

interface ArtistEntry {
  count: number;
  ms: number;
}

interface SessionBucket {
  items: StreamEntry[];
  lastT: number;
  month: string;
}

interface StatifyExport {
  version: number;
  exportedAt: string;
  platform: 'spotify' | 'youtube';
  streams: StreamEntry[];
  overrides: Record<string, { artist?: string; track?: string }>;
}

interface PlatformStats {
  count: number;
  ms: number;
}

interface DecadeMap {
  [artist: string]: string;
}

interface GenreMap {
  [artist: string]: string;
}

interface BadgeDef {
  id: string;
  icon: string;
  label: string;
  description: string;
  condition: (data: {
    streams: StreamEntry[];
    artistMap: Record<string, ArtistEntry>;
    trackMap: Record<string, TrackMapEntry>;
  }) => boolean;
}

interface GlobalState {
  S: StreamEntry[];
  lib: any;
  tkMap: Record<string, TrackMapEntry>;
  isYT: boolean;
  SESSION_GAP_MS: number;
}

declare var S: StreamEntry[];
declare var lib: any;
declare var tkMap: Record<string, TrackMapEntry>;
declare var isYT: boolean;
declare var SESSION_GAP_MS: number;
declare var dashboardOpen: boolean;

declare function topBy(arr: StreamEntry[], fn: (x: StreamEntry) => string | undefined): [string, ArtistEntry | TrackMapEntry][];
declare function getMs(x: StreamEntry): number;
declare function fN(n: number): string;
declare function fmt(ms: number): string;
declare function unit(s?: string): string;
declare function accentColor(): string;
declare function accentRgb(): string;
declare function showToast(msg: string): void;
declare function spawnBurst(x: number, y: number, color: string, count: number): void;
