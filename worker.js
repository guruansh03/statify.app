/* Statify Web Worker — parses files off main thread */
'use strict';

self.onmessage = function(e) {
  const { type, files } = e.data;

  if (type === 'parse') {
    const results = { streams: [], errors: [], yt: {} };
    const readers = [];

    Array.from(files).forEach((file) => {
      const p = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(ev) {
          try {
            if (file.name.endsWith('.json')) {
              const data = JSON.parse(ev.target.result);
              if (Array.isArray(data)) {
                results.streams.push(...data.map(r => ({ ...r, _src: file.name })));
              } else {
                results.streams.push(...flattenStreams(data));
              }
            } else if (file.name.endsWith('.csv')) {
              results.yt.csv = results.yt.csv || [];
              results.yt.csv.push({ name: file.name, raw: ev.target.result });
            } else if (file.name.endsWith('.html')) {
              results.yt.html = results.yt.html || [];
              results.yt.html.push({ name: file.name, raw: ev.target.result });
            }
          } catch (err) {
            results.errors.push({ file: file.name, error: err.message });
          }
          resolve();
        };
        reader.readAsText(file);
      });
      readers.push(p);
    });

    Promise.all(readers).then(() => {
      self.postMessage({ type: 'parsed', results });
    });
  }
};

function flattenStreams(obj) {
  const out = [];
  function walk(o) {
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (o && typeof o === 'object') {
      if (o.ts || o.endTime || o.watchedAt) { out.push(o); return; }
      Object.values(o).forEach(walk);
    }
  }
  walk(obj);
  return out;
}
