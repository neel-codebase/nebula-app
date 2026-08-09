import React, { useState, useEffect, useRef } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { FormatToolbar } from './FormatToolbar';
import { 
  X, 
  Trash2, 
  Tag, 
  Pin, 
  Check, 
  Sparkles, 
  Palette,
  Link2
} from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500', border: 'border-cyan-400' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500', border: 'border-purple-400' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500', border: 'border-emerald-400' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500', border: 'border-amber-400' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500', border: 'border-rose-400' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', border: 'border-indigo-400' },
];

export const NodeModal = () => {
  const {
    editingNodeId,
    setEditingNodeId,
    nodes,
    manualLinks,
    updateNode,
    deleteNode,
    deleteLink,
    updateLink
  } = useSpace();

  const node = editingNodeId ? nodes[editingNodeId] : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState('cyan');
  const [pinned, setPinned] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (node) {
      setTitle(node.title || '');
      setContent(node.content || '');
      setTags(node.tags || []);
      setColor(node.color || 'cyan');
      setPinned(node.pinned || false);
    }
  }, [node]);

  if (!node) return null;

  const activeNodeLinks = (manualLinks || []).filter(
    (l) => l.sourceId === node.id || l.targetId === node.id
  );

  const handleSave = () => {
    updateNode(
      node.id,
      {
        title: title.trim() || 'Untitled Thought',
        content,
        tags,
        color,
        pinned,
      },
      true
    );
    setEditingNodeId(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Edit Thought Node</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPinned(!pinned)}
              className={`p-1.5 rounded-lg border transition-colors ${
                pinned
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
              title={pinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className="w-4 h-4" />
            </button>

            <button
              onClick={() => setEditingNodeId(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Thought Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter thought title..."
            className="w-full px-3 py-2 text-sm rounded-xl glass-input font-medium"
            autoFocus
          />
        </div>

        {/* Content Area with Rich Format Toolbar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Spatial Notes & Markdown Content
            </label>
          </div>

          <div className="mb-2">
            <FormatToolbar
              textareaRef={textareaRef}
              value={content}
              onChange={(val) => setContent(val)}
            />
          </div>

          <textarea
            ref={textareaRef}
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write detailed notes with #tags, [links](url), **bold**, ==highlights==..."
            className="w-full px-3 py-2 text-xs rounded-xl glass-input resize-none leading-relaxed font-mono"
          />
        </div>

        {/* Color Palette Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Palette className="w-3 h-3 text-cyan-400" />
            Accent Glow Color
          </label>
          <div className="flex items-center gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`w-7 h-7 rounded-xl ${c.bg} flex items-center justify-center transition-all ${
                  color === c.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {color === c.id && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Editor */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Tags (Press Enter to Add)
          </label>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5"
              >
                <Tag className="w-3 h-3" />
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tag (e.g. strategy, pwa)..."
            className="w-full px-3 py-1.5 text-xs rounded-xl glass-input"
          />
        </div>

        {/* Connections Management Section */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Link2 className="w-3 h-3 text-purple-400" />
            Active Manual Connections ({activeNodeLinks.length})
          </label>

          {activeNodeLinks.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic">No manual connections drawn yet. Drag the (+) anchor handle on a card to tether it.</p>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeNodeLinks.map((link) => {
                const otherNodeId = link.sourceId === node.id ? link.targetId : link.sourceId;
                const otherNode = nodes[otherNodeId];

                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                  >
                    <div className="overflow-hidden flex-1">
                      <span className="font-semibold text-cyan-300 truncate block">
                        {otherNode ? otherNode.title.replace(/^#+\s*/, '') : 'Connected Thought'}
                      </span>
                      <input
                        type="text"
                        defaultValue={link.label || 'relates to'}
                        onBlur={(e) => updateLink(link.id, { label: e.target.value.trim() || 'relates to' })}
                        className="bg-transparent text-[10px] text-slate-400 focus:text-white border-b border-transparent focus:border-cyan-400 focus:outline-none w-full"
                        title="Click to rename link label"
                      />
                    </div>

                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete connection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={() => {
              deleteNode(node.id);
              setEditingNodeId(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Thought</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingNodeId(null)}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
