import React, { Component } from 'react';
import { SpaceProvider, useSpace } from './context/SpaceContext';
import { CanvasEngine } from './components/canvas/CanvasEngine';
import { ThoughtNodeOverlay } from './components/ui/ThoughtNodeOverlay';
import { HeaderNav } from './components/ui/HeaderNav';
import { CommandBar } from './components/ui/CommandBar';
import { CommandPalette } from './components/ui/CommandPalette';
import { NodeModal } from './components/ui/NodeModal';
import { Sidebar } from './components/ui/Sidebar';
import { Minimap } from './components/ui/Minimap';
import { FileDropZone } from './components/ui/FileDropZone';
import { LandingPage } from './components/landing/LandingPage';
import { TetherEditorPopover } from './components/ui/TetherEditorPopover';
import { ChromeAppModal } from './components/ui/ChromeAppModal';
import { RefreshCw, Sparkles } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Nebula Space Engine catch:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('nebula_galaxy_maps');
      localStorage.removeItem('nebula_active_galaxy_id');
      localStorage.removeItem('nebula_nodes');
      localStorage.removeItem('nebula_links');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="w-full max-w-md p-6 glass-panel rounded-3xl border border-white/15 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-glow-cyan">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Nebula Space Engine Recovery</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected state anomaly occurred. Resetting the spatial canvas will clear stale cache and restore clean initial state.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Reload Canvas</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SpaceViewport = () => {
  const { setSelection, showLanding, setShowLanding, isChromeModalOpen } = useSpace();

  const handleCanvasClick = () => {
    setSelection({ nodeIds: [], linkId: null });
  };

  return (
    <FileDropZone>
      <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none antialiased">
        {/* Infinite 60FPS Spatial Canvas Engine */}
        <CanvasEngine onCanvasClick={handleCanvasClick} />

        {/* HTML Glass Card Nodes Layer */}
        <ThoughtNodeOverlay />

        {/* Floating WYSIWYG Tether Editor Popover */}
        <TetherEditorPopover />

        {/* Top Header Navigation */}
        <HeaderNav onOpenLanding={() => setShowLanding(true)} />

        {/* Minimap Radar Navigation */}
        <Minimap />

        {/* Bottom Command Dock */}
        <CommandBar />

        {/* Slide-out Sidebar Drawer */}
        <Sidebar />

        {/* Spotlight Command Palette (Cmd+K) */}
        <CommandPalette />

        {/* Detailed Thought Editor Modal */}
        <NodeModal />

        {/* Chrome App / Extension Download Modal */}
        {isChromeModalOpen && <ChromeAppModal />}

        {/* Introductory Landing Page Showcase (First Landing Default) */}
        {showLanding && <LandingPage onClose={() => setShowLanding(false)} />}
      </div>
    </FileDropZone>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SpaceProvider>
        <SpaceViewport />
      </SpaceProvider>
    </ErrorBoundary>
  );
}
