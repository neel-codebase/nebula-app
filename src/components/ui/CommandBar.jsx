import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  MousePointer, 
  Plus, 
  Hand, 
  LayoutGrid, 
  Maximize2, 
  RotateCcw, 
  Search,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Send
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
    links,
    isAudioActive,
    toggleAmbientAudio
  } = useSpace();

  const [quickNote, setQuickNote] = useState('');

  const handleQuickDrop = (e) => {
    if (e.key === 'Enter' && quickNote.trim()) {
      e.preventDefault();
      createNode(null, null, quickNote.trim(), 'cyan');
      setQuickNote('');
    }
  };

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
      <div className="pointer-events-auto flex items-center gap-2 glass-panel p-2 rounded-2xl shadow-2xl border border-white/10">
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

        {/* Quick Note Drop Input Box */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 focus-within:border-cyan-500/50 transition-colors">
          <input
            type="text"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            onKeyDown={handleQuickDrop}
            placeholder="Type thought & press Enter to drop into space..."
            className="w-48 sm:w-64 bg-transparent text-white placeholder-slate-400 text-xs focus:outline-none"
          />
          <button
            onClick={() => {
              if (quickNote.trim()) {
                createNode(null, null, quickNote.trim(), 'cyan');
                setQuickNote('');
              }
            }}
            className="p-1 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="Drop Note"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-white/10 my-auto" />

        {/* Canvas Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={autoLayout}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Cluster Orbit Constellation"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={fitView}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            title="Focus All Thoughts in View"
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
            onClick={toggleAmbientAudio}
            className={`p-2 rounded-xl transition-colors ${
              isAudioActive ? 'text-purple-400 bg-purple-500/20' : 'text-slate-300 hover:text-purple-400 hover:bg-white/10'
            }`}
            title="Ambient Focus Soundscape"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
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
