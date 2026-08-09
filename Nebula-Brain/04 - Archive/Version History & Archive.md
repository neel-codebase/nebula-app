---
title: Nebula Version History & Archive Notes
type: obsidian-archive
version: 3.0.0
tags:
  - nebula/archive
  - version-history
  - changelog
  - legacy-notes
---

# 📜 Version History & Archive Notes

Backlinks: [[Master View]] • [[Deployment & Operations]] • [[Component Map]]

This document preserves the complete historical timeline of Nebula development, from early workspace experiments to **Nebula V3**.

---

## 🚀 Version Evolution Summary

```
V1.0 Initial Prototype (Local Only) ──> V2.0 PWA & Firebase Sync ──> V3.0 Spatial Intelligence Engine
```

---

## 🏷️ Release Changelogs

### Version 3.0.0 (Current Production Checkpoint `v3.0.0-prod`)
- **Fix**: Resolved `FileDropZone` wrapper `null` render bug that caused React White Screen of Death on initial load.
- **Fix**: Added `lastLocalEditTimeRef` 1.5s debounce protection inside [SpaceContext.jsx](file:///Users/neo/nEO-apps/app-3/src/context/SpaceContext.jsx) to eliminate Firestore snapshot overwrite card jitter.
- **Fix**: Fixed `NaN` tether handle calculation in [ThoughtNodeOverlay.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/ThoughtNodeOverlay.jsx) by providing default card dimension fallbacks (`300x200`).
- **Fix**: Added `onPointerDown={(e) => e.stopPropagation()}` to card header control buttons (Pin, Edit, Color, Delete) to prevent button clicks initiating node dragging.
- **Enhancement**: Smooth logarithmic trackpad pinch-to-zoom scaling (`e.ctrlKey`) in [CanvasEngine.jsx](file:///Users/neo/nEO-apps/app-3/src/components/canvas/CanvasEngine.jsx).
- **Enhancement**: Added WYSIWYG `TetherEditorPopover` for link double-clicking on canvas.
- **DevOps**: Configured explicit root base `base: '/'` and disabled stale Service Worker navigation fallback (`navigateFallback: null`) in `vite.config.js`.

### Version 2.0.0 (Legacy `nebula-workspace` Repo)
- **Features**: Progressive Web App (PWA) manifest registration, Workbox offline caching, basic Cloud Firestore integration.
- **Archive Note**: Deployed at `nebula-workspace-two.vercel.app`. Retained for reference; active development migrated to `nebula-app`.

### Version 1.0.0 (Initial Prototype)
- **Features**: HTML5 Canvas prototype with plain DOM nodes and simple line drawing. LocalStorage persistence.

---

## 🗄️ Legacy Repository Comparison

| Attribute | Legacy Repo (`nebula-workspace`) | Active Production Repo (`nebula-app`) |
| :--- | :--- | :--- |
| **GitHub URL** | `github.com/neel-codebase/nebula-workspace` | `github.com/neel-codebase/nebula-app` |
| **Production Deployment** | `nebula-workspace-two.vercel.app` | `nebula-app-kappa.vercel.app` |
| **Status** | Archived | Active Mainstream V3 |
| **Spatial Engine** | Basic V1 Canvas | 60FPS Spatial Intelligence Engine |
| **Git Checkpoint Tag** | N/A | `v3.0.0-prod` |

---

## ↩️ Production Rollback Commands

If you need to roll back working code to the exact production V3 build:

```bash
# Tag checkpoint: v3.0.0-prod
git checkout v3.0.0-prod

# Hard reset uncommitted local experiments
git reset --hard v3.0.0-prod
```
