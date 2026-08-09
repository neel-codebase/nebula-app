# 🌌 Nebula v3.0 — The Spatial Intelligence Engine

**Nebula** is a cloud-synced, 60FPS infinite spatial workspace engineered for high-value thought mapping, system architecture, and strategic planning. Designed for solo operators and strategic leaders who need more than 1-dimensional vertical documents, Nebula releases thoughts into an unbound 2D spatial canvas with organic tag tethering, custom canvas physics, interactive task lists, and deep focus audio soundscapes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v3.0--official-purple.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-emerald.svg)

---

## 🌐 Official Production Application

Access the official production release of Nebula:

👉 **[https://nebula-app-kappa.vercel.app](https://nebula-app-kappa.vercel.app)**

---

## 🌟 Master Features (v3.0 Release)

### 🌌 Unbound Spatial Canvas & Physics
- **60FPS Infinite Viewport**: Exponential camera zoom (`0.15x` to `4.5x`) and translation with smooth dpr Retina scaling.
- **Pythagorean Gravity Nexus**: 1,000+ floating celestial particles connected into geometric triangle networks reacting to real-time cursor gravity.
- **Infinite Edge-to-Edge Wrapping**: Dynamic particle projection wrapping guarantees 100% viewport coverage across the entire canvas with zero gaps at any zoom level.
- **Cluster Orbit Constellations**: Physics auto-layout clustering scattered cards into circular orbital constellations grouped around primary hubs.

### 🔗 Tethering & Associations Engine
- **Multi-Anchor Drag Tethering**: Drag from any card's 4 perimeter anchor handles (`+`) to draw glowing cubic Bezier connection tethers.
- **Organic #Tag Tethers**: Automatic detection of matching `#hashtags` generating glowing dotted tethers with tag badge pills.
- **Notion-Style WYSIWYG Tether Editor**: Click any tether line on the canvas to open a floating editor popover bar for live text label editing, color swatch selection (Cyan, Purple, Emerald, Amber, Rose, Indigo), and deletion.
- **Inline Double-Click Renaming**: Double-click any tether line or pill on the canvas for instant label renaming.

### 📝 Rich Text Formatting & Interactive Task Lists
- **Interactive Checkboxes**: Create `- [ ] Task item` or `- [x] Completed item` lists. Click checkboxes directly on thought cards to toggle completion states live!
- **Bullet Lists**: Bullet items (`- Item` or `* Item`) with glowing cyan accent dots.
- **Headings & Inline Formatting**: H1 (`# Title`), H2 (`## Subtitle`), **Bold**, *Italic*, ~~Strikethrough~~, <u>Underline</u>, <mark>Highlight</mark>, and `[clickable hyperlinks](url)`.

### 🎧 Deep Focus Atmosphere & Cloud Sync
- **Procedural 432Hz Ambient Focus Synthesizer**: Built-in Web Audio API synthesizer producing sub-bass focus drones and soft pink noise waves.
- **Firebase Firestore Live Sync**: Bidirectional real-time persistence (`onSnapshot`) with debounced position write-backs.
- **Offline PWA Service Worker**: Precached static assets and Workbox service worker.

---

## 🛠️ Tech Stack

- **Build Environment**: [Vite](https://vitejs.dev/)
- **Frontend Architecture**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Graphics Pipeline**: HTML5 Canvas API (Spatial Grid Binned 60FPS Render Pipeline)
- **Backend Infrastructure**: Firebase Firestore & Auth
- **PWA Integration**: `vite-plugin-pwa` with Workbox Service Worker
- **Deployment Platform**: Vercel

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/neel-codebase/nebula-workspace.git
   cd nebula-workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run Local Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Git Hygiene

- `.env` secret keys are kept strictly offline and listed in `.gitignore`.
- Heavy build outputs (`dist/`, `node_modules/`) and Vercel cache (`.vercel/`) are ignored.
- `.env.example` serves as the safe template for environment variables.

---

## 📄 License

Distributed under the MIT License.
