import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  X, 
  Search, 
  Tag, 
  Compass, 
  Sparkles, 
  Pin, 
  Trash2,
  Plus,
  Globe2,
  Edit2,
  Check
} from 'lucide-react';

export const Sidebar = () => {
  const {
    nodes,
    links,
    galaxyMaps,
    activeGalaxyId,
    createGalaxyMap,
    switchGalaxyMap,
    deleteGalaxyMap,
    renameGalaxyMap,
    isSidebarOpen,
    setIsSidebarOpen,
    setCamera,
    setSelection,
    deleteNode,
    autoLayout
  } = useSpace();

  const [selectedTag, setSelectedTag] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [editingGalaxyId, setEditingGalaxyId] = useState(null);
  const [editingName, setEditingName] = useState('');

  if (!isSidebarOpen) return null;

  const nodeArray = Object.values(nodes || {});
  
  const allTags = Array.from(
    new Set(nodeArray.flatMap((n) => n.tags || []))
  );

  const filteredNodes = nodeArray.filter((node) => {
    const matchesQuery =
      (node.title || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
      (node.content || '').toLowerCase().includes(filterQuery.toLowerCase());
    const matchesTag = !selectedTag || (node.tags && node.tags.includes(selectedTag));
    return matchesQuery && matchesTag;
  });

  filteredNodes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const focusNode = (node) => {
    setSelection({ nodeIds: [node.id], linkId: null });
    setCamera({
      x: window.innerWidth / 2 - (node.x + node.width / 2) * 1.1,
      y: window.innerHeight / 2 - (node.y + node.height / 2) * 1.1,
      zoom: 1.1
    });
  };

  const handleStartRename = (e, galaxy) => {
    e.stopPropagation();
    setEditingGalaxyId(galaxy.id);
    setEditingName(galaxy.name);
  };

  const handleSaveRename = (e, galaxyId) => {
    e.stopPropagation();
    renameGalaxyMap(galaxyId, editingName);
    setEditingGalaxyId(null);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-80 glass-panel border-r border-white/10 p-4 flex flex-col justify-between shadow-2xl animate-slideRight overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="font-bold text-sm text-white tracking-wide">Nebula Spatial Hub</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Multi-Galaxy Maps Manager */}
        <div className="mb-4 pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Galaxy Maps</span>
            </span>

            <button
              onClick={() => createGalaxyMap()}
              className="px-2 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-all flex items-center gap-1 shadow-glow-cyan"
            >
              <Plus className="w-3 h-3" />
              <span>New Galaxy Map</span>
            </button>
          </div>

          {/* List of Galaxy Maps */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {Object.values(galaxyMaps || {}).map((galaxy) => {
              const isActive = galaxy.id === activeGalaxyId;
              const nodeCount = Object.keys(galaxy.nodes || {}).length;
              const isEditing = editingGalaxyId === galaxy.id;

              return (
                <div
                  key={galaxy.id}
                  onClick={() => switchGalaxyMap(galaxy.id)}
                  className={`p-2 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 border-cyan-500/40 text-white shadow-glow-cyan'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(e, galaxy.id)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="px-1.5 py-0.5 rounded bg-black/50 text-white text-xs w-full outline-none border border-cyan-500/50"
                      />
                    ) : (
                      <span className="font-semibold truncate">{galaxy.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-400">
                      {nodeCount} cards
                    </span>

                    {isEditing ? (
                      <button
                        onClick={(e) => handleSaveRename(e, galaxy.id)}
                        className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleStartRename(e, galaxy)}
                        className="p-1 rounded opacity-0 hover:opacity-100 hover:bg-white/10 text-slate-400 hover:text-white transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}

                    {Object.keys(galaxyMaps).length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGalaxyMap(galaxy.id);
                        }}
                        className="p-1 rounded opacity-0 hover:opacity-100 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Thought Index & Tag Filter */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Thought Index ({filteredNodes.length})
            </span>
          </div>

          {/* Filter Search Input */}
          <div className="relative mb-2.5 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter thoughts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass-input"
            />
          </div>

          {/* Tags Quick Bar */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mb-2.5 pb-2 border-b border-white/10 shrink-0">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                  !selectedTag
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                All
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

          {/* Thoughts Cards List */}
          <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => focusNode(node)}
                className={`p-2.5 rounded-xl border transition-all group flex items-start justify-between gap-2 cursor-pointer ${
                  node.pinned
                    ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400'
                    : 'bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-0.5">
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

        {/* Footer Controls */}
        <div className="pt-3 border-t border-white/10 text-xs text-slate-400 space-y-2 shrink-0">
          <div className="flex justify-between items-center text-[11px]">
            <span>Graph Density</span>
            <span className="font-mono text-cyan-400">
              {nodeArray.length > 1 ? ((links.length / (nodeArray.length * (nodeArray.length - 1))) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <button
            onClick={autoLayout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-all shadow-glow-cyan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Layout Graph</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
