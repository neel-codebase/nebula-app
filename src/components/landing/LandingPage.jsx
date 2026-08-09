import React, { useState } from 'react';
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
  Sparkles,
  Zap,
  Volume2,
  Brain,
  Workflow
} from 'lucide-react';

export const LandingPage = ({ onClose }) => {
  const { setIsChromeModalOpen } = useSpace();
  const [activeDemoTag, setActiveDemoTag] = useState('strategy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn overflow-y-auto font-sans antialiased text-slate-100 select-none">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-10 space-y-10 overflow-hidden my-auto">
        {/* Top Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 via-emerald-500 to-cyan-500 animate-pulse" />

        {/* 1. Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">NEBULA</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide">
                  v4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Spatial Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsChromeModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
              title="Download Chrome App Package"
            >
              <Chrome className="w-4 h-4 text-cyan-400" />
              <span>Chrome App</span>
            </button>

            {/* SINGLE Primary Entry CTA */}
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-glow-cyan transition-all flex items-center gap-2 transform hover:scale-105"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Hero Section: Human-Centric Hook */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built for Non-Linear Minds</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Think at the speed of thought.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Without the friction of linear lists.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Your mind isn’t a flat document—it's an expanding galaxy of interconnected ideas. 
            Nebula gives your thoughts space to breathe, automatically tethering related notes across an infinite 60FPS gravity canvas.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-extrabold shadow-glow-cyan transition-all flex items-center gap-2 transform hover:scale-105"
            >
              <span>Launch Spatial Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. VISUAL FEATURE 1: Organic Tag & Tether Mechanism */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Network className="w-3.5 h-3.5" />
                <span>Feature Spotlight 01</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ideas that connect themselves organically.
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Type matching <code className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">#hashtags</code> inside notes. Nebula instantly generates glowing connection tethers across space.
            </p>
          </div>

          {/* Interactive Visual Tether Showcase Container */}
          <div className="relative w-full h-56 rounded-2xl bg-slate-900/90 border border-white/15 overflow-hidden flex items-center justify-center p-6 shadow-inner">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

            {/* SVG Animated Bezier Tether Line & Energy Pulse */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path 
                d="M 220 110 C 350 30, 480 190, 620 110" 
                fill="none" 
                stroke={activeDemoTag === 'strategy' ? '#a855f7' : '#06b6d4'} 
                strokeWidth="2.8" 
                strokeDasharray="6 4" 
                className="animate-pulse transition-all"
              />
              <circle cx="420" cy="110" r="5" fill="#06b6d4" className="animate-ping" />
              <circle cx="420" cy="110" r="3" fill="#ffffff" />
            </svg>

            <div className="relative z-10 flex items-center justify-between w-full max-w-3xl gap-4">
              {/* Card Alpha Preview */}
              <div className="p-4 rounded-2xl glass-card border border-cyan-500/40 shadow-glow-cyan bg-cyan-500/10 w-56 space-y-2 transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 block truncate">🎯 Product Vision</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Consolidating roadmap & spatial architecture using <span className="text-purple-300 font-semibold">#{activeDemoTag}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setActiveDemoTag('strategy')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      activeDemoTag === 'strategy' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    #strategy
                  </button>
                  <button 
                    onClick={() => setActiveDemoTag('canvas')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      activeDemoTag === 'canvas' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    #canvas
                  </button>
                </div>
              </div>

              {/* Glowing Center Badge */}
              <div className="px-4 py-2 rounded-full bg-slate-950/90 border border-purple-400/60 text-purple-300 text-[10px] font-bold shadow-glow-purple flex items-center gap-2 z-20 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto #{activeDemoTag} Tether</span>
              </div>

              {/* Card Beta Preview */}
              <div className="p-4 rounded-2xl glass-card border border-purple-500/40 shadow-purple-500/20 bg-purple-500/10 w-56 space-y-2 transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 block truncate">⚡ Strategic Action</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Linked across distance via matching <span className="text-purple-300 font-semibold">#{activeDemoTag}</span> tag
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-500/50 text-purple-300 text-[10px] font-bold">
                    #{activeDemoTag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VISUAL FEATURE GRID: Human Benefits & Core Engines */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Designed for cognitive clarity & seamless focus.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1: Gravity Physics */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-cyan-500/40 transition-all hover:bg-white/[0.07] group">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">60FPS Star Gravity Canvas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Experience a 1,000-particle Pythagorean gravity nexus reacting smoothly to cursor movements with Retina canvas scaling.
              </p>
            </div>

            {/* Feature 2: Multi-Galaxy Maps */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-purple-500/40 transition-all hover:bg-white/[0.07] group">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Multi-Galaxy Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Partition projects into separate Galaxy Maps in the left rail. Click "+ New Galaxy Map" to spawn fresh blank workspaces anytime.
              </p>
            </div>

            {/* Feature 3: 432Hz Soundscape & Sync */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-emerald-500/40 transition-all hover:bg-white/[0.07] group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">432Hz Focus & Offline Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter deep flow with built-in procedural 432Hz ambient focus audio and instant offline-first cloud storage sync.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Clean Footer Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Cloud Synced</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> Offline PWA</span>
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-purple-400" /> V4.0 Engine</span>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Nebula V4.0 • Human Spatial Intelligence Engine
          </span>
        </div>
      </div>
    </div>
  );
};
