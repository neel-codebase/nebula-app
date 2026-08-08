import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  MousePointer, 
  Plus, 
  Hand, 
  Link2, 
  LayoutGrid, 
  Maximize2, 
  RotateCcw, 
  Search,
  Download,
  Upload
} from 'lucide-react';

export const CommandBar = () => {
  const {
    activeTool,
    setActiveTool,
    createNode,
    autoLayout,
    resetView,
    fitView,
    setIsCommandPaletteOpen,
    nodes,
    links
  } = useSpace();

  // Export spatial graph to JSON file
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, links }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nebula_space_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 glass-panel p-2 rounded-2xl shadow-2xl border border-white/10">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-lg transition-all ${
              activeTool === 'select'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title="Select & Move Tool (V)"
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('pan')}
            className={`p-2 rounded-lg transition-all ${
              activeTool === 'pan'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title="Pan Camera Tool (H / Space)"
          >
            <Hand className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-white/10 my-auto" />

        {/* Primary Creation Action */}
        <button
          onClick={() => createNode(null, null, 'New Thought', 'cyan')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-glow-cyan transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Thought</span>
        </button>

        <div className="h-5 w-px bg-white/10 my-auto" />

        {/* Canvas Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={autoLayout}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Auto-Layout Cluster"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={fitView}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Fit All Nodes in View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Reset View 100%"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Command Palette (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={handleExport}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Export Graph JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
