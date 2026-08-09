---
title: Deployment & Operations Playbook
type: obsidian-operations
version: 3.0.0
tags:
  - nebula/operations
  - vercel
  - devops
  - pwa
  - devtools-cdp
---

# 🚀 Deployment & Operations Playbook

Backlinks: [[Master View]] • [[Secrets]] • [[Version History & Archive]]

This playbook documents building, deploying, and debugging Nebula V3 on **Vercel** and local environments.

---

## 🛠️ Vercel Deployment Protocol

### 1. Linking Local Repository to Vercel Project
Ensure `.vercel/project.json` targets the primary `nebula-app` project:

```bash
# Link repository to primary Vercel project
npx vercel link --project nebula-app --yes
```

### 2. Promoting Production Builds
To trigger a fresh production build and alias to `https://nebula-app-kappa.vercel.app`:

```bash
# Production deploy command
npx vercel --prod --yes
```

---

## 📦 PWA Service Worker Configuration

Nebula V3 uses `vite-plugin-pwa` ([vite.config.js](file:///Users/neo/nEO-apps/app-3/vite.config.js)).

```javascript
// Workbox SW configuration in vite.config.js
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg'],
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    navigateFallback: null // Prevents SW from hijacking index.html on navigation
  }
})
```

> [!IMPORTANT]
> Setting `navigateFallback: null` is mandatory for Vercel root deployments to prevent Service Worker precache manifest 404s when HTML assets update.

---

## 🧪 Chrome DevTools CDP Automated Verification Script

To run headless DOM diagnostics against live Vercel deployments:

```javascript
// Scratch script to verify DOM mount & rendered cards via Chrome DevTools Protocol
const { spawn } = require('child_process');
const http = require('http');

const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  'https://nebula-app-kappa.vercel.app'
]);
```

---

## 🚨 Troubleshooting Common Deployment Issues

| Symptom | Cause | Resolution |
| :--- | :--- | :--- |
| **White Screen of Death** | Top wrapper returning `null` (e.g. `FileDropZone`) | Ensure top-level containers render `{ children }` continuously |
| **404 Asset Loading** | Incorrect `base` or missing PWA icon placeholders | Set `base: '/'` in `vite.config.js` and point `includeAssets` to valid files |
| **Stale SW HTML Cache** | Browser caching old `index.html` via Service Worker | Run `Cmd+Shift+R` or call `navigator.serviceWorker.getRegistrations()` |
| **Card Drag Jitter** | Firestore `onSnapshot` overriding local edit state | Enforce 1.5s `lastLocalEditTimeRef` debounce in `SpaceContext.jsx` |
