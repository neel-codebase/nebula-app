import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Network, 
  Zap, 
  ShieldCheck, 
  Compass,
  Cpu,
  Workflow
} from 'lucide-react';

export const LandingPage = ({ onClose }) => {
  const { createNode, createLink } = useSpace();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLaunchTemplate = (templateType) => {
    if (templateType === 'roadmap') {
      const n1 = createNode(-300, -50, '🎯 Q3 Strategic Objectives', 'cyan', '## Core Priorities\n- [x] Launch Nebula v3.0 Engine\n- [ ] Expand #spatial intelligence\n- [ ] Scale cloud infrastructure');
      const n2 = createNode(180, -140, '⚡ Spatial Core Architecture', 'purple', '60FPS HTML5 Canvas Engine with 1,000-particle Pythagorean Gravity Nexus.\n\nBuilt for #spatial operations.');
      const n3 = createNode(180, 100, '🚀 Growth & Marketing', 'emerald', 'Multi-channel rollout targeting knowledge architects and solo operators.\n\nShares #spatial focus.');
      createLink(n1, n2, 'powers', 'purple');
      createLink(n1, n3, 'drives', 'emerald');
    } else if (templateType === 'architecture') {
      const n1 = createNode(-250, 0, '🌌 React & Canvas Frontend', 'cyan', 'High-DPI Retina canvas engine paired with React 18 state engine.\n\nIntegrated with #tech.');
      const n2 = createNode(200, -100, '🔥 Firebase Cloud Persistence', 'emerald', 'Realtime Firestore sync (`onSnapshot`) with offline-first indexedDB persistence for #tech.');
      const n3 = createNode(200, 120, '🎧 Web Audio API Synth', 'amber', 'Procedural 432Hz cosmic drone synthesizer for deep focus environment.');
      createLink(n1, n2, 'syncs with', 'emerald');
      createLink(n1, n3, 'synthesizes', 'amber');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-8 space-y-8 overflow-hidden my-auto">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">NEBULA</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide">
                  v3.0 OFFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">The Cloud-Synced Spatial Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLaunchTemplate('roadmap')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Workflow className="w-3.5 h-3.5 text-purple-400" />
              <span>Load Template</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all flex items-center gap-2"
            >
              <span>Launch Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Tag Auto-Tethering Showcase Simulation */}
        <div className="relative w-full h-48 rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden flex items-center justify-center p-6">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Animated Tether Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
            <circle cx="50%" cy="50%" r="4" fill="#ffffff" className="animate-ping" />
          </svg>

          <div className="relative z-10 flex items-center justify-between w-full max-w-xl">
            {/* Card 1 Preview */}
            <div className="p-3.5 rounded-2xl glass-card border border-cyan-500/40 shadow-glow-cyan bg-cyan-500/10 w-48 space-y-1">
              <span className="text-xs font-bold text-cyan-300 block truncate">🌌 Spatial Thought A</span>
              <p className="text-[11px] text-slate-300">Mapping out #strategy</p>
              <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-semibold">#strategy</span>
            </div>

            {/* Glowing Tag Pill in Center */}
            <div className="px-3 py-1 rounded-full bg-slate-950 border border-purple-400 text-purple-300 text-[10px] font-bold shadow-lg flex items-center gap-1 z-20">
              <span>Auto #strategy Tether</span>
            </div>

            {/* Card 2 Preview */}
            <div className="p-3.5 rounded-2xl glass-card border border-purple-500/40 shadow-purple-500/20 bg-purple-500/10 w-48 space-y-1">
              <span className="text-xs font-bold text-purple-300 block truncate">⚡ System Action B</span>
              <p className="text-[11px] text-slate-300">Connected via #strategy</p>
              <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-semibold">#strategy</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Unbound Infinite Canvas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              60FPS HTML5 Canvas with 1,000-particle Pythagorean Gravity Nexus & retina scaling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Organic Tag Tethers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Matching hashtags auto-tether across space while multi-anchor handles allow custom drag connections.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Rich Tasks & Focus Audio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive markdown checkboxes, Notion-style WYSIWYG tether popover, and 432Hz ambient focus audio.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Cloud Synced</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> Offline PWA</span>
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-purple-400" /> Spatial Engine</span>
          </div>

          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            Enter Workspace →
          </button>
        </div>
      </div>
    </div>
  );
};
