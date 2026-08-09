---
title: Spatial Canvas Engine Architecture
type: obsidian-architecture
version: 3.0.0
tags:
  - nebula/architecture
  - canvas-engine
  - html5-canvas
  - 60fps
---

# 🎨 Spatial Canvas Engine Architecture

Backlinks: [[Master View]] • [[Thought Nodes & Tethers]] • [[Component Map]]

The **Spatial Canvas Engine** ([CanvasEngine.jsx](file:///Users/neo/nEO-apps/app-3/src/components/canvas/CanvasEngine.jsx)) provides an ultra-smooth, 60FPS infinite workspace rendering spatial grid lines, connection tethers, particle effects, and background gradients.

---

## 📐 Coordinate Systems & Transforms

The spatial canvas operates across two coordinate spaces:

1. **Screen Coordinates** $(X_{screen}, Y_{screen})$: Pixels relative to the viewport top-left $(0,0)$.
2. **World Coordinates** $(X_{world}, Y_{world})$: Infinite 2D space coordinates assigned to node positions.

### Transformation Formula

To project a world point to screen space:
$$X_{screen} = (X_{world} \cdot \text{zoom}) + \text{camera.x}$$
$$Y_{screen} = (Y_{world} \cdot \text{zoom}) + \text{camera.y}$$

To project a screen point (e.g. mouse click) back to world space:
$$X_{world} = \frac{X_{screen} - \text{camera.x}}{\text{zoom}}$$
$$Y_{world} = \frac{Y_{screen} - \text{camera.y}}{\text{zoom}}$$

---

## 🔍 Logarithmic Trackpad Pinch Zoom

Trackpads on macOS emit `wheel` events with `e.ctrlKey === true` during pinch-to-zoom gestures. Standard linear multipliers cause erratic zooming jumps.

Nebula V3 implements logarithmic scale bounds in `handleWheel`:

```javascript
// src/components/canvas/CanvasEngine.jsx
if (e.ctrlKey) {
  // Trackpad pinch-to-zoom logarithmic scaling factor
  const zoomFactor = Math.pow(0.992, e.deltaY);
  const newZoom = Math.min(Math.max(camera.zoom * zoomFactor, 0.15), 3.5);

  // Focus zoom center around mouse pointer
  const mouseWorldX = (e.clientX - camera.x) / camera.zoom;
  const mouseWorldY = (e.clientY - camera.y) / camera.zoom;

  setCamera({
    zoom: newZoom,
    x: e.clientX - mouseWorldX * newZoom,
    y: e.clientY - mouseWorldY * newZoom
  });
}
```

---

## 🎮 Canvas Rendering Pipeline

Each frame rendered inside `requestAnimationFrame` performs:

1. **Background Grid**: Dynamic dot grid scaling dynamically based on `camera.zoom`.
2. **Bezier Tether Connections**: Smooth cubic bezier curves drawn between connected nodes:
   ```javascript
   ctx.beginPath();
   ctx.moveTo(start.x, start.y);
   ctx.bezierCurveTo(
     start.x + controlDist, start.y,
     end.x - controlDist, end.y,
     end.x, end.y
   );
   ctx.stroke();
   ```
3. **Active Tether Preview**: Real-time rendering of connection lines while dragging from a node (+) handle.
