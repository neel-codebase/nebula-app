import React from 'react';
import { SpaceProvider } from './context/SpaceContext';
import { CanvasEngine } from './components/canvas/CanvasEngine';
import { ThoughtNodeOverlay } from './components/ui/ThoughtNodeOverlay';
import { HeaderNav } from './components/ui/HeaderNav';
import { CommandBar } from './components/ui/CommandBar';
import { CommandPalette } from './components/ui/CommandPalette';
import { Sidebar } from './components/ui/Sidebar';
import { NodeModal } from './components/ui/NodeModal';
import { Minimap } from './components/ui/Minimap';
import { FileDropZone } from './components/ui/FileDropZone';

function AppContent() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 select-none font-sans">
      {/* 1. HTML5 Canvas Engine (Background Grid, Tethers, Physics) */}
      <CanvasEngine />

      {/* 2. Spatial Thought Node Cards (Synced HTML Overlay) */}
      <ThoughtNodeOverlay />

      {/* 3. Top Glass Header Navigation */}
      <HeaderNav />

      {/* 4. Floating Command Dock Toolbar */}
      <CommandBar />

      {/* 5. Command Palette Modal (Cmd+K) */}
      <CommandPalette />

      {/* 6. Sidebar Index Panel */}
      <Sidebar />

      {/* 7. Node Editor Modal */}
      <NodeModal />

      {/* 8. Viewport Minimap */}
      <Minimap />

      {/* 9. Drag & Drop File Import Zone */}
      <FileDropZone />
    </div>
  );
}

export default function App() {
  return (
    <SpaceProvider>
      <AppContent />
    </SpaceProvider>
  );
}
