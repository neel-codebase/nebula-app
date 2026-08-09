import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  ArrowRight, 
  Layers, 
  Network, 
  ShieldCheck, 
  Compass,
  Cpu,
  Chrome,
  Globe2,
  Atom,
  Sparkles
} from 'lucide-react';

export const LandingPage = ({ onClose }) => {
  const { setIsChromeModalOpen } = useSpace();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-8 space-y-8 overflow-hidden my-auto">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

        {/* Header Section with SINGLE Primary CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">NEBULA</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide">
                  v4.0 CONSOLIDATED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">The Seamless Cloud-Synced Spatial Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChromeModalOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
              title="Download Chrome App Package"
            >
              <Chrome className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Chrome App</span>
            </button>

            {/* SINGLE Primary Entry CTA */}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-glow-cyan transition-all flex items-center gap-2 transform hover:scale-105"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tag & Tether Mechanism Showcase Simulation */}
        <div className="relative w-full h-52 rounded-2xl bg-slate-900/90 border border-white/15 overflow-hidden flex items-center justify-center p-6 shadow-inner">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

          {/* SVG Animated Bezier Tether & Pulse Dots */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path 
              d="M 230 104 C 340 40, 480 160, 590 104" 
              fill="none" 
              stroke="#a855f7" 
              strokeWidth="2.5" 
              strokeDasharray="6 4" 
              className="animate-pulse"
            />
            <circle cx="410" cy="104" r="5" fill="#06b6d4" className="animate-ping" />
            <circle cx="410" cy="104" r="3" fill="#ffffff" />
          </svg>

          <div className="relative z-10 flex items-center justify-between w-full max-w-2xl gap-4">
            {/* Card A Preview */}
            <div className="p-4 rounded-2xl glass-card border border-cyan-500/40 shadow-glow-cyan bg-cyan-500/10 w-52 space-y-1.5 transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 block truncate">🌌 Spatial Thought Alpha</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">Mapping out core architecture with #spatial physics</p>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-bold">#spatial</span>
              </div>
            </div>

            {/* Glowing Tag & Tether Pill Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-purple-400/60 text-purple-300 text-[10px] font-bold shadow-glow-purple flex items-center gap-1.5 z-20 shrink-0">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Organic Tag & Tether Mechanism</span>
            </div>

            {/* Card B Preview */}
            <div className="p-4 rounded-2xl glass-card border border-purple-500/40 shadow-purple-500/20 bg-purple-500/10 w-52 space-y-1.5 transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 block truncate">⚡ Connected Node Beta</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">Auto-tethered across distance via #spatial link</p>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-bold">#spatial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">60FPS Star Gravity Canvas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1,000-particle Pythagorean Gravity Nexus with cursor attraction, celestial star dust, and Retina canvas scaling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-purple-500/30 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Multi-Galaxy Maps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store and switch between separate galaxy workspaces in the left rail. Click "+ New Galaxy Map" for a blank map.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-emerald-500/30 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Seamless Tag & Tethering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type matching #hashtags to generate organic glowing tethers or drag (+) handles for custom connection curves.
            </p>
          </div>
        </div>

        {/* Streamlined Footer Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Cloud Synced</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> Offline PWA</span>
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-purple-400" /> V4.0 Engine</span>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Nebula V4.0 Consolidated • Instant Spatial Workspace
          </span>
        </div>
      </div>
    </div>
  );
};
