import React from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Underline, 
  Highlighter, 
  Heading1, 
  Heading2, 
  Link, 
  Tag 
} from 'lucide-react';

export const FormatToolbar = ({ textareaRef, value, onChange }) => {
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter Hyperlink URL:', 'https://');
    if (url) {
      insertFormatting('[', `](${url})`);
    }
  };

  const insertTag = () => {
    const tagName = prompt('Enter Hashtag Name:', 'topic');
    if (tagName) {
      const clean = tagName.trim().replace(/^#/, '');
      insertFormatting(` #${clean} `);
    }
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl overflow-x-auto">
      <button
        type="button"
        onClick={() => insertFormatting('# ')}
        className="px-2 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-colors flex items-center gap-1"
        title="Heading 1 (# Title)"
      >
        <Heading1 className="w-3.5 h-3.5" />
        H1
      </button>

      <button
        type="button"
        onClick={() => insertFormatting('## ')}
        className="px-2 py-1 text-[11px] font-bold text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors flex items-center gap-1"
        title="Heading 2 (## Subtitle)"
      >
        <Heading2 className="w-3.5 h-3.5" />
        H2
      </button>

      <div className="h-4 w-px bg-white/10 mx-0.5" />

      <button
        type="button"
        onClick={() => insertFormatting('**', '**')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Bold (**bold**)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => insertFormatting('*', '*')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Italic (*italic*)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => insertFormatting('~~', '~~')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Strikethrough (~~text~~)"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => insertFormatting('<u>', '</u>')}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Underline (<u>text</u>)"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => insertFormatting('==', '==')}
        className="p-1.5 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
        title="Highlight (==text==)"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-white/10 mx-0.5" />

      <button
        type="button"
        onClick={insertLink}
        className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors flex items-center gap-1"
        title="Insert Hyperlink [Text](URL)"
      >
        <Link className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={insertTag}
        className="p-1.5 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors flex items-center gap-1"
        title="Insert #Hashtag"
      >
        <Tag className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
