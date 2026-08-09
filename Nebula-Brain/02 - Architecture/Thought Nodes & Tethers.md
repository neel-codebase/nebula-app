---
title: Thought Nodes & Tethers Specification
type: obsidian-architecture
version: 3.0.0
tags:
  - nebula/architecture
  - thought-nodes
  - tethers
  - interaction-math
---

# 🔗 Thought Nodes & Tethers Specification

Backlinks: [[Master View]] • [[Spatial Engine]] • [[Cloud Sync & Storage]] • [[Component Map]]

The **Thought Node & Tether Subsystem** manages the spatial representation of user ideas, card UI controls, link attachments, and hashtag auto-tethering.

---

## 📇 Node Schema Definition

Every node object stored in state contains guaranteed spatial coordinates and styling metadata:

```typescript
interface ThoughtNode {
  id: string;             // Unique node UUID
  title: string;          // Heading text
  content: string;        // Markdown description text
  x: number;              // World X position
  y: number;              // World Y position
  width: number;          // Card width (default: 300px)
  height: number;         // Card height (default: 200px)
  color: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
  pinned?: boolean;       // Lock card against movement
  createdAt: number;      // Epoch timestamp
}
```

---

## 🛡️ Safe Tether Bounds & Fallbacks

When drawing tether lines or calculating attachment anchor points from node handles (+), nodes missing explicit height/width fields (e.g. from imported JSON notes) could cause `NaN` coordinates and freeze canvas rendering.

Nebula V3 enforces explicit bounds fallbacks in [ThoughtNodeOverlay.jsx](file:///Users/neo/nEO-apps/app-3/src/components/ui/ThoughtNodeOverlay.jsx):

```javascript
// Guaranteed dimension fallbacks in ThoughtNodeOverlay.jsx
const w = node.width || 300;
const h = node.height || 200;

// Right-side tether handle (+) center anchor point
const handleX = node.x + w;
const handleY = node.y + h / 2;
```

---

## 🛑 Control Click Propagation Scope

Clicking action buttons on a card header (Pin, Edit, Color Swatches, Delete) previously bubbled down to the card container, triggering node drag selection or canvas panning.

Header control buttons enforce event propagation stopping:

```jsx
<button
  onPointerDown={(e) => e.stopPropagation()}
  onClick={(e) => {
    e.stopPropagation();
    deleteNode(node.id);
  }}
  className="hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-1.5 rounded-lg"
>
  <Trash2 className="w-3.5 h-3.5" />
</button>
```

---

## 🏷️ Hashtag Auto-Tethering Engine

Nebula V3 features an automated hashtag parser ([tagParser.js](file:///Users/neo/nEO-apps/app-3/src/utils/tagParser.js)). When a user types matching `#hashtags` inside two separate cards (e.g. `#architecture`), Nebula automatically constructs a tether connection between the nodes.
