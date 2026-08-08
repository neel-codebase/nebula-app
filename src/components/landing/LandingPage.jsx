import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Zap, Layers, Volume2 } from 'lucide-react';

export const LandingPage = ({ onEnterWorkspace }) => {
  const [typedText, setTypedText] = useState('');
  const [step, setStep] = useState(0); // 0: typing, 1: note 1, 2: note 2, 3: tethered
  const [pulsePos, setPulsePos] = useState({ x: 130, y: 110 });

  // Simulated live typing and auto-tethering showcase
  useEffect(() => {
    const fullMessage = "Build spatial MVP #idea";
    let timer;

    if (step === 0) {
      if (typedText.length < fullMessage.length) {
        timer = setTimeout(() => {
          setTypedText(fullMessage.slice(0, typedText.length + 1));
        }, 75);
      } else {
        timer = setTimeout(() => setStep(1), 500);
      }
    } else if (step === 1) {
      timer = setTimeout(() => setStep(2), 800);
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 1000);
    } else if (step === 3) {
      timer = setTimeout(() => {
        setTypedText('');
        setStep(0);
      }, 4500);
    }

    return () => clearTimeout(timer);
  }, [typedText, step]);

  // Pulse animation along bezier curve
  useEffect(() => {
    if (step < 3) return;
    let animFrame;
    const startTime = performance.now();

    const animatePulse = (now) => {
      const elapsed = (now - startTime) / 1800;
      const t = elapsed % 1;
      
      const x = (1 - t) * (1 - t) * 130 + 2 * (1 - t) * t * 240 + t * t * 350;
      const y = (1 - t) * (1 - t) * 110 + 2 * (1 - t) * t * 180 + t * t * 250;

      setPulsePos({ x, y });
      animFrame = requestAnimationFrame(animatePulse);
    };

    animFrame = requestAnimationFrame(animatePulse);
    return () => cancelAnimationFrame(animFrame);
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-y-auto bg-[#030712] flex flex-col items-center justify-center p-6 text-center lg:text-left select-none animate-fadeIn">
      
      {/* Background Starfield Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.12),transparent_60%)] pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
          <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
        </div>
        <span className="text-base font-bold tracking-wider text-white">Nebula v2.2</span>
      </div>

      {/* Split Hero Layout */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center my-auto pt-16 pb-16 z-10">
        
        {/* LEFT COLUMN: Narrative & Action */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs px-4 py-1.5 rounded-full tracking-widest uppercase font-semibold">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Spatial Thought Management PWA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Give your thoughts room to <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">breathe in space</span>.
          </h1>

          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-2xl">
            Traditional note apps force your ideas into rigid linear lists where thoughts get buried and forgotten. <strong>Nebula</strong> releases your thoughts into a fluid, infinite gravitational void where ideas naturally connect, stack, and evolve.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left my-8">
            <div className="p-4 bg-space-900/80 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-purple-500/40 transition-colors shadow-lg">
              <div className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 1. Capture #tags
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">Jot thoughts using <code className="text-purple-300 bg-purple-900/30 px-1 rounded">#tags</code> to auto-associate ideas.</p>
            </div>

            <div className="p-4 bg-space-900/80 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-cyan-500/40 transition-colors shadow-lg">
              <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> 2. Auto-Tether Light
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">Curved light-lines dynamically link related concepts.</p>
            </div>

            <div className="p-4 bg-space-900/80 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-emerald-500/40 transition-colors shadow-lg">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Cluster & Sync
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">Click Orbit Cluster, double-click cards to edit Markdown.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-2">
            <button 
              onClick={onEnterWorkspace}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-glow-purple transition-all cursor-pointer hover:scale-105 active:scale-95 text-sm tracking-wide flex items-center justify-center gap-3 group"
            >
              <span>Enter Workspace Void</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Tag Connection Showcase */}
        <div className="relative h-[420px] w-full rounded-3xl bg-space-900/90 border border-white/15 overflow-hidden flex flex-col justify-between p-6 shadow-2xl glass-panel">
          
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Live Visual Tether Showcase
            </span>
            <span className="text-[10px] text-white/40 font-mono">Association Engine</span>
          </div>

          {/* Connected Bezier Light-Tether SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 480 360" preserveAspectRatio="none">
            {step >= 3 && (
              <g>
                <path 
                  d="M 130 110 Q 240 180 350 250" 
                  fill="none" 
                  stroke="rgba(168, 85, 247, 0.85)" 
                  strokeWidth="3.5"
                  className="filter drop-shadow-[0_0_10px_#a855f7]"
                />
                <circle 
                  cx={pulsePos.x} 
                  cy={pulsePos.y} 
                  r="5" 
                  fill="#ffffff" 
                  className="filter drop-shadow-[0_0_12px_#ffffff]"
                />
              </g>
            )}
          </svg>

          {/* Live Simulated Notes */}
          <div className="relative z-10 w-full h-64">
            {/* Note 1 */}
            <div className={`absolute top-4 left-4 transition-all duration-500 bg-space-850/95 border border-purple-500/50 p-4 rounded-2xl w-52 shadow-2xl text-left ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 mb-2 inline-block">Thought 1</span>
              <p className="text-xs text-white/90 font-light leading-relaxed">
                Build spatial MVP <span className="text-purple-300 font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">#idea</span>
              </p>
            </div>

            {/* Note 2 */}
            <div className={`absolute bottom-4 right-4 transition-all duration-500 bg-space-850/95 border border-purple-500/50 p-4 rounded-2xl w-52 shadow-2xl text-left ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-4'}`}>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 mb-2 inline-block">Thought 2</span>
              <p className="text-xs text-white/90 font-light leading-relaxed">
                Gravitational canvas <span className="text-purple-300 font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">#idea</span>
              </p>
            </div>
          </div>

          {/* Live Typing Bar Simulation */}
          <div className="relative z-10 bg-space-950/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/80 flex items-center justify-between shadow-lg text-left">
            <span className="font-mono">{typedText}<span className="animate-ping text-cyan-400">|</span></span>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
              {step >= 3 ? '⚡ Tether Active' : 'Auto-Tethering...'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
