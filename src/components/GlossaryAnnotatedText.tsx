import React, { useMemo } from 'react';
import { GlossaryTerm } from '../types';
import { getSortedGlossaryKeywords, findGlossaryTerm } from '../data/glossaryData';
import { BookOpen } from 'lucide-react';

interface GlossaryAnnotatedTextProps {
  children: React.ReactNode;
  onSelectTerm: (term: GlossaryTerm) => void;
  enabled?: boolean;
}

// Compile regex once
function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const GlossaryAnnotatedText: React.FC<GlossaryAnnotatedTextProps> = ({
  children,
  onSelectTerm,
  enabled = true,
}) => {
  // Build unified Regex from sorted glossary keywords
  const glossaryRegex = useMemo(() => {
    if (!enabled) return null;
    const keywords = getSortedGlossaryKeywords();
    if (keywords.length === 0) return null;

    // Filter and map to escaped patterns with word boundaries
    const patterns = keywords.map((k) => escapeRegex(k.keyword));
    return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
  }, [enabled]);

  const annotateString = (text: string, keyPrefix: string): React.ReactNode => {
    if (!glossaryRegex || !enabled || !text) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    glossaryRegex.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = glossaryRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = glossaryRegex.lastIndex;
      const matchedText = match[0];

      // Push preceding text
      if (matchStart > lastIndex) {
        parts.push(text.substring(lastIndex, matchStart));
      }

      // Find the canonical glossary term
      const term = findGlossaryTerm(matchedText);

      if (term) {
        parts.push(
          <span
            key={`${keyPrefix}-term-${matchStart}-${matchedText}`}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTerm(term);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onSelectTerm(term);
              }
            }}
            className="cursor-pointer inline-flex items-center gap-0.5 px-1 py-0.5 -my-0.5 rounded-md font-semibold text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-800/60 border border-teal-500/30 hover:border-teal-400 transition-all duration-150 shadow-xs group select-text decoration-dotted underline decoration-teal-400/80 hover:decoration-teal-200"
            title={`📚 Medical Glossary: ${term.term} (${term.category})\nClick to view full definition, mechanism & board pearls`}
          >
            <span>{matchedText}</span>
            <BookOpen className="w-2.5 h-2.5 text-teal-400 group-hover:text-teal-200 opacity-70 group-hover:opacity-100 transition-opacity inline-block shrink-0" />
          </span>
        );
      } else {
        parts.push(matchedText);
      }

      lastIndex = matchEnd;
    }

    // Push remaining string
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const processNode = (node: React.ReactNode, index: number): React.ReactNode => {
    if (typeof node === 'string') {
      return annotateString(node, `str-${index}`);
    }

    if (React.isValidElement(node)) {
      // Don't annotate inside buttons, code blocks, or links
      const tag = (node.type as any)?.name || node.type;
      if (tag === 'code' || tag === 'pre' || tag === 'a' || tag === 'button') {
        return node;
      }

      const elementProps = node.props as { children?: React.ReactNode };
      if (elementProps && elementProps.children) {
        return React.cloneElement(
          node,
          { key: node.key || `node-${index}` } as any,
          React.Children.map(elementProps.children, (child, childIdx) =>
            processNode(child, childIdx)
          )
        );
      }
    }

    return node;
  };

  if (!enabled) return <>{children}</>;

  return (
    <>
      {React.Children.map(children, (child, idx) => processNode(child, idx))}
    </>
  );
};
