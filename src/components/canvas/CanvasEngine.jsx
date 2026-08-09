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
    const x = dx > 0 ? srcCenterX + halfWidth : srcCenterX - halfWidth;
    const y = srcCenterY + (dy * halfWidth) / Math.max(Math.abs(dx), 1);
    return { x, y };
  } else {
    const y = dy > 0 ? srcCenterY + halfHeight : srcCenterY - halfHeight;
    const x = srcCenterX + (dx * halfHeight) / Math.max(Math.abs(dy), 1);
    return { x, y };
  }
};

export const CanvasEngine = ({ onCanvasClick }) => {
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
    updateLink,
    deleteLink
  } = useSpace();

  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const mouseWorldRef = useRef({ x: 0, y: 0 });

  const marqueeRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const particles = [];
    const count = 1000;
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.25,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selection.linkId) {
        deleteLink(selection.linkId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection.linkId, deleteLink]);

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

      // Deep space background with cosmic radial nebula glow
      const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, Math.max(width, height));
      bgGradient.addColorStop(0, '#090d1f');
      bgGradient.addColorStop(0.5, '#040714');
      bgGradient.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Viewport matrix
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Grid Background
      const gridSize = 80;
      const startX = Math.floor((-camera.x / camera.zoom) / gridSize) * gridSize - gridSize * 2;
      const endX = Math.ceil((width - camera.x) / camera.zoom / gridSize) * gridSize + gridSize * 2;
      const startY = Math.floor((-camera.y / camera.zoom) / gridSize) * gridSize - gridSize * 2;
      const endY = Math.ceil((height - camera.y) / camera.zoom / gridSize) * gridSize + gridSize * 2;

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

      // 2. Infinite Pythagorean Gravity Nexus
      const particles = particlesRef.current;
      const mouseWorld = mouseWorldRef.current;
      const cellSize = 160;
      const gridBins = {};

      const viewMinX = -camera.x / camera.zoom - 1000;
      const viewMaxX = (width - camera.x) / camera.zoom + 1000;
      const viewMinY = -camera.y / camera.zoom - 1000;
      const viewMaxY = (height - camera.y) / camera.zoom + 1000;

      particles.forEach((p) => {
        if (p.x < viewMinX) p.x = viewMaxX;
        if (p.x > viewMaxX) p.x = viewMinX;
        if (p.y < viewMinY) p.y = viewMaxY;
        if (p.y > viewMaxY) p.y = viewMinY;

        const dxMouse = mouseWorld.x - p.x;
        const dyMouse = mouseWorld.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 320) {
          const force = (320 - distMouse) / 320 * 0.18;
          p.vx += (dxMouse / distMouse) * force;
          p.vy += (dyMouse / distMouse) * force;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        const colorHue = (p.id % 3 === 0) ? '6, 182, 212' : (p.id % 3 === 1) ? '168, 85, 247' : '16, 185, 129';
        ctx.fillStyle = `rgba(${colorHue}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius / Math.max(camera.zoom, 0.4), 0, Math.PI * 2);
        ctx.fill();

        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx}:${cy}`;
        if (!gridBins[key]) gridBins[key] = [];
        gridBins[key].push(p);
      });

      const processedPairs = new Set();
      ctx.lineWidth = 0.9 / camera.zoom;

      Object.keys(gridBins).forEach((key) => {
        const [cx, cy] = key.split(':').map(Number);
        const currentCellParticles = gridBins[key];

        for (let nx = cx - 1; nx <= cx + 1; nx++) {
          for (let ny = cy - 1; ny <= cy + 1; ny++) {
            const neighborParticles = gridBins[`${nx}:${ny}`];
            if (!neighborParticles) continue;

            currentCellParticles.forEach((p1) => {
              neighborParticles.forEach((p2) => {
                if (p1.id >= p2.id) return;
                const pairId = `${p1.id}_${p2.id}`;
                if (processedPairs.has(pairId)) return;
                processedPairs.add(pairId);

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < cellSize) {
                  const lineAlpha = (1 - dist / cellSize) * 0.28;
                  ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              });
            });
          }
        }
      });

      // 3. Render Links & Tethers
      links.forEach((link) => {
        const sourceNode = nodes[link.sourceId];
        const targetNode = nodes[link.targetId];

        if (!sourceNode || !targetNode) return;

        const srcAnchor = getCardAnchorPoint(sourceNode, targetNode);
        const tgtAnchor = getCardAnchorPoint(targetNode, sourceNode);

        const isSelected = selection.linkId === link.id;
        const palette = COLOR_MAP[link.color || 'cyan'] || COLOR_MAP.cyan;
        const isAutoTag = link.isAutoTag;

        const dx = tgtAnchor.x - srcAnchor.x;
        const dy = tgtAnchor.y - srcAnchor.y;

        const cp1x = srcAnchor.x + dx * 0.4;
        const cp1y = srcAnchor.y + (dy > 0 ? 30 : -30);
        const cp2x = tgtAnchor.x - dx * 0.4;
        const cp2y = tgtAnchor.y + (dy > 0 ? -30 : 30);

        ctx.save();
        if (isAutoTag) {
          ctx.setLineDash([6 / camera.zoom, 5 / camera.zoom]);
          ctx.strokeStyle = palette.main;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = isSelected ? '#ffffff' : palette.main;
        }

        ctx.lineWidth = (isSelected ? 3.8 : isAutoTag ? 1.8 : 2.4) / camera.zoom;
        ctx.beginPath();
        ctx.moveTo(srcAnchor.x, srcAnchor.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tgtAnchor.x, tgtAnchor.y);
        ctx.stroke();
        ctx.restore();

        // Flowing Energy Pulse Dot
        const impulseCount = isAutoTag ? 1 : 2;
        for (let i = 0; i < impulseCount; i++) {
          const progress = ((time * (isAutoTag ? 0.4 : 0.6) + i / impulseCount) % 1);
          const t = progress;
          const u = 1 - t;
          const tt = t * t;
          const uu = u * u;
          const uuu = uu * u;
          const ttt = tt * t;

          const px = uuu * srcAnchor.x + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * tgtAnchor.x;
          const py = uuu * srcAnchor.y + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * tgtAnchor.y;

          ctx.fillStyle = isAutoTag ? palette.main : '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, (isSelected ? 4.5 : 3.0) / camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }

        // Link Label Pill
        if (link.label) {
          const mx = 0.125 * srcAnchor.x + 0.375 * cp1x + 0.375 * cp2x + 0.125 * tgtAnchor.x;
          const my = 0.125 * srcAnchor.y + 0.375 * cp1y + 0.375 * cp2y + 0.125 * tgtAnchor.y;

          ctx.font = `500 ${Math.max(10, 11 / camera.zoom)}px Inter, sans-serif`;
          const textWidth = ctx.measureText(link.label).width;
          const pillPadding = 7;

          ctx.fillStyle = isSelected ? '#06b6d4' : isAutoTag ? 'rgba(3, 7, 18, 0.95)' : 'rgba(11, 15, 25, 0.95)';
          ctx.strokeStyle = palette.main;
          ctx.lineWidth = (isSelected ? 1.8 : 1) / camera.zoom;
          ctx.beginPath();
          ctx.roundRect(
            mx - textWidth / 2 - pillPadding,
            my - 10,
            textWidth + pillPadding * 2,
            20,
            10
          );
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isSelected ? '#ffffff' : isAutoTag ? palette.main : '#f3f4f6';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(link.label, mx, my);
        }
      });

      // 4. Marquee Selection Box
      if (marqueeRef.current) {
        const { startWorldX, startWorldY, currentWorldX, currentWorldY } = marqueeRef.current;
        const rectX = Math.min(startWorldX, currentWorldX);
        const rectY = Math.min(startWorldY, currentWorldY);
        const rectW = Math.abs(currentWorldX - startWorldX);
        const rectH = Math.abs(currentWorldY - startWorldY);

        ctx.strokeStyle = '#06b6d4';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.lineWidth = 1.5 / camera.zoom;
        ctx.setLineDash([4 / camera.zoom, 4 / camera.zoom]);
        ctx.beginPath();
        ctx.rect(rectX, rectY, rectW, rectH);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Active Tether Draft Line
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

        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(tetherDraft.x, tetherDraft.y, 7 / camera.zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [camera, nodes, links, selection, tetherDraft]);

  const handleWheel = (e) => {
    e.preventDefault();
    const isPinch = e.ctrlKey || Math.abs(e.deltaY) < 40;
    const zoomFactor = isPinch
      ? Math.pow(1.002, -e.deltaY)
      : e.deltaY < 0 ? 1.08 : 0.92;

    const newZoom = Math.min(Math.max(camera.zoom * zoomFactor, 0.15), 4.5);

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const newX = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom);
    const newY = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom);

    setCamera({ x: newX, y: newY, zoom: newZoom });
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 2 || e.spaceKey || activeTool === 'pan') {
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
      return;
    }

    if (e.target === canvasRef.current) {
      const worldPos = screenToWorld(e.clientX, e.clientY);

      if (activeTool === 'node') {
        createNode(worldPos.x, worldPos.y);
      } else {
        let clickedLink = null;
        links.forEach((link) => {
          const srcNode = nodes[link.sourceId];
          const tgtNode = nodes[link.targetId];
          if (!srcNode || !tgtNode) return;
          const mx = (srcNode.x + tgtNode.x) / 2;
          const my = (srcNode.y + tgtNode.y) / 2;
          const dist = Math.sqrt((worldPos.x - mx) ** 2 + (worldPos.y - my) ** 2);
          if (dist < 45) {
            clickedLink = link;
          }
        });

        if (clickedLink) {
          setSelection({ nodeIds: [], linkId: clickedLink.id });
        } else {
          marqueeRef.current = {
            startWorldX: worldPos.x,
            startWorldY: worldPos.y,
            currentWorldX: worldPos.x,
            currentWorldY: worldPos.y
          };
          onCanvasClick?.();
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    mouseWorldRef.current = worldPos;

    if (isPanningRef.current) {
      setCamera((prev) => ({
        ...prev,
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y
      }));
    } else if (marqueeRef.current) {
      marqueeRef.current.currentWorldX = worldPos.x;
      marqueeRef.current.currentWorldY = worldPos.y;
    } else if (tetherDraft) {
      setTetherDraft((prev) => (prev ? { ...prev, x: worldPos.x, y: worldPos.y } : null));
    }
  };

  const handleMouseUp = () => {
    if (isPanningRef.current) isPanningRef.current = false;

    if (marqueeRef.current) {
      const { startWorldX, startWorldY, currentWorldX, currentWorldY } = marqueeRef.current;
      const minX = Math.min(startWorldX, currentWorldX);
      const maxX = Math.max(startWorldX, currentWorldX);
      const minY = Math.min(startWorldY, currentWorldY);
      const maxY = Math.max(startWorldY, currentWorldY);

      if (maxX - minX > 10 && maxY - minY > 10) {
        const selectedIds = Object.values(nodes).filter((node) => {
          return (
            node.x + node.width >= minX &&
            node.x <= maxX &&
            node.y + node.height >= minY &&
            node.y <= maxY
          );
        }).map((n) => n.id);

        setSelection({ nodeIds: selectedIds, linkId: null });
      }

      marqueeRef.current = null;
    }
  };

  const handleDoubleClick = (e) => {
    if (e.target === canvasRef.current) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      let doubleClickedLink = null;

      links.forEach((link) => {
        const srcNode = nodes[link.sourceId];
        const tgtNode = nodes[link.targetId];
        if (!srcNode || !tgtNode) return;
        const mx = (srcNode.x + tgtNode.x) / 2;
        const my = (srcNode.y + tgtNode.y) / 2;
        const dist = Math.sqrt((worldPos.x - mx) ** 2 + (worldPos.y - my) ** 2);
        if (dist < 45) {
          doubleClickedLink = link;
        }
      });

      if (doubleClickedLink && !doubleClickedLink.isAutoTag) {
        setSelection({ nodeIds: [], linkId: doubleClickedLink.id });
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => e.preventDefault()}
      className={`absolute inset-0 block w-full h-full touch-none ${
        activeTool === 'pan' || isPanningRef.current ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    />
  );
};
