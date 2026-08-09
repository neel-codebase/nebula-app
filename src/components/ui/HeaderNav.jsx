import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Compass, 
  RefreshCw, 
  Download,
  Info,
  Chrome,
  Globe2
} from 'lucide-react';

export const HeaderNav = ({ onOpenLanding }) => {
  const {
    currentUser,
    signInWithGoogle,
    signOutUser,
    syncStatus,
    autoLayout,
    resetView,
    isAudioActive,
    toggleAmbientAudio,
    pwaPrompt,
    triggerPwaInstall,
    isInstalled,
    galaxyMaps,
    activeGalaxyId,
    setIsChromeModalOpen
  } = useSpace();

  const activeGalaxy = galaxyMaps?.[activeGalaxyId] || { name: 'Milky Way Galaxy' };

  return (
    <header className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex items-center justify-between gap-4">
      {/* Brand & Active Galaxy Map Badge */}
      <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-sm tracking-wide text-white">NEBULA</h1>
            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              v4.0
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold truncate max-w-[140px]">
            <Globe2 className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">{activeGalaxy.name}</span>
          </div>
        </div>

        <button
          onClick={onOpenLanding}
          className="ml-1 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
          title="Open Landing Showcase & Feature Guide"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Center Controls Dock */}
      <div className="pointer-events-auto hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button
          onClick={autoLayout}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          title="Auto Cluster Orbital Layout"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Auto Cluster</span>
        </button>

        <button
          onClick={resetView}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          title="Reset Camera Center"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Camera</span>
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        <button
          onClick={toggleAmbientAudio}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            isAudioActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
          title="Toggle 432Hz Ambient Focus Drone"
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span>432Hz Audio</span>
        </button>
      </div>

      {/* Right User, Chrome App, & Sync Status */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Chrome Extension Modal Button */}
        <button
          onClick={() => setIsChromeModalOpen(true)}
          className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          title="Download Chrome App / Extension"
        >
          <Chrome className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Chrome App</span>
        </button>

        {/* PWA Install Button */}
        {pwaPrompt && !isInstalled && (
          <button
            onClick={triggerPwaInstall}
            className="px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )}

        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel border border-white/10 text-xs font-semibold text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              syncStatus === 'synced'
                ? 'bg-emerald-400 shadow-glow-emerald'
                : syncStatus === 'syncing'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-500'
            }`}
          />
          <span className="capitalize">{syncStatus}</span>
        </div>

        {/* Google Authentication */}
        {currentUser ? (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
            <img
              src={currentUser.photoURL || 'https://via.placeholder.com/32'}
              alt={currentUser.displayName || 'User'}
              className="w-7 h-7 rounded-xl border border-white/20"
            />
            <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[120px] truncate">
              {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={signOutUser}
              className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="px-3.5 py-2 rounded-2xl glass-panel border border-white/15 text-xs font-bold text-slate-100 hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
