---
title: Nebula Component Registry & Dataview Base
type: obsidian-base
version: 3.0.0
tags:
  - nebula/base
  - dataview
  - component-registry
---

# 📊 Nebula Component Registry Base

Backlinks: [[Master View]] • [[Component Map]] • [[Spatial Engine]]

> [!TIP]
> This note serves as a structured **Obsidian Base** for tracking all React components, context providers, hooks, and utility modules across Nebula V3.

---

## 🗂️ Component Database View

```dataview
TABLE type, status, last_updated
FROM #nebula
SORT file.name ASC
```

---

## 📋 Master Component Registry Table

| Component / Module | Relative File Location | Primary Role | Hooks & State Used | Dataview Status |
| :--- | :--- | :--- | :--- | :--- |
| **`SpaceContext`** | `src/context/SpaceContext.jsx` | Central Spatial Store | `useState`, `useRef`, `useEffect`, `onSnapshot` | `Active Store` |
| **`CanvasEngine`** | `src/components/canvas/CanvasEngine.jsx` | 60FPS Spatial Canvas Renderer | `useSpace`, `requestAnimationFrame`, `handleWheel` | `Core Render` |
| **`ThoughtNodeOverlay`** | `src/components/ui/ThoughtNodeOverlay.jsx` | HTML Card Overlay Layer | `useSpace`, node dimension bounds | `UI Layer` |
| **`FileDropZone`** | `src/components/ui/FileDropZone.jsx` | File Import Window Listener | `useSpace`, `dragover`, `drop` | `IO Engine` |
| **`TetherEditorPopover`** | `src/components/ui/TetherEditorPopover.jsx` | Tether Label & Color Editor | `useSpace`, selection state | `WYSIWYG Popover` |
| **`HeaderNav`** | `src/components/ui/HeaderNav.jsx` | Title, Sync Indicator, Audio Toggle | `useSpace`, `audioEngine` | `Navigation` |
| **`CommandBar`** | `src/components/ui/CommandBar.jsx` | Bottom Tool & Action Dock | `useSpace` | `Dock UI` |
| **`Sidebar`** | `src/components/ui/Sidebar.jsx` | Spatial Search & Tag Filter Drawer | `useSpace` | `Drawer UI` |
| **`Minimap`** | `src/components/ui/Minimap.jsx` | Viewport Radar Map | `useSpace`, camera transform math | `Radar Nav` |
| **`CommandPalette`** | `src/components/ui/CommandPalette.jsx` | Cmd+K Spotlight Command Finder | `useSpace`, keyboard event listener | `Spotlight UI` |
| **`NodeModal`** | `src/components/ui/NodeModal.jsx` | Full-Screen Markdown Note Editor | `useSpace`, active edit node | `Modal Editor` |
| **`LandingPage`** | `src/components/landing/LandingPage.jsx` | Onboarding Showcase Overlay | Showcase state | `Showcase UI` |
| **`audioEngine`** | `src/utils/audioEngine.js` | 432Hz SoundSynthesizer Class | Web Audio API `AudioContext` | `Sound Utility` |
| **`tagParser`** | `src/utils/tagParser.js` | #Hashtag Extraction Engine | Regex parsing | `Text Utility` |
| **`firebase`** | `src/lib/firebase.js` | Cloud Credentials & Firestore Init | Firebase Web SDK v10 | `Backend Driver` |
