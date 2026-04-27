# Frontend Source

`src/parts/*.js` and `src/labyrinth.css` are the source files for the Hermes
dashboard plugin bundle. `src/demo/index.html` is the GitHub Pages demo source.

Run:

```bash
npm run build
```

This writes:

```text
dashboard/dist/index.js
dashboard/dist/labyrinth.css
index.html
```

The generated `index.html` stamps local plugin assets with a content hash, so
the canonical Pages URL can stay clean while JS/CSS updates bypass stale CDN or
browser cache.

The current source is intentionally conservative: it preserves the hackathon UI
while making the bundle reproducible. The parts are ordered by filename:

```text
00-runtime.js
10-sample-data.js
20-glyphs.js
30-map.js
40-inspector-guideposts.js
50-surfaces.js
60-experience-chrome.js
70-normalize-api.js
80-register.js
```

The next production step is to turn these ordered chunks into true modules with
explicit imports and focused tests.
