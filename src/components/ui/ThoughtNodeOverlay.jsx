import React, { useRef } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { FormattedText } from './FormattedText';
import { 
  Pin, 
  Trash2, 
  Edit3, 
  Link2, 
  Tag, 
  GripHorizontal,
  Plus,
  Scaling
} from 'lucide-react';

const COLOR_ACCENTS = {
  cyan: 'border-cyan-500/50 shadow-cyan-500/20 text-cyan-400 bg-cyan-500/10 hover:border-cyan-400',
  purple: 'border-purple-500/50 shadow-purple-500/20 text-purple-400 bg-purple-500/10 hover:border-purple-400',
  emerald: 'border-emerald-500/50 shadow-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:border-emerald-400',
  amber: 'border-amber-500/50 shadow-amber-500/20 text-amber-400 bg-amber-500/10 hover:border-amber-400',
  rose: 'border-rose-500/50 shadow-rose-500/20 text-rose-400 bg-rose-500/10 hover:border-rose-400',
  indigo: 'border-indigo-500/50 shadow-indigo-500/20 text-indigo-400 bg-indigo-500/10 hover:border-indigo-400',
};

export const ThoughtNodeOverlay = () => {
  const {
    nodes,
    camera,
    selection,
    setSelection,
    updateNode,
    moveNodes,
    deleteNode,
    setTetherDraft,
    createLink,
    setEditingNodeId
  } = useSpace();

  const draggingNodeRef = useRef(null);
  const dragLastPosRef = useRef({ x: 0, y: 0 });

  const isZoomedOut = camera.zoom < 0.45;

  const handlePointerDown = (e, node) => {
    e.stopPropagation();

    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      const alreadySelected = selection.nodeIds.includes(node.id);
      const newSelected = alreadySelected
        ? selection.nodeIds.filter((id) => id !== node.id)
        : [...selection.nodeIds, node.id];
      setSelection({ nodeIds: newSelected, linkId: null });
      return;
    }

    const isMulti = selection.nodeIds.length > 1 && selection.nodeIds.includes(node.id);
    const activeSelectedIds = isMulti ? selection.nodeIds : [node.id];
    setSelection({ nodeIds: activeSelectedIds, linkId: null });

    if (e.button === 0) {
      draggingNodeRef.current = node.id;
      dragLastPosRef.current = {
        x: (e.clientX - camera.x) / camera.zoom,
        y: (e.clientY - camera.y) / camera.zoom,
      };

      const handlePointerMove = (moveEvt) => {
        if (draggingNodeRef.current === node.id) {
          const currentWorldX = (moveEvt.clientX - camera.x) / camera.zoom;
          const currentWorldY = (moveEvt.clientY - camera.y) / camera.zoom;

          const deltaX = currentWorldX - dragLastPosRef.current.x;
          const deltaY = currentWorldY - dragLastPosRef.current.y;

          dragLastPosRef.current = { x: currentWorldX, y: currentWorldY };

          moveNodes(activeSelectedIds, deltaX, deltaY);
        }
      };

      const handlePointerUp = () => {
        draggingNodeRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
  };

  const startResize = (e, node) => {
    e.stopPropagation();
    e.preventDefault();

    const startWidth = node.width;
    const startHeight = node.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleResizeMove = (moveEvt) => {
      const deltaScreenX = moveEvt.clientX - startX;
      const deltaScreenY = moveEvt.clientY - startY;

      const newWidth = Math.max(220, startWidth + deltaScreenX / camera.zoom);
      const newHeight = Math.max(140, startHeight + deltaScreenY / camera.zoom);

      updateNode(node.id, { width: newWidth, height: newHeight });
    };

    const handleResizeUp = () => {
      window.removeEventListener('pointermove', handleResizeMove);
      window.removeEventListener('pointerup', handleResizeUp);
    };

    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', handleResizeUp);
  };

  const startTetherDraft = (e, sourceNodeId) => {
    e.stopPropagation();
    e.preventDefault();

    const sourceNode = nodes[sourceNodeId];
    if (!sourceNode) return;

    const initialWorldX = (e.clientX - camera.x) / camera.zoom;
    const initialWorldY = (e.clientY - camera.y) / camera.zoom;

    setTetherDraft({
      sourceId: sourceNodeId,
      x: initialWorldX,
      y: initialWorldY
    });

    const handleWindowPointerMove = (moveEvt) => {
      const worldX = (moveEvt.clientX - camera.x) / camera.zoom;
      const worldY = (moveEvt.clientY - camera.y) / camera.zoom;
      setTetherDraft({
        sourceId: sourceNodeId,
        x: worldX,
        y: worldY
      });
    };

    const handleWindowPointerUp = (upEvt) => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);

      const dropWorldX = (upEvt.clientX - camera.x) / camera.zoom;
      const dropWorldY = (upEvt.clientY - camera.y) / camera.zoom;

      const targetNode = Object.values(nodes).find((n) => {
        return (
          n.id !== sourceNodeId &&
          dropWorldX >= n.x - 30 &&
          dropWorldX <= n.x + n.width + 30 &&
          dropWorldY >= n.y - 30 &&
          dropWorldY <= n.y + n.height + 30
        );
      });

      if (targetNode) {
        createLink(sourceNodeId, targetNode.id);
      }

      setTetherDraft(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Object.values(nodes).map((node) => {
        const screenX = node.x * camera.zoom + camera.x;
        const screenY = node.y * camera.zoom + camera.y;
        const screenWidth = node.width * camera.zoom;
        const screenHeight = node.height * camera.zoom;
        const isSelected = selection.nodeIds.includes(node.id);
        const colorStyle = COLOR_ACCENTS[node.color || 'cyan'] || COLOR_ACCENTS.cyan;

        if (
          screenX + screenWidth < -200 ||
          screenX > window.innerWidth + 200 ||
          screenY + screenHeight < -200 ||
          screenY > window.innerHeight + 200
        ) {
          return null;
        }

        // Compact Collapsed Pill Card on Zoom Out (< 0.45x)
        if (isZoomedOut) {
          return (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(e, node)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingNodeId(node.id);
              }}
              style={{
                transform: `translate3d(${screenX}px, ${screenY}px, 0px)`,
                width: `${screenWidth}px`,
              }}
              className={`pointer-events-auto absolute left-0 top-0 rounded-xl border p-2.5 glass-card ${colorStyle} ${
                isSelected ? 'ring-2 ring-cyan-400 scale-105' : ''
              } flex items-center justify-between gap-2 overflow-hidden shadow-lg cursor-pointer`}
            >
              <div className="flex items-center gap-2 truncate">
                <div className={`w-2.5 h-2.5 rounded-full ${colorStyle.split(' ')[2]}`} />
                <span className="font-bold text-xs text-white truncate">
                  {node.title.replace(/^#+\s*/, '')}
                </span>
              </div>

              {node.tags && node.tags.length > 0 && (
                <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
                  #{node.tags[0]}
                </span>
              )}
            </div>
          );
        }

        return (
          <div
            key={node.id}
            onPointerDown={(e) => handlePointerDown(e, node)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingNodeId(node.id);
            }}
            style={{
              transform: `translate3d(${screenX}px, ${screenY}px, 0px)`,
              width: `${screenWidth}px`,
              minHeight: `${screenHeight}px`,
            }}
            className={`pointer-events-auto absolute left-0 top-0 rounded-2xl border transition-shadow duration-200 group flex flex-col justify-between p-4 glass-card ${colorStyle} ${
              isSelected ? 'ring-2 ring-cyan-400 shadow-2xl scale-[1.01]' : 'hover:scale-[1.005]'
            }`}
          >
            {/* Tether Anchor Handle Button */}
            <button
              onPointerDown={(e) => startTetherDraft(e, node.id)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-2 border-slate-900 shadow-glow-cyan flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-125 transition-all z-20 cursor-crosshair"
              title="Drag to tether to another card"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Bottom-Right Corner Resize Handle */}
            <div
              onPointerDown={(e) => startResize(e, node)}
              className="absolute right-1 bottom-1 p-1 text-slate-400 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize z-20"
              title="Drag to resize card"
            >
              <Scaling className="w-3.5 h-3.5" />
            </div>

            {/* Top Card Controls Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <GripHorizontal className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab text-slate-400 flex-shrink-0" />
                <FormattedText text={node.title} className="font-semibold text-slate-100 truncate text-sm tracking-wide" />
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateNode(node.id, { pinned: !node.pinned }, true);
                  }}
                  className={`p-1 rounded-md hover:bg-white/10 transition-colors ${
                    node.pinned ? 'text-amber-400' : 'text-slate-400'
                  }`}
                  title={node.pinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <button
                  onPointerDown={(e) => startTetherDraft(e, node.id)}
                  className="p-1 rounded-md hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-crosshair"
                  title="Drag connection tether"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(node.id);
                  }}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 transition-colors"
                  title="Edit details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="p-1 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete thought"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card Body with Rich Text Formatting & Interactive Task Checkboxes */}
            <div className="mb-3 overflow-hidden text-xs">
              <FormattedText
                text={node.content}
                onToggleCheckbox={(newContent) => updateNode(node.id, { content: newContent })}
              />
            </div>

            {/* Tags Footer & Color Selector */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {node.tags && node.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 opacity-60" />
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Node Color Swatch Picker */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {['cyan', 'purple', 'emerald', 'amber', 'rose'].map((c) => (
                  <button
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNode(node.id, { color: c }, true);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-transform hover:scale-125 ${
                      COLOR_ACCENTS[c].split(' ')[2]
                    }`}
                  />
                ))}
              </div>
            </div>

            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            )}
          </div>
        );
      })}
    </div>
  );
};
