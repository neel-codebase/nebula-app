import React, { useState, useEffect } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { Trash2, Check, Palette, X } from 'lucide-react';

const COLOR_ACCENTS = [
  { id: 'cyan', bg: 'bg-cyan-500', hex: '#06b6d4' },
  { id: 'purple', bg: 'bg-purple-500', hex: '#a855f7' },
  { id: 'emerald', bg: 'bg-emerald-500', hex: '#10b981' },
  { id: 'amber', bg: 'bg-amber-500', hex: '#f59e0b' },
  { id: 'rose', bg: 'bg-rose-500', hex: '#f43f5e' },
  { id: 'indigo', bg: 'bg-indigo-500', hex: '#6366f1' },
];

export const TetherEditorPopover = () => {
  const {
    selection,
    setSelection,
    links,
    nodes,
    camera,
    updateLink,
    deleteLink
  } = useSpace();

  const selectedLink = links.find((l) => l.id === selection.linkId);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (selectedLink) {
      setLabel(selectedLink.label || '');
    }
  }, [selectedLink]);

  if (!selectedLink) return null;

  const sourceNode = nodes[selectedLink.sourceId];
  const targetNode = nodes[selectedLink.targetId];

  if (!sourceNode || !targetNode) return null;

  // Calculate screen coordinates of midpoint between connected nodes
  const srcCenterX = sourceNode.x + sourceNode.width / 2;
  const srcCenterY = sourceNode.y + sourceNode.height / 2;
  const tgtCenterX = targetNode.x + targetNode.width / 2;
  const tgtCenterY = targetNode.y + target.height / 2;

  const midWorldX = (srcCenterX + tgtCenterX) / 2;
  const midWorldY = (srcCenterY + tgtCenterY) / 2;

  const screenX = midWorldX * camera.zoom + camera.x;
  const screenY = midWorldY * camera.zoom + camera.y;

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
    updateLink(selectedLink.id, { label: e.target.value.trim() || 'relates to' });
  };

  const handleColorSelect = (colorId) => {
    updateLink(selectedLink.id, { color: colorId });
  };

  return (
    <div
      style={{
        transform: `translate3d(${screenX}px, ${screenY - 45}px, 0px) translate(-50%, -100%)`,
      }}
      className="absolute left-0 top-0 z-40 glass-panel px-3 py-2 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2 animate-fadeIn"
    >
      {/* WYSIWYG Label Input */}
      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder="Tether label..."
        className="px-2.5 py-1 text-xs rounded-xl glass-input font-medium w-36 text-white"
        autoFocus
      />

      {/* Color Swatch Selector */}
      <div className="flex items-center gap-1 border-l border-white/10 pl-2">
        {COLOR_ACCENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleColorSelect(c.id)}
            className={`w-4 h-4 rounded-full ${c.bg} flex items-center justify-center transition-all ${
              (selectedLink.color || 'cyan') === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {(selectedLink.color || 'cyan') === c.id && <Check className="w-2.5 h-2.5 text-white" />}
          </button>
        ))}
      </div>

      {/* Delete Tether Button */}
      <button
        onClick={() => deleteLink(selectedLink.id)}
        className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors ml-1"
        title="Delete Tether Connection"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Close Popover Button */}
      <button
        onClick={() => setSelection({ nodeIds: selection.nodeIds, linkId: null })}
        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
