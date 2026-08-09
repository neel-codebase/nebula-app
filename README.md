# 🌌 Nebula — Cloud-Synced Infinite Spatial Workspace

**Nebula** is a cloud-synced, infinite-canvas Progressive Web App (PWA) engineered for spatial thought management. Designed for strategic thinkers mapping out complex ideas, Nebula releases thoughts from rigid linear lists into a fluid, 60FPS digital canvas with organic tag tethering, custom canvas physics, interactive task lists, and deep focus audio soundscapes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v2.3.5--unified-purple.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-emerald.svg)

---

## 🌐 Live Production Application

Access the official live production release of Nebula here:

👉 **[https://nebula-app-kappa.vercel.app](https://nebula-app-kappa.vercel.app)**

---

## ✨ Release Notes (v2.3+ Unified Release)

### 🔗 Tether System & WYSIWYG Editor
- **WYSIWYG Tether Editor Popover**: Click any tether line or pill on the canvas to open a floating Notion-style editor bar with real-time text label renaming and delete actions.
- **Tether Color Accents**: Select custom tether accent colors (Cyan, Purple, Emerald, Amber, Rose, Indigo) to visually categorize connections across space.
- **Smooth Anchor Dragging**: Drag from any card's **(+) anchor handle** to draw cyan draft lines with automatic snap attachment.

### 📝 Rich Text Formatting & Task Checkboxes
- **Interactive Checkboxes & Task Lists**: Create `- [ ] Task item` or `- [x] Completed task item` lists. Clicking checkboxes directly on cards toggles completion state in real time!
- **Bullet Lists**: Clean bullet points (`- Item` or `* Item`) with glowing accent dots.
- **Headings & Inline Formatting**: H1 (`# Title`), H2 (`## Subtitle`), **Bold**, *Italic*, ~~Strikethrough~~, <u>Underline</u>, <mark>Highlight</mark>, and `[clickable hyperlinks](url)`.

### 🌌 Edge-to-Edge Infinite Pythagorean Gravity Nexus
- **Infinite Particle Wrapping**: Background 1,000+ particle gravity network projects dynamically across camera viewport bounds `[-1000, +1000]`, providing 100% edge-to-edge coverage with zero cutoff gaps at any zoom level (`0.15x` to `4.5x`).

### 🔍 Smart Scale Clamping & Compact Card Collapse
- **Macro Canvas View**: When zooming out (`< 0.45x`), glass cards automatically collapse into sleek spatial summary pills showing title, status, and tag chips, preventing text spillover.

### 🏷️ Ultimate Tag Experience
- **Organic #Tag Tethers**: Automatic detection of matching `#hashtags` creating glowing dotted tethers with tag badge pills.
- **Hashtag Autocomplete**: Real-time tag suggestions when typing `#` in notes or command search bar.

---

## 🛠️ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Frontend Engine**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Canvas Rendering**: HTML5 Canvas API (Spatial Binned 60FPS Pipeline)
- **Backend & Database**: Firebase Firestore & Auth
- **PWA Capabilities**: `vite-plugin-pwa` with Workbox Service Worker
- **Deployment**: Vercel

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

## 📄 License

Distributed under the MIT License.
