import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { Download, X, Chrome, ShieldCheck, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export const ChromeAppModal = () => {
  const { setIsChromeModalOpen } = useSpace();

  const handleDownloadExtension = () => {
    // Generate manifest + extension zip bundle or trigger download instructions
    const manifestContent = {
      manifest_version: 3,
      name: "Nebula V4 - Spatial Intelligence Engine",
      version: "4.0.0",
      description: "Cloud-synced spatial thought mapping engine with star nebula physics and organic tag tethers.",
      action: {
        default_popup: "index.html",
        default_icon: "icon.png"
      },
      permissions: ["storage", "activeTab"],
      background: {
        service_worker: "background.js"
      }
    };

    const blob = new Blob([JSON.stringify(manifestContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 space-y-6 overflow-hidden my-auto">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan">
              <Chrome className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Nebula V4 Chrome App</h2>
              <p className="text-xs text-slate-400">Desktop & Chrome Extension Build Package</p>
            </div>
          </div>
          <button
            onClick={() => setIsChromeModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Full Spatial Power in Chrome</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Install Nebula V4 directly into Google Chrome as a standalone App / Extension. Lands on the visual landing page on every startup and operates offline-first with local storage & cloud sync.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Installation Steps</span>
            </h3>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <div>
                  <strong className="text-white block">Download Package</strong>
                  <span>Click below to save the official Manifest V3 extension configuration.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <div>
                  <strong className="text-white block">Open Chrome Extensions</strong>
                  <span>Navigate to <code className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono">chrome://extensions</code> in your browser.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <div>
                  <strong className="text-white block">Enable Developer Mode & Load Unpacked</strong>
                  <span>Toggle "Developer mode" in top-right and click "Load unpacked" targeting the folder.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Manifest V3 Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChromeModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-all"
            >
              Close
            </button>
            <button
              onClick={handleDownloadExtension}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Chrome Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
