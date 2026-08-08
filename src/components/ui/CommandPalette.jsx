import React, { useState, useEffect } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  Maximize2, 
  RotateCcw, 
  Sparkles,
  Tag,
  ArrowRight,
  X
} from 'lucide-react';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    nodes,
    setCamera,
    setSelection,
    createNode,
    autoLayout,
    fitView,
    resetView
  } = useSpace();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const nodeArray = Object.values(nodes);
  const filteredNodes = nodeArray.filter((n) => {
    const q = query.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const handleSelectNode = (node) => {
    setSelection({ nodeIds: [node.id], linkId: null });
    setCamera({
      x: window.innerWidth / 2 - (node.x + node.width / 2) * 1.2,
      y: window.innerHeight / 2 - (node.y + node.height / 2) * 1.2,
      zoom: 1.2
    });
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search thoughts, tags, or system commands..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results / Action List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {/* Quick System Actions */}
          {query.trim() === '' && (
            <div className="mb-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                Quick Actions
              </div>

              <button
                onClick={() => {
                  createNode(null, null, 'New Thought', 'cyan');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Create New Thought</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => {
                  autoLayout();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-purple-500/20 hover:text-purple-300 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                  <span>Auto-Layout Graph Cluster</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => {
                  fitView();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>Focus All Thoughts in View</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}

          {/* Spatial Thoughts Match List */}
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
            Thoughts ({filteredNodes.length})
          </div>

          {filteredNodes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching thoughts found for "{query}".
            </div>
          ) : (
            filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelectNode(node)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/10 transition-all group border border-transparent hover:border-white/10"
              >
                <div className="overflow-hidden pr-2">
                  <div className="font-semibold text-xs text-white truncate group-hover:text-cyan-300">
                    {node.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {node.content}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {node.tags && node.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
