---
name: web-performance-audit
description: Audit web application performance using Core Web Vitals metrics and identify actionable optimizations. Use when asked to improve page load speed, investigate performance regressions, audit Lighthouse scores, or optimize bundle size for a React frontend.
---

# Web Performance Audit — Frontend Performance Optimization

---

## 1. Trigger Conditions

- "Our page is slow", "improve Lighthouse score", "optimize bundle size"
- "LCP is too high", "CLS issues", "INP is poor"
- Before a production deployment or after a major feature addition

---

## 2. Audit Flow

```
Phase 1: Measure → Phase 2: Identify → Phase 3: Fix → Phase 4: Verify
```

---

## 3. Phase 1: Measure Current State

### Run Lighthouse locally

```bash
# Install if not available
npm install -g lighthouse

# Audit a running local dev server
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html --view

# Audit production URL
lighthouse https://your-domain.com --output json --output-path ./lh-report.json
```

### Key metrics to record

| Metric | Good | Needs Work | Poor |
|:---|:---|:---|:---|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | < 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | < 3s | > 3s |
| **TTFB** (Time to First Byte) | < 800ms | < 1.8s | > 1.8s |
| **TBT** (Total Blocking Time) | < 200ms | < 600ms | > 600ms |

**Always record the baseline scores BEFORE making any changes.**

---

## 4. Phase 2: Identify Issues

### 4a. Bundle Analysis (React / Vite / Webpack)

```bash
# Vite — analyze bundle
npx vite-bundle-visualizer
# Opens interactive treemap in browser

# Webpack — analyze bundle
npx webpack-bundle-analyzer stats.json
# Generate stats: webpack --profile --json > stats.json

# Create React App
npx source-map-explorer 'build/static/js/*.js'
```

**Look for:**
- Single chunks > 500KB (should be code-split)
- `lodash` / `moment` imported wholesale → use `lodash-es` or `dayjs`
- Barrel files (`index.js` re-exporting everything) blocking tree-shaking

### 4b. Network Analysis

Open DevTools → Network tab → throttle to "Slow 4G":

| Finding | Diagnosis |
|:---|:---|
| JS files blocking render in `<head>` | Missing `async` or `defer` attribute |
| Fonts loaded after CSS | Missing `<link rel="preload">` for fonts |
| Large uncompressed JS/CSS | Gzip/Brotli not enabled on server |
| Images > 200KB | Missing WebP conversion or responsive sizing |
| Multiple sequential API calls on load | Waterfall — consider parallel fetching |

---

## 5. Phase 3: Apply Fixes

### Fix LCP (Largest Contentful Paint)

```jsx
// Preload hero image
<link rel="preload" as="image" href="/hero.webp" />

// React: Use fetchpriority on hero image
<img src="/hero.webp" fetchpriority="high" alt="Hero" />

// Convert to WebP
// Use: sharp, imagemin, or build-time plugin
```

### Fix TBT / INP (JavaScript Blocking)

```jsx
// Code-split heavy routes (React lazy + Suspense)
const HeavyPage = React.lazy(() => import('./pages/HeavyPage'));

// Defer non-critical scripts
<script src="analytics.js" defer></script>

// Reduce main thread work: move computation to Web Worker
const worker = new Worker('./heavy-compute.js');
```

### Fix CLS (Layout Shift)

```css
/* Always define width + height on images */
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Reserve space before load */
}

/* Reserve space for dynamic content (ads, embeds) */
.ad-container {
  min-height: 250px;
}
```

### Fix TTFB (Server Response Time)

```js
// Backend: Add response caching for read-heavy APIs
const cache = new Map();
router.get('/api/games', asyncHandler(async (req, res) => {
  if (cache.has('games')) return res.json(cache.get('games'));
  const games = await GameService.getAll();
  cache.set('games', games);
  setTimeout(() => cache.delete('games'), 60_000); // 1 min TTL
  res.json(games);
}));
```

### Fix Bundle Size

```js
// Replace moment.js (72KB) with dayjs (2KB)
// Before:
const moment = require('moment');
moment().format('YYYY-MM-DD');

// After:
const dayjs = require('dayjs');
dayjs().format('YYYY-MM-DD');

// Replace lodash with native or lodash-es
// Before:
const _ = require('lodash');

// After (tree-shakeable):
import { debounce } from 'lodash-es';
```

---

## 6. Phase 4: Verify Improvements

```bash
# Re-run Lighthouse after fixes
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-after.html --view

# Compare before vs after scores
# Document delta for PR description
```

**Minimum acceptable improvement**: Any metric that was in "Poor" must reach at least "Needs Work". Never ship a regression.

---

## 7. Output Format

Report findings as:

### Core Web Vitals Summary
| Metric | Before | After | Status |
|:---|:---|:---|:---|
| LCP | 4.2s | 2.1s | ✅ Good |
| ... | | | |

### Top Issues Found
1. **[HIGH]** Hero image not preloaded — adds ~800ms to LCP
2. **[MEDIUM]** `moment.js` in bundle — 72KB unneeded weight
3. **[LOW]** Missing image `aspect-ratio` — causes CLS on slow connections

### Fixes Applied
- Code snippet or config change for each fix

---

## 8. Anti-patterns

| ❌ DON'T | ✅ DO |
|:---|:---|
| Audit without establishing a baseline | Record scores before any changes |
| Optimize without measuring impact | Re-run Lighthouse after every significant fix |
| Use `loading="lazy"` on above-the-fold images | Reserve `lazy` for below-fold images only |
| Import entire `lodash` for one function | Import individual functions or use `lodash-es` |
| Inline large SVGs in JSX | Import as external files and cache via browser |
