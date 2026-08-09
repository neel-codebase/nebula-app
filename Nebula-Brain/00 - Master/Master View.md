---
title: Nebula Brain — Master Control Hub
type: obsidian-master
version: 3.0.0
status: active
last_updated: 2026-08-09
tags:
  - nebula/master
  - nebula/v3
  - spatial-intelligence
  - obsidian-vault
---

# 🪐 Nebula Brain — Master Control Hub

> [!IMPORTANT]
> **Nebula V3 Spatial Intelligence Engine Knowledge Base**
> Welcome to the **Nebula Brain**. This central hub consolidates all architectural specifications, data sync contracts, UI component trees, operational deployment guides, security key schemas, and version archives for **Nebula V3**.

---

## ⚡ Quick Navigation Grid

| Knowledge Subsystem | Core Focus & Contents | Direct Link |
| :--- | :--- | :--- |
| **01. Secrets & Credentials** | API Keys, Firebase Config, Environment Variables | [[Secrets]] |
| **02. Architecture & Engine** | 60FPS Canvas, Cloud Sync, Node Math, 432Hz Audio | [[Spatial Engine]] • [[Cloud Sync & Storage]] • [[Thought Nodes & Tethers]] • [[Audio & Focus Engine]] |
| **03. Codebase & Components** | Complete React Component Map & Dependencies | [[Component Map]] |
| **04. Version History** | Changelog, V1/V2 Archives, Bug Resolutions | [[Version History & Archive]] |
| **05. Operations & DevOps** | Vercel Deployment, PWA Config, CDP Testing | [[Deployment & Operations]] |
| **06. Note Templates** | Feature Specs, Architecture Decision Records | [[Feature Spec Template]] • [[ADR Template]] |
| **07. Interactive Canvas** | Visual System Diagram & Data Flow Map | [[Nebula V3 System Map.canvas]] |
| **08. Bases & Views** | Structured Component & Hook Registries | [[Component Registry Base]] |

---

## 📊 Nebula V3 Core Status & Metrics

```
+-----------------------------------------------------------------------+
|                         NEBULA V3 SYSTEM METRICS                      |
+------------------------------------+----------------------------------+
| Frame Target: 60 FPS (requestAnim) | Primary URL: nebula-app-kappa.ver|
| Cloud Engine: Firebase Firestore  | Offline Engine: LocalStorage DB  |
| Audio Frequency: 432 Hz Ambient    | PWA Service Worker: Workbox 6SW  |
| Git Checkpoint: v3.0.0-prod        | Active Repository: nebula-app    |
+------------------------------------+----------------------------------+
```

---

## 🔑 Security & Environment Credentials

> [!WARNING]
> Production secrets and API tokens must **never** be committed to public Git repositories.
> Consult [[Secrets]] for sanitized schemas, local `.env` configuration, and Vercel environment variable setup.

---

## 🗺️ Architectural Highlights

### 1. Infinite Canvas & Smooth Pan/Zoom
The spatial engine renders node positions relative to a dynamic camera matrix (`camera.x`, `camera.y`, `camera.zoom`). Pan and zoom calculations utilize logarithmic trackpad scaling (`e.ctrlKey`) and smooth transform matrices.
- See: [[Spatial Engine]]

### 2. Firestore Jitter Protection
To prevent remote `onSnapshot` updates from overwriting cards during active user drag/edit operations, local edits update `lastLocalEditTimeRef.current`. Remote updates within 1500ms are safely ignored unless the cloud timestamp is strictly newer.
- See: [[Cloud Sync & Storage]]

### 3. Safe Tether & Controls Scoping
Header controls (Pin, Color, Edit, Delete) utilize `onPointerDown={(e) => e.stopPropagation()}` to prevent dragging card nodes during button clicks. Drag (+) handles calculate bounds safely using fallbacks (`w = node.width || 300`).
- See: [[Thought Nodes & Tethers]]

### 4. 432Hz Ambient Focus Audio
An interactive Web Audio API synthesizer generates harmonic 432Hz background waves for deep focus states, initialized lazily on user gesture.
- See: [[Audio & Focus Engine]]

---

## 🔄 Version Checkpoint & Rollback

To return to the current production-verified release at any time:

```bash
# Checkout production checkpoint tag
git checkout v3.0.0-prod

# Hard reset working directory to production state
git reset --hard v3.0.0-prod
```

For detailed version history and archive notes, see [[Version History & Archive]].

---

> [!TIP]
> **Obsidian Tip**: Use `Cmd + O` (macOS) or `Ctrl + O` (Windows) to quickly open any backlinked note in this vault.
