import React, { useState } from 'react';
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

const SpaceViewport = () => {
  const { setSelection } = useSpace();
  const [showLanding, setShowLanding] = useState(false);

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

        {/* Introductory Landing Page Showcase */}
        {showLanding && <LandingPage onClose={() => setShowLanding(false)} />}
      </div>
    </FileDropZone>
  );
};

export default function App() {
  return (
    <SpaceProvider>
      <SpaceViewport />
    </SpaceProvider>
  );
}
