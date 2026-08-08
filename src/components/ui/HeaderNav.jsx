import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { 
  Sparkles, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  PanelLeft, 
  Search,
  Plus,
  Volume2,
  VolumeX,
  UserCheck,
  LogIn,
  LogOut
} from 'lucide-react';

export const HeaderNav = () => {
  const {
    nodes,
    links,
    syncStatus,
    setIsSidebarOpen,
    setIsCommandPaletteOpen,
    pwaPrompt,
    triggerPwaInstall,
    isInstalled,
    createNode,
    currentUser,
    signInWithGoogle,
    signOutUser,
    isAudioActive,
    toggleAmbientAudio
  } = useSpace();

  const totalNodes = Object.keys(nodes).length;
  const totalLinks = links.length;

  return (
    <header className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex items-center justify-between gap-4">
      {/* Left Brand & Sidebar Trigger */}
      <div className="pointer-events-auto flex items-center gap-3 glass-panel px-4 py-2.5 rounded-2xl">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
          title="Toggle index drawer"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Nebula
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                v2.1
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Spatial Thought Engine</p>
          </div>
        </div>
      </div>

      {/* Middle Quick Actions & Search trigger */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-2xl">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs transition-all"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search thoughts & tags...</span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-white/10">
            ⌘K
          </kbd>
        </button>

        <div className="h-4 w-px bg-white/10 my-auto" />

        <button
          onClick={() => createNode(null, null, 'New Thought', 'cyan')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Thought</span>
        </button>
      </div>

      {/* Right User & Sound & Sync Controls */}
      <div className="pointer-events-auto flex items-center gap-2.5 glass-panel px-3.5 py-2 rounded-2xl">
        {/* Ambient Deep Focus Audio Toggle */}
        <button
          onClick={toggleAmbientAudio}
          className={`p-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
            isAudioActive
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple'
              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
          }`}
          title={isAudioActive ? 'Mute Deep Focus Drone' : 'Enable 432Hz Ambient Focus Audio'}
        >
          {isAudioActive ? <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden lg:inline text-[11px] font-medium">
            {isAudioActive ? 'Focus Audio On' : 'Ambient Off'}
          </span>
        </button>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {syncStatus === 'synced' && (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Synced</span>
            </span>
          )}
          {syncStatus === 'syncing' && (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
            </span>
          )}
          {syncStatus === 'offline' && (
            <span className="flex items-center gap-1.5 text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-xl">
              <CloudOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Local Cache</span>
            </span>
          )}
        </div>

        {/* User Auth Profile / Google Login */}
        {currentUser ? (
          <div className="flex items-center gap-2 border-l border-white/10 pl-2">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-cyan-400/50"
              />
            ) : (
              <UserCheck className="w-4 h-4 text-cyan-400" />
            )}
            <button
              onClick={signOutUser}
              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle().catch(console.error)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-medium transition-all"
            title="Sign in with Google to sync across devices"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Google Sync</span>
          </button>
        )}

        {/* PWA Install Prompt Button */}
        {pwaPrompt && !isInstalled && (
          <button
            onClick={triggerPwaInstall}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        )}
      </div>
    </header>
  );
};
