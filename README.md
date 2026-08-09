# 🌌 Nebula — Cloud-Synced Infinite Spatial Workspace

**Nebula** is a cloud-synced, infinite-canvas Progressive Web App (PWA) engineered for spatial thought management. Designed for solo operators and strategic thinkers mapping out complex systems, Nebula releases thoughts from rigid linear lists into a fluid, 60FPS digital canvas with organic tag tethering, custom canvas physics, and deep focus audio soundscapes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v2.2-purple.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-emerald.svg)

---

## ✨ Features

### 🌌 Unbound Spatial Canvas
- **Infinite Pan & Zoom**: Smooth exponential zooming (`0.15x` to `4.5x`) and camera translation with inertia dampening.
- **Pythagorean Gravity Nexus**: 1,000+ floating celestial particles connected into geometric triangle networks with real-time cursor gravity warping.
- **Retina High-DPI Scaling**: Crisp rendering across all display densities with dynamic window resize handling.

### 🔗 Tethering & Associations
- **Organic #Tag Tethering**: Automatic detection of `#hashtags` in titles and notes creating glowing dotted light-lines between shared concepts.
- **Manual Card-to-Card Drag Tethering**: Drag from any card's **(+) anchor handle** to draw solid glowing bezier tethers to other thoughts.
- **Connection Management**: View, edit labels, or remove active manual links inside the thought editor modal.

### 🪐 Cluster Orbit Constellations
- **Auto-Layout Physics**: Automatically cluster scattered notes into circular orbital constellations grouped around primary concept hubs.
- **Spatial Pinning**: Pin crucial thoughts to lock their X/Y coordinates in space during auto-layout re-clustering.

### 🎧 Deep Focus Environment
- **Procedural 432Hz Ambient Drone**: Built-in Web Audio API synthesizer generating sub-bass focus drones and soft pink noise waves.
- **Organic Sound FX**: Soft audio chimes on node creation, tether connection, and deletion.

### ⚡ Progressive Web App & Cloud Sync
- **Firebase Firestore Live Sync**: Bidirectional real-time persistence (`onSnapshot`) with debounced position write-backs.
- **Google Authentication**: Optional Google Sign-In for multi-device cloud space isolation.
- **Offline First**: Service worker asset caching and `localStorage` fallback.
- **Quick-Capture & File Import**: Instant note drop input bar and drag-and-drop `.md`, `.txt`, or `.json` file importer.

---

## 🛠️ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Frontend Engine**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Dark Glassmorphism Design System)
- **Canvas Rendering**: HTML5 Canvas API (Spatial Grid Binned 60FPS Pipeline)
- **Backend & Database**: Firebase Firestore & Auth
- **PWA Capabilities**: `vite-plugin-pwa` with Workbox Service Worker
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ 
- npm v9+

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
   *(Note: `.env` is gitignored to protect secret keys from public exposure).*

4. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Git Hygiene

- Environment variables (`.env`) are kept strictly offline and listed in `.gitignore`.
- Heavy build artifacts (`dist/`, `node_modules/`) and Vercel cache (`.vercel/`) are ignored.
- Use `.env.example` as the safe template for environment variables.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
