# 🪐 NEBULA V4 → V5 MASTER ARCHITECTURE & DEVELOPER NAVIGATOR

> **Document Version**: 4.0.0  
> **Target Audience**: Core Developers, Systems Architects & Maintainers  
> **Scope**: Nebula V4 System Mechanics, Mathematical Foundations, Codebase Component Map, Extension Protocols, and V4-to-V5 Migration Roadmap.

---

## 📑 Table of Contents

1. [Architectural Overview & Version Lineage](#1-architectural-overview--version-lineage)
2. [High-Level Data Flow & State Pipeline](#2-high-level-data-flow--state-pipeline)
3. [Core Mathematical & Engineering Engines](#3-core-mathematical--engineering-engines)
   - [3.1 Canvas Camera Transform Matrix](#31-canvas-camera-transform-matrix)
   - [3.2 60FPS Pythagorean Gravity & Particle Nexus](#32-60fps-pythagorean-gravity--particle-nexus)
   - [3.3 Bezier Tether Anchoring & Hashtag Parser](#33-bezier-tether-anchoring--hashtag-parser)
   - [3.4 Multi-Galaxy Map Persistence Engine](#34-multi-galaxy-map-persistence-engine)
4. [V4 Complete Component Map & File Hierarchy](#4-v4-complete-component-map--file-hierarchy)
5. [Developer Modification Playbook (Extending V4)](#5-developer-modification-playbook-extending-v4)
   - [Recipe A: Adding New Card Attributes](#recipe-a-adding-new-card-attributes)
   - [Recipe B: Tweaking Particle Gravity Physics](#recipe-b-tweaking-particle-gravity-physics)
   - [Recipe C: Extending the Command Palette (Cmd+K)](#recipe-c-extending-the-command-palette-cmdk)
   - [Recipe D: Packaging & Updating Chrome Extensions](#recipe-d-packaging--updating-chrome-extensions)
6. [V4 → V5 Strategic Roadmap & Upgrade Blueprint](#6-v4--v5-strategic-roadmap--upgrade-blueprint)

---

## 1. Architectural Overview & Version Lineage

**Nebula V4** simplifies and consolidates all spatial mapping capabilities into a seamless experience. Key pillars of V4:

- **First-Landing Showcase**: The application defaults to the visual `LandingPage` on first load, demonstrating the **Tag & Tether mechanism** and star nebula gravity before opening the workspace.
- **Multi-Galaxy Map Isolation**: Spatial thoughts are partitioned into discrete Galaxy Maps stored in `localStorage` under `nebula_galaxy_maps`.
- **Retina 60FPS HTML5 Canvas**: Canvas engine optimized with spatial grid binning (`160px` cells) to maintain 60FPS with 1,000 dynamic gravity particles.
- **Offline-First Multi-Tier Persistence**: Synchronizes with Firebase Firestore when online while maintaining instant `localStorage` fallbacks when offline.

```
+-------------------------------------------------------------------------+
|                          NEBULA V4 ARCHITECTURE                         |
+-------------------------------------------------------------------------+
|  React 18 Context Layer  <--->  HTML5 60FPS Canvas  <---> Web Audio 432Hz |
|         |                                                        |      |
|  Multi-Galaxy State           Pythagorean Star Particles      Harmonic  |
|  (Milky Way, Andromeda)       Spatial Grid Binning (160px)    Synth     |
|         |                                                        |      |
|  Local Storage Sync   <----->   Firestore Cloud Engine  <-----> PWA/SW  |
+-------------------------------------------------------------------------+
```

---

## 2. High-Level Data Flow & State Pipeline

State management is centralized in `SpaceContext.jsx` ([SpaceContext.jsx](file:///Users/neo/nEO-apps/app-3/src/context/SpaceContext.jsx)):

```
                                 ┌─────────────────────────┐
                                 │   SpaceProvider State   │
                                 └────────────┬────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
     ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
     │   galaxyMaps    │             │      nodes      │             │      links      │
     │  Multi-Galaxy   │             │   Active Map    │             │  Manual + Auto  │
     └────────┬────────┘             └────────┬────────┘             └────────┬────────┘
              │                               │                               │
              ▼                               ▼                               ▼
    localStorage Persistence         ThoughtNodeOverlay               CanvasEngine &
   `nebula_galaxy_maps`               (Glassmorphism)              Bezier Tether Lines
```

---

## 3. Core Mathematical & Engineering Engines

### 3.1 Canvas Camera Transform Matrix

The camera operates via 2D transformation coordinates: `camera = { x, y, zoom }`.

- **Screen-to-World Coordinate Conversion**:
  $$\text{worldX} = \frac{\text{screenX} - \text{camera.x}}{\text{camera.zoom}}$$
  $$\text{worldY} = \frac{\text{screenY} - \text{camera.y}}{\text{camera.zoom}}$$

- **World-to-Screen Coordinate Conversion**:
  $$\text{screenX} = \text{worldX} \cdot \text{camera.zoom} + \text{camera.x}$$
  $$\text{screenY} = \text{worldY} \cdot \text{camera.zoom} + \text{camera.y}$$

### 3.2 60FPS Pythagorean Gravity & Particle Nexus

Located in `CanvasEngine.jsx` ([CanvasEngine.jsx](file:///Users/neo/nEO-apps/app-3/src/components/canvas/CanvasEngine.jsx)):

1. **Mouse Gravity Attraction**:
   $$F_{\text{gravity}} = \frac{320 - d}{320} \cdot 0.18 \quad \text{for } d < 320\text{px}$$
   $$v_x \leftarrow v_x + \frac{\Delta x}{d} \cdot F_{\text{gravity}}, \quad v_y \leftarrow v_y + \frac{\Delta y}{d} \cdot F_{\text{gravity}}$$

2. **Damping & Dusted Orbit Velocity**:
   $$v_x \leftarrow v_x \cdot 0.985, \quad v_y \leftarrow v_y \cdot 0.985$$

3. **Spatial Grid Binning ($O(N)$ Optimization)**:
   Particles are partitioned into grid buckets of size $S = 160\text{px}$. Proximity line connections are calculated **only** between particles in adjacent grid cells $(cx \pm 1, cy \pm 1)$.

### 3.3 Bezier Tether Anchoring & Hashtag Parser

1. **Card Edge Anchor Math**:
   Determines optimal anchor points on card boundaries using slope comparison:
   $$\text{if } |\Delta x| \cdot h > |\Delta y| \cdot w \Rightarrow \text{Left/Right Edge Anchor}$$
   $$\text{else} \Rightarrow \text{Top/Bottom Edge Anchor}$$

2. **Cubic Bezier Curve Equation**:
   $$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3, \quad t \in [0, 1]$$

3. **Hashtag Regex Auto-Parser**:
   Located in `tagParser.js` ([tagParser.js](file:///Users/neo/nEO-apps/app-3/src/utils/tagParser.js)):
   ```javascript
   const HASHTAG_REGEX = /#([a-zA-Z0-9_\-]+)/g;
   ```
   When two cards contain matching hashtags, a dotted auto-tether link is dynamically generated.

### 3.4 Multi-Galaxy Map Persistence Engine

Schema for Galaxy Maps stored in `localStorage` (`nebula_galaxy_maps`):

```typescript
interface GalaxyMap {
  id: string;               // Unique galaxy ID (e.g. 'galaxy-1723456789')
  name: string;             // User-customizable galaxy name
  nodes: Record<string, ThoughtNode>; // Active cards in map
  links: TetherLink[];      // Custom tethers in map
  createdAt: number;        // Creation timestamp
  updatedAt: number;        // Last modification timestamp
}
```

---

## 4. V4 Complete Component Map & File Hierarchy

```
src/
├── App.jsx                       # ErrorBoundary, SpaceViewport, Landing Page default switch
├── main.jsx                      # React DOM mounting & PWA service worker registration
├── index.css                     # Design system CSS variables, glassmorphism utilities
├── context/
│   └── SpaceContext.jsx          # Central state store (nodes, links, galaxyMaps, camera)
├── components/
│   ├── canvas/
│   │   └── CanvasEngine.jsx      # 60FPS HTML5 canvas, grid lines, particle gravity, tethers
│   ├── landing/
│   │   └── LandingPage.jsx       # Introductory visual showcase (Tag & Tether simulation)
│   └── ui/
│       ├── HeaderNav.jsx         # Top navigation bar, galaxy map indicator, audio toggle
│       ├── Sidebar.jsx           # Left Rail: Multi-Galaxy Maps manager & Thought Index
│       ├── ThoughtNodeOverlay.jsx# Glassmorphism HTML cards, drag handles, inline markdown
│       ├── CommandBar.jsx        # Bottom action dock (add node, search, zoom, templates)
│       ├── CommandPalette.jsx    # Cmd+K spotlight search & command execution
│       ├── NodeModal.jsx         # Fullscreen markdown editor for thought cards
│       ├── Minimap.jsx           # Radar minimap displaying global canvas bounds
│       ├── TetherEditorPopover.jsx# WYSIWYG tether popover for link labels & colors
│       ├── ChromeAppModal.jsx    # Chrome Extension package download modal
│       └── FileDropZone.jsx      # File drop listener converting markdown files to nodes
├── utils/
│   ├── ambientAudio.js           # Web Audio API 432Hz harmonic synthesizer
│   └── tagParser.js              # Regex parser for organic hashtag auto-tethering
└── lib/
    └── firebase.js               # Firebase Firestore & Auth configuration with fallback mode
```

---

## 5. Developer Modification Playbook (Extending V4)

### Recipe A: Adding New Card Attributes
To add a new property (e.g., `icon` or `priority`) to thought cards:
1. Open `SpaceContext.jsx` ([SpaceContext.jsx](file:///Users/neo/nEO-apps/app-3/src/context/SpaceContext.jsx)).
2. Update `createNode` signature and default object:
   ```javascript
   const newNode = {
     id,
     title,
     content,
     icon: updates.icon || 'default', // New property
     // ...
   };
   ```
3. Update `ThoughtNodeOverlay.jsx` ([ThoughtNodeOverlay.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/ThoughtNodeOverlay.jsx)) to render the new property inside card headers.

### Recipe B: Tweaking Particle Gravity Physics
To modify background particle counts or gravity strength:
1. Open `CanvasEngine.jsx` ([CanvasEngine.jsx](file:///Users/neo/nEO-apps/app-3/src/components/canvas/CanvasEngine.jsx)).
2. Change particle count in `useEffect`:
   ```javascript
   const count = 1200; // Increase or decrease particle count
   ```
3. Adjust gravity attraction distance and force in the render loop (Line 165):
   ```javascript
   if (distMouse < 400) { // Change interaction radius
     const force = (400 - distMouse) / 400 * 0.25; // Increase pull force
     p.vx += (dxMouse / distMouse) * force;
     p.vy += (dyMouse / distMouse) * force;
   }
   ```

### Recipe C: Extending the Command Palette (Cmd+K)
To add a new shortcut command:
1. Open `CommandPalette.jsx` ([CommandPalette.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/CommandPalette.jsx)).
2. Add your command definition object to the commands array:
   ```javascript
   {
     id: 'custom-action',
     label: 'Export Galaxy Map',
     icon: Download,
     action: () => exportCurrentMapAsJSON()
   }
   ```

### Recipe D: Packaging & Updating Chrome Extensions
The Manifest V3 files are located in `chrome-extension/` ([manifest.json](file:///Users/neo/nEO-apps/app-3/chrome-extension/manifest.json)).
1. After updating frontend code, run `npm run build`.
2. Copy `dist/index.html` and assets into `chrome-extension/`.
3. Reload the extension in `chrome://extensions`.

---

## 6. V4 → V5 Strategic Roadmap & Upgrade Blueprint

```
+-----------------------------------------------------------------------+
|                         NEBULA V5 ROADMAP MAP                         |
+------------------------------------+----------------------------------+
| 1. Realtime Multi-User Cursors     | WebRTC + Firestore Signaling     |
| 2. 3D WebGL Spatial Universe       | Three.js / React Three Fiber     |
| 3. AI Spatial Clustering           | Embeddings & Auto Tag Synthesis  |
| 4. Spatial Audio Nodes             | Positional 3D Web Audio Engine   |
+------------------------------------+----------------------------------+
```

### Phase 1: Realtime Multi-User Cursors (V5.1)
- Extend `SpaceContext.jsx` to broadcast cursor coordinates `(x, y)` via Firebase Realtime Database or WebRTC data channels.
- Render dynamic user avatars hovering across the canvas engine in `CanvasEngine.jsx`.

### Phase 2: 3D WebGL Galaxy View (V5.2)
- Introduce a WebGL toggle switching the 2D HTML5 Canvas into a 3D particle universe using Three.js.
- Project card nodes onto 3D orbital planes $(X, Y, Z)$ with gravitational z-depth panning.

### Phase 3: AI Spatial Thought Clustering (V5.3)
- Integrate vector embeddings for card contents.
- Automatically arrange semantically similar thoughts into cosmic constellation clusters using t-SNE or UMAP spatial reduction.

---

> **Document Maintained By**: Nebula Core Engineering  
> **Last Verified**: August 2026 | Version 4.0.0
