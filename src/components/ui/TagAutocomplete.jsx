import React, { useMemo } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { Tag } from 'lucide-react';

export const TagAutocomplete = ({ query, onSelectTag, onClose }) => {
  const { nodes } = useSpace();

  const allTags = useMemo(() => {
    const set = new Set();
    Object.values(nodes).forEach((n) => {
      if (n.tags && Array.isArray(n.tags)) {
        n.tags.forEach((t) => set.add(t.toLowerCase()));
      }
    });
    return Array.from(set);
  }, [nodes]);

  const filteredTags = useMemo(() => {
    const clean = (query || '').replace(/^#/, '').toLowerCase();
    if (!clean) return allTags;
    return allTags.filter((t) => t.includes(clean));
  }, [allTags, query]);

  if (filteredTags.length === 0) return null;

  return (
    <div className="absolute z-50 mt-1 w-52 glass-panel rounded-xl shadow-2xl border border-white/10 p-1.5 space-y-1 max-h-40 overflow-y-auto animate-fadeIn">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between border-b border-white/5">
        <span>Hashtag Suggestions</span>
        <button onClick={onClose} className="hover:text-white">✕</button>
      </div>

      {filteredTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelectTag(tag)}
          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 text-xs text-slate-200 flex items-center gap-2 transition-colors font-medium"
        >
          <Tag className="w-3 h-3 text-purple-400" />
          <span>#{tag}</span>
        </button>
      ))}
    </div>
  );
};
