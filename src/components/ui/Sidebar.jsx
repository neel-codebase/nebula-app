import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  X, 
  Search, 
  Tag, 
  Compass, 
  Sparkles, 
  Pin, 
  Trash2
} from 'lucide-react';

export const Sidebar = () => {
  const {
    nodes,
    links,
    isSidebarOpen,
    setIsSidebarOpen,
    setCamera,
    setSelection,
    deleteNode,
    autoLayout
  } = useSpace();

  const [selectedTag, setSelectedTag] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isSidebarOpen) return null;

  const nodeArray = Object.values(nodes);
  
  const allTags = Array.from(
    new Set(nodeArray.flatMap((n) => n.tags || []))
  );

  const filteredNodes = nodeArray.filter((node) => {
    const matchesQuery =
      node.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesTag = !selectedTag || (node.tags && node.tags.includes(selectedTag));
    return matchesQuery && matchesTag;
  });

  // Step 5: Sort pinned notes to top of sidebar index
  filteredNodes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const focusNode = (node) => {
    setSelection({ nodeIds: [node.id], linkId: null });
    setCamera({
      x: window.innerWidth / 2 - (node.x + node.width / 2) * 1.1,
      y: window.innerHeight / 2 - (node.y + node.height / 2) * 1.1,
      zoom: 1.1
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-80 glass-panel border-r border-white/10 p-4 flex flex-col justify-between shadow-2xl animate-slideRight">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm text-white">Thought Index</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter thoughts..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
          />
        </div>

        {/* Tags Quick Bar */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4 pb-3 border-b border-white/10">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                !selectedTag
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              All ({nodeArray.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Thoughts List (Sorted by Pinned First) */}
        <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => focusNode(node)}
              className={`p-3 rounded-xl border transition-all group flex items-start justify-between gap-2 cursor-pointer ${
                node.pinned
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400'
                  : 'bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 mb-1">
                  {node.pinned && <Pin className="w-3 h-3 text-amber-400 flex-shrink-0 fill-amber-400/20" />}
                  <h4 className="font-semibold text-xs text-white truncate group-hover:text-cyan-300">
                    {node.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {node.content}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex-shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span>Graph Density</span>
          <span className="font-mono text-cyan-400">
            {nodeArray.length > 1 ? ((links.length / (nodeArray.length * (nodeArray.length - 1))) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <button
          onClick={autoLayout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Layout Graph</span>
        </button>
      </div>
    </aside>
  );
};
