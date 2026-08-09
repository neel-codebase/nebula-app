import React from 'react';

/**
 * Parses custom markdown & rich text tags into interactive React elements:
 * - H1: # text
 * - H2: ## text
 * - Bold: **text**
 * - Italic: *text*
 * - Strikethrough: ~~text~~
 * - Underline: <u>text</u>
 * - Highlight: ==text== or <mark>text</mark>
 * - Hyperlinks: [label](url)
 * - Hashtags: #tag
 */
export const FormattedText = ({ text = '', className = '' }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={`space-y-1 ${className}`}>
      {lines.map((line, lineIdx) => {
        // H1 Heading (# Heading)
        if (line.startsWith('# ')) {
          return (
            <h1 key={lineIdx} className="text-sm font-bold text-cyan-300 tracking-wide mt-1 mb-1">
              {parseInlineStyles(line.substring(2))}
            </h1>
          );
        }
        // H2 Heading (## Heading)
        if (line.startsWith('## ')) {
          return (
            <h2 key={lineIdx} className="text-xs font-semibold text-purple-300 tracking-wide mt-1 mb-1">
              {parseInlineStyles(line.substring(3))}
            </h2>
          );
        }

        return (
          <p key={lineIdx} className="text-xs text-slate-300 leading-relaxed font-normal">
            {parseInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
};

// Internal parser for inline styles
function parseInlineStyles(str = '') {
  if (!str) return null;

  // Regex tokenizer matching hyperlinks, bold, italic, strikethrough, underline, highlights, and hashtags
  const regex = /(\[.*?\]\(https?:\/\/[^\s\)]+\)|==.*?==|<mark>.*?<\/mark>|\*\*.*?\*\*|\*.*?\*|~~.*?~~|<u>.*?<\/u>|#[a-zA-Z0-9_\-]+)/g;

  const parts = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      parts.push(str.substring(lastIdx, match.index));
    }

    const token = match[0];

    // Hyperlink [Label](URL)
    if (token.startsWith('[') && token.includes('](')) {
      const label = token.substring(1, token.indexOf(']('));
      const url = token.substring(token.indexOf('](') + 2, token.length - 1);
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-cyan-400 underline hover:text-cyan-300 font-medium transition-colors cursor-pointer"
        >
          {label}
        </a>
      );
    }
    // Highlight ==text== or <mark>text</mark>
    else if ((token.startsWith('==') && token.endsWith('==')) || (token.startsWith('<mark>') && token.endsWith('</mark>'))) {
      const inner = token.startsWith('==') ? token.slice(2, -2) : token.slice(6, -7);
      parts.push(
        <mark key={match.index} className="bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/30">
          {inner}
        </mark>
      );
    }
    // Bold **text**
    else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Italic *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    // Strikethrough ~~text~~
    else if (token.startsWith('~~') && token.endsWith('~~')) {
      parts.push(
        <del key={match.index} className="line-through text-slate-400">
          {token.slice(2, -2)}
        </del>
      );
    }
    // Underline <u>text</u>
    else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      parts.push(
        <u key={match.index} className="underline text-slate-100">
          {token.slice(3, -4)}
        </u>
      );
    }
    // Hashtag #tag
    else if (token.startsWith('#')) {
      parts.push(
        <span key={match.index} className="text-purple-300 font-medium bg-purple-500/20 px-1 py-0.2 rounded border border-purple-500/30">
          {token}
        </span>
      );
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < str.length) {
    parts.push(str.substring(lastIdx));
  }

  return parts.length > 0 ? parts : str;
}
