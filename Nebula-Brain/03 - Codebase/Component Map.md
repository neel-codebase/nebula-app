---
title: Nebula V3 React Component Map
type: obsidian-codebase
version: 3.0.0
tags:
  - nebula/codebase
  - react-components
  - architecture-map
---

# 🧩 Nebula V3 React Component Map

Backlinks: [[Master View]] • [[Spatial Engine]] • [[Cloud Sync & Storage]] • [[Component Registry Base]]

This document maps all React components across the Nebula V3 codebase architecture.

---

## 🌳 Component Hierarchy Tree

```
App.jsx (Root & ErrorBoundary)
├── SpaceProvider (SpaceContext.jsx)
└── SpaceViewport
    ├── FileDropZone (src/components/ui/FileDropZone.jsx)
    │   ├── CanvasEngine (src/components/canvas/CanvasEngine.jsx)
    │   ├── ThoughtNodeOverlay (src/components/ui/ThoughtNodeOverlay.jsx)
    │   ├── TetherEditorPopover (src/components/ui/TetherEditorPopover.jsx)
    │   ├── HeaderNav (src/components/ui/HeaderNav.jsx)
    │   ├── Minimap (src/components/ui/Minimap.jsx)
    │   ├── CommandBar (src/components/ui/CommandBar.jsx)
    │   ├── Sidebar (src/components/ui/Sidebar.jsx)
    │   ├── CommandPalette (src/components/ui/CommandPalette.jsx)
    │   ├── NodeModal (src/components/ui/NodeModal.jsx)
    │   └── LandingPage (src/components/landing/LandingPage.jsx)
```

---

## 📑 Core Component Specifications

| Component Name | File Path | Primary Function | State Dependencies |
| :--- | :--- | :--- | :--- |
| **`App`** | [App.jsx](file:///Users/neo/nEO-apps/app-3/src/App.jsx) | Root container with `ErrorBoundary` and provider wrappers | `ErrorBoundary` state |
| **`SpaceProvider`** | [SpaceContext.jsx](file:///Users/neo/nEO-apps/app-3/src/context/SpaceContext.jsx) | Central spatial store (nodes, links, camera, selection, Firestore sync) | `useState`, `useRef`, `onSnapshot` |
| **`CanvasEngine`** | [CanvasEngine.jsx](file:///Users/neo/nEO-apps/app-3/src/components/canvas/CanvasEngine.jsx) | 60FPS HTML5 canvas for grid lines, bezier tethers, pan/zoom physics | `useSpace()`, `requestAnimationFrame` |
| **`ThoughtNodeOverlay`** | [ThoughtNodeOverlay.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/ThoughtNodeOverlay.jsx) | HTML Glassmorphism card layer rendering interactive thought cards | `useSpace()`, node positioning math |
| **`FileDropZone`** | [FileDropZone.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/FileDropZone.jsx) | Window drop listener converting Markdown, Text, & JSON files to spatial nodes | `useSpace()`, `dragover` events |
| **`TetherEditorPopover`** | [TetherEditorPopover.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/TetherEditorPopover.jsx) | Floating WYSIWYG tether popover for editing link labels and colors | `useSpace()`, selection linkId |
| **`HeaderNav`** | [HeaderNav.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/HeaderNav.jsx) | Top bar displaying space title, sync indicator, focus audio toggle | `useSpace()`, `audioEngine` |
| **`CommandBar`** | [CommandBar.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/CommandBar.jsx) | Bottom action dock for adding nodes, search, zoom controls, template load | `useSpace()` |
| **`CommandPalette`** | [CommandPalette.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/CommandPalette.jsx) | Cmd+K spotlight search palette for instant node jump and command execution | `useSpace()`, keyboard shortcuts |
| **`Sidebar`** | [Sidebar.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/Sidebar.jsx) | Slide-out panel displaying node lists, tag filters, spatial search | `useSpace()` |
| **`Minimap`** | [Minimap.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/Minimap.jsx) | Radar minimap visualizing global canvas bounds and viewport frame | `useSpace()`, camera transforms |
| **`NodeModal`** | [NodeModal.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/NodeModal.jsx) | Modal dialog for rich markdown editing of thought card contents | `useSpace()`, active edit node |
| **`LandingPage`** | [LandingPage.jsx](file:///Users/neo/nEO-apps/app-3/src/components/landing/LandingPage.jsx) | Onboarding showcase modal introducing spatial intelligence controls | Showcase state |
