import React from 'react';
import { useSpace } from '../../context/SpaceContext';

export const Minimap = () => {
  const { nodes, camera, setCamera } = useSpace();
  const nodeArray = Object.values(nodes);

  if (nodeArray.length === 0) return null;

  // Compute graph bounds
  let minX = -1000, minY = -1000, maxX = 1000, maxY = 1000;
  nodeArray.forEach((n) => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  });

  const width = 160;
  const height = 110;

  const boundsWidth = Math.max(maxX - minX, 1000);
  const boundsHeight = Math.max(maxY - minY, 1000);

  const scaleX = width / boundsWidth;
  const scaleY = height / boundsHeight;
  const scale = Math.min(scaleX, scaleY);

  // Compute camera viewport rect on minimap
  const viewWorldX = -camera.x / camera.zoom;
  const viewWorldY = -camera.y / camera.zoom;
  const viewWorldW = window.innerWidth / camera.zoom;
  const viewWorldH = window.innerHeight / camera.zoom;

  const rectX = (viewWorldX - minX) * scale;
  const rectY = (viewWorldY - minY) * scale;
  const rectW = viewWorldW * scale;
  const rectH = viewWorldH * scale;

  const handleMinimapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    setCamera((prev) => ({
      ...prev,
      x: window.innerWidth / 2 - targetWorldX * prev.zoom,
      y: window.innerHeight / 2 - targetWorldY * prev.zoom,
    }));
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 pointer-events-none hidden md:block">
      <div
        onClick={handleMinimapClick}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="pointer-events-auto relative glass-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer hover:border-cyan-500/40 transition-colors"
        title="Click to teleport view"
      >
        {/* Node dots */}
        {nodeArray.map((node) => {
          const nx = (node.x - minX) * scale;
          const ny = (node.y - minY) * scale;
          const nw = Math.max(node.width * scale, 4);
          const nh = Math.max(node.height * scale, 3);

          return (
            <div
              key={node.id}
              style={{
                left: `${nx}px`,
                top: `${ny}px`,
                width: `${nw}px`,
                height: `${nh}px`,
              }}
              className="absolute bg-cyan-400/70 rounded-xs shadow-glow-cyan"
            />
          );
        })}

        {/* Viewport Box */}
        <div
          style={{
            left: `${Math.max(0, Math.min(width, rectX))}px`,
            top: `${Math.max(0, Math.min(height, rectY))}px`,
            width: `${Math.max(12, Math.min(width, rectW))}px`,
            height: `${Math.max(12, Math.min(height, rectH))}px`,
          }}
          className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded-md pointer-events-none shadow-glow-cyan"
        />
      </div>
    </div>
  );
};
