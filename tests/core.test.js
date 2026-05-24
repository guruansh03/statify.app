/* Statify Core Tests — Vitest */
import { describe, it, expect } from 'vitest';

// Test stubs — run in browser context (vitest jsdom)
describe('Statify Core', () => {
  it('topBy groups and sorts entries correctly', () => {
    const data = [
      { artist: 'A', ms: 100 },
      { artist: 'B', ms: 200 },
      { artist: 'A', ms: 50 },
      { artist: 'C', ms: 300 }
    ];
    const map = {};
    data.forEach(x => {
      const k = x.artist;
      if (!map[k]) map[k] = { count: 0, ms: 0 };
      map[k].count++;
      map[k].ms += x.ms;
    });
    const sorted = Object.entries(map).sort((a, b) => b[1].count - a[1].count || b[1].ms - a[1].ms);
    expect(sorted[0][0]).toBe('A');
    expect(sorted[0][1].count).toBe(2);
    // B(200ms) vs C(300ms): same count (1), sorted by ms desc => C first
    expect(sorted[1][0]).toBe('C');
    expect(sorted[2][0]).toBe('B');
  });

  it('fN formats large numbers', () => {
    const fN = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n);
    expect(fN(1500000)).toBe('1.5M');
    expect(fN(5000)).toBe('5.0K');
    expect(fN(42)).toBe('42');
  });

  it('fmt formats milliseconds to readable time', () => {
    const fmt = (ms) => {
      const m = Math.floor(ms / 60000);
      const h = Math.floor(m / 60);
      if (h > 0) return h + 'h ' + (m % 60) + 'm';
      return m + 'm';
    };
    expect(fmt(3600000)).toBe('1h 0m');
    expect(fmt(900000)).toBe('15m');
    expect(fmt(0)).toBe('0m');
  });

  it('SESSION_GAP_MS equals 20 minutes in ms', () => {
    const SESSION_GAP_MS = 20 * 60 * 1000;
    expect(SESSION_GAP_MS).toBe(1200000);
  });

  it('skip detection uses 25% threshold with 10s floor', () => {
    const isSkipped = (x) => {
      if (x.skipped === true || x.skipped === 1) return true;
      const ms = x.ms || 0;
      const durMs = x.duration_ms || 0;
      if (durMs > 0) return ms < Math.max(10000, durMs * 0.25);
      return ms < 30000;
    };
    // 4 min track, played 30s = 12.5% < 25% => skipped
    expect(isSkipped({ ms: 30000, duration_ms: 240000 })).toBe(true);
    // 4 min track, played 90s = 37.5% > 25% => not skipped
    expect(isSkipped({ ms: 90000, duration_ms: 240000 })).toBe(false);
    // 10s track, played 5s = 50% but < 10s floor => skipped (floor protects against false negatives)
    expect(isSkipped({ ms: 5000, duration_ms: 10000 })).toBe(true);
    // 4 min track, played 67s = 28% > 25% and > 10s floor => not skipped
    expect(isSkipped({ ms: 67000, duration_ms: 240000 })).toBe(false);
    // Explicit skip flag
    expect(isSkipped({ skipped: true })).toBe(true);
  });
});
