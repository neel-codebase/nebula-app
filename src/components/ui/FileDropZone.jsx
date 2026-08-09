import React, { useState, useEffect } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { UploadCloud, FileText, Sparkles } from 'lucide-react';
import { extractHashtags } from '../../utils/tagParser';

export const FileDropZone = ({ children }) => {
  const { createNode, camera } = useSpace();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDragging(false);
      }
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const dropX = e.clientX;
      const dropY = e.clientY;

      const worldX = (dropX - camera.x) / camera.zoom;
      const worldY = (dropY - camera.y) / camera.zoom;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
          try {
            const text = await file.text();
            if (file.name.endsWith('.json')) {
              // Try parsing JSON spatial export
              try {
                const parsed = JSON.parse(text);
                if (parsed.nodes) {
                  Object.values(parsed.nodes).forEach((n, idx) => {
                    createNode(worldX + idx * 80, worldY + idx * 60, n.title, n.color || 'cyan');
                  });
                  return;
                }
              } catch (err) {
                // Fall back to plain text
              }
            }

            // Parse Markdown / Text file
            const title = file.name.replace(/\.[^/.]+$/, "");
            createNode(worldX + i * 120, worldY + i * 80, title, 'purple', text);
          } catch (err) {
            console.warn('File reading error:', err);
          }
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [camera, createNode]);

  return (
    <>
      {children}
      {isDragging && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-8 bg-black/70 backdrop-blur-lg animate-fadeIn">
          <div className="border-2 border-dashed border-cyan-400/80 rounded-3xl p-12 glass-panel flex flex-col items-center justify-center text-center shadow-glow-cyan max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 animate-bounce">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Drop Files to Import Spatial Notes
            </h3>
            <p className="text-xs text-slate-400">
              Supports <code className="text-cyan-300 font-mono">.md</code>, <code className="text-purple-300 font-mono">.txt</code>, and <code className="text-emerald-300 font-mono">.json</code> canvas exports
            </p>
          </div>
        </div>
      )}
    </>
  );
};
