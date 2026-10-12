/**
 * Turns GitHub-style alert blockquotes into styled callouts.
 *
 *   > [!NOTE]
 *   > Text of the note.
 *
 *   > [!KEY] Optional custom title
 *   > The key idea in one or two sentences.
 *
 * Types: NOTE, TIP, KEY, IMPORTANT, WARNING, CAUTION.
 * The same syntax renders as an alert on GitHub, so drafts read well there too.
 */
import { visit } from 'unist-util-visit';

const LABELS = {
  note: 'Note',
  tip: 'Tip',
  key: 'Key idea',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const MARKER = /^\[!(NOTE|TIP|KEY|IMPORTANT|WARNING|CAUTION)\][ \t]*([^\n]*)\n?/i;

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const text = first.children[0];
      if (!text || text.type !== 'text') return;
      const match = text.value.match(MARKER);
      if (!match) return;

      const type = match[1].toLowerCase();
      const title = match[2].trim() || LABELS[type];
      text.value = text.value.slice(match[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      node.data = {
        ...node.data,
        hName: 'aside',
        hProperties: { className: ['callout', `callout-${type}`] },
      };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: title }],
      });
    });
  };
}
