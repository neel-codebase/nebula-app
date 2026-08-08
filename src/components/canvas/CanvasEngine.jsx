import React, { useRef, useEffect, useCallback } from 'react';
import { useSpace } from '../../context/SpaceContext';

const COLOR_MAP = {
  cyan: { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.1)' },
  purple: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.1)' },
  emerald: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.1)' },
  amber: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.1)' },
  rose: { main: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', bg: 'rgba(244, 63, 94, 0.1)' },
  indigo: { main: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', bg: 'rgba(99, 102, 241, 0.1)' },
};

// Calculate perimeter anchor point on rectangular node card
const getCardAnchorPoint = (source, target) => {
  const srcCenterX = source.x + source.width / 2;
  const srcCenterY = source.y + source.height / 2;
  const tgtCenterX = target.x + target.width / 2;
  const tgtCenterY = target.y + target.height / 2;

  const dx = tgtCenterX - srcCenterX;
  const dy = tgtCenterY - srcCenterY;

  const halfWidth = source.width / 2;
  const halfHeight = source.height / 2;

  if (Math.abs(dx) * halfHeight > Math.abs(dy) * halfWidth) {
    // Intersects left or right edge
    const x = dx > 0 ? srcCenterX + halfWidth : srcCenterX - halfWidth;
    const y = srcCenterY + (dy * halfWidth) / Math.abs(dx);
    return { x, y };
  } else {
    // Intersects top or bottom edge
    const y = dy > 0 ? srcCenterY + halfHeight : srcCenterY - halfHeight;
    const x = srcCenterX + (dx * halfHeight) / Math.abs(dy);
    return { x, y };
  }
};

export const CanvasEngine = ({ onNodeSelect, onCanvasClick }) => {
  const canvasRef = useRef(null);
  const {
    nodes,
    links,
    camera,
    setCamera,
    selection,
    setSelection,
    activeTool,
    tetherDraft,
    setTetherDraft,
    createNode,
    createLink
  } = useSpace();

  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Generate background ambient particles once
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.4 + 0.1,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Screen to World transformation helper
  const screenToWorld = useCallback((screenX, screenY) => {
    return {
      x: (screenX - camera.x) / camera.zoom,
      y: (screenY - camera.y) / camera.zoom,
    };
  }, [camera]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.015;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Clear background (Obsidian space)
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Parallax Background Grid & Starfield
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.zoom, camera.zoom);

      // Draw Grid Lines
      const gridSize = 80;
      const startX = Math.floor((-camera.x / camera.zoom) / gridSize) * gridSize - gridSize;
      const endX = Math.ceil((width - camera.x) / camera.zoom / gridSize) * gridSize + gridSize;
      const startY = Math.floor((-camera.y / camera.zoom) / gridSize) * gridSize - gridSize;
      const endY = Math.ceil((height - camera.y) / camera.zoom / gridSize) * gridSize + gridSize;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1 / camera.zoom;
      ctx.beginPath();

      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();

      // Draw Parallax Particles / Starfield
      particlesRef.current.forEach((p) => {
        const px = p.x;
        const py = p.y + Math.sin(time + p.x) * 4;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size / Math.max(camera.zoom, 0.5), 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Links & Tethers
      links.forEach((link) => {
        const sourceNode = nodes[link.sourceId];
        const targetNode = nodes[link.targetId];

        if (!sourceNode || !targetNode) return;

        const srcAnchor = getCardAnchorPoint(sourceNode, targetNode);
        const tgtAnchor = getCardAnchorPoint(targetNode, sourceNode);

        const isSelected = selection.linkId === link.id;
        const palette = COLOR_MAP[link.color || 'cyan'] || COLOR_MAP.cyan;

        // Curve Control Points for Cubic Bezier
        const dx = tgtAnchor.x - srcAnchor.x;
        const dy = tgtAnchor.y - srcAnchor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const cp1x = srcAnchor.x + dx * 0.4;
        const cp1y = srcAnchor.y + (dy > 0 ? 30 : -30);
        const cp2x = tgtAnchor.x - dx * 0.4;
        const cp2y = tgtAnchor.y + (dy > 0 ? -30 : 30);

        // Draw Outer Tether Glow
        ctx.strokeStyle = isSelected ? palette.main : palette.glow;
        ctx.lineWidth = (isSelected ? 3.5 : 2.0) / camera.zoom;
        ctx.beginPath();
        ctx.moveTo(srcAnchor.x, srcAnchor.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tgtAnchor.x, tgtAnchor.y);
        ctx.stroke();

        // Draw Flowing Impulse Particles along link
        const impulseCount = 2;
        for (let i = 0; i < impulseCount; i++) {
          const progress = ((time * 0.6 + i / impulseCount) % 1);
          // Cubic Bezier interpolation formula
          const t = progress;
          const u = 1 - t;
          const tt = t * t;
          const uu = u * u;
          const uuu = uu * u;
          const ttt = tt * t;

          const px = uuu * srcAnchor.x + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * tgtAnchor.x;
          const py = uuu * srcAnchor.y + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * tgtAnchor.y;

          ctx.fillStyle = palette.main;
          ctx.beginPath();
          ctx.arc(px, py, (isSelected ? 4.5 : 3.0) / camera.zoom, 0, Math.PI * 2);
          ctx.fill();

          // Particle Glow Ring
          ctx.fillStyle = palette.glow;
          ctx.beginPath();
          ctx.arc(px, py, (isSelected ? 8.0 : 6.0) / camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Link Label Pill at curve midpoint
        if (link.label) {
          const midT = 0.5;
          const midU = 0.5;
          const mx = 0.125 * srcAnchor.x + 0.375 * cp1x + 0.375 * cp2x + 0.125 * tgtAnchor.x;
          const my = 0.125 * srcAnchor.y + 0.375 * cp1y + 0.375 * cp2y + 0.125 * tgtAnchor.y;

          ctx.font = `500 ${Math.max(11, 12 / camera.zoom)}px Inter, sans-serif`;
          const textWidth = ctx.measureText(link.label).width;
          const pillPadding = 8;

          ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
          ctx.strokeStyle = palette.main;
          ctx.lineWidth = 1 / camera.zoom;
          ctx.beginPath();
          ctx.roundRect(
            mx - textWidth / 2 - pillPadding,
            my - 11,
            textWidth + pillPadding * 2,
            22,
            11
          );
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f3f4f6';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(link.label, mx, my);
        }
      });

      // 4. Draw Active Tether Draft Line (when dragging tether handle)
      if (tetherDraft && nodes[tetherDraft.sourceId]) {
        const srcNode = nodes[tetherDraft.sourceId];
        const srcAnchor = {
          x: srcNode.x + srcNode.width / 2,
          y: srcNode.y + srcNode.height / 2
        };

        ctx.setLineDash([8 / camera.zoom, 6 / camera.zoom]);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5 / camera.zoom;

        ctx.beginPath();
        ctx.moveTo(srcAnchor.x, srcAnchor.y);
        ctx.lineTo(tetherDraft.x, tetherDraft.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Cursor Particle
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(tetherDraft.x, tetherDraft.y, 6 / camera.zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [camera, nodes, links, selection, tetherDraft]);

  // Handle Wheel Event for Smooth Exponential Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(camera.zoom * zoomFactor, 0.15), 4.5);

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const newX = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom);
    const newY = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom);

    setCamera({ x: newX, y: newY, zoom: newZoom });
  };

  // Handle Mouse Down (Pan or Select Canvas)
  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 2 || e.spaceKey || activeTool === 'pan') {
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
      return;
    }

    if (e.target === canvasRef.current) {
      if (activeTool === 'node') {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        createNode(worldPos.x, worldPos.y);
      } else {
        onCanvasClick?.();
      }
    }
  };

  // Handle Mouse Move
  const handleMouseMove = (e) => {
    if (isPanningRef.current) {
      setCamera((prev) => ({
        ...prev,
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y
      }));
    } else if (tetherDraft) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      setTetherDraft((prev) => (prev ? { ...prev, x: worldPos.x, y: worldPos.y } : null));
    }
  };

  // Handle Mouse Up
  const handleMouseUp = (e) => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
    }
    if (tetherDraft) {
      // Check if dropped over a target node card
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const targetNode = Object.values(nodes).find((n) => {
        return (
          n.id !== tetherDraft.sourceId &&
          worldPos.x >= n.x &&
          worldPos.x <= n.x + n.width &&
          worldPos.y >= n.y &&
          worldPos.y <= n.y + n.height
        );
      });

      if (targetNode) {
        createLink(tetherDraft.sourceId, targetNode.id);
      }
      setTetherDraft(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`absolute inset-0 block w-full h-full touch-none ${
        activeTool === 'pan' || isPanningRef.current ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    />
  );
};
