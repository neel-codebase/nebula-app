import React, { useRef } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  Pin, 
  Trash2, 
  Edit3, 
  Link2, 
  Tag, 
  GripHorizontal,
  Plus
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
    deleteNode,
    setTetherDraft,
    setEditingNodeId
  } = useSpace();

  const draggingNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e, node) => {
    e.stopPropagation();
    setSelection({ nodeIds: [node.id], linkId: null });

    if (e.button === 0) {
      draggingNodeRef.current = node.id;
      const screenX = e.clientX;
      const screenY = e.clientY;
      dragOffsetRef.current = {
        x: (screenX - camera.x) / camera.zoom - node.x,
        y: (screenY - camera.y) / camera.zoom - node.y,
      };

      const handlePointerMove = (moveEvt) => {
        if (draggingNodeRef.current === node.id) {
          const currentWorldX = (moveEvt.clientX - camera.x) / camera.zoom;
          const currentWorldY = (moveEvt.clientY - camera.y) / camera.zoom;

          updateNode(node.id, {
            x: currentWorldX - dragOffsetRef.current.x,
            y: currentWorldY - dragOffsetRef.current.y,
          });
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

  const startTetherDraft = (e, nodeId) => {
    e.stopPropagation();
    const node = nodes[nodeId];
    if (!node) return;
    setTetherDraft({
      sourceId: nodeId,
      x: node.x + node.width / 2,
      y: node.y + node.height / 2
    });
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
            {/* Dedicated Tether Anchor UI Button (Right Edge Handle) */}
            <button
              onMouseDown={(e) => startTetherDraft(e, node.id)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-500 text-white border-2 border-slate-900 shadow-glow-cyan flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-125 transition-all z-20"
              title="Drag to tether to another card"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Top Card Controls Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <GripHorizontal className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab text-slate-400 flex-shrink-0" />
                <h3 className="font-semibold text-slate-100 truncate text-sm tracking-wide">
                  {node.title}
                </h3>
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
                  onClick={(e) => startTetherDraft(e, node.id)}
                  className="p-1 rounded-md hover:bg-cyan-500/20 text-cyan-400 transition-colors"
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

            {/* Card Content Body */}
            <p className="text-slate-300 text-xs leading-relaxed line-clamp-4 font-normal mb-3 whitespace-pre-wrap">
              {node.content}
            </p>

            {/* Tags Footer & Color Selector */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {node.tags && node.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 opacity-60" />
                    {tag}
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

            {/* Glowing Corner Indicator */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            )}
          </div>
        );
      })}
    </div>
  );
};
