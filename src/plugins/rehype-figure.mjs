/**
 * Wraps a standalone image that has a title in <figure> with a <figcaption>.
 *
 *   ![Alt text for screen readers](./diagram.png "Caption shown under the image")
 *
 * Images without a title stay as plain images.
 */
import { visit, SKIP } from 'unist-util-visit';

const isWhitespace = (n) => n.type === 'text' && !n.value.trim();

/** Astro packs optimized-image props into a JSON property; read the title from either place. */
function takeTitle(node) {
  if (node.type === 'element' && node.tagName === 'img') {
    const packed = node.properties?.__ASTRO_IMAGE_;
    if (typeof packed === 'string') {
      try {
        const props = JSON.parse(packed);
        if (props.title) {
          const title = props.title;
          delete props.title;
          node.properties.__ASTRO_IMAGE_ = JSON.stringify(props);
          return title;
        }
      } catch {}
    }
    const title = node.properties?.title;
    if (title) {
      delete node.properties.title;
      return String(title);
    }
    return null;
  }
  // MDX turns local images into an <__AstroImage__> JSX element.
  if ((node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') && node.name === '__AstroImage__') {
    const i = node.attributes.findIndex((a) => a.name === 'title' && typeof a.value === 'string');
    if (i === -1) return null;
    const [attr] = node.attributes.splice(i, 1);
    return attr.value;
  }
  return null;
}

export default function rehypeFigure() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !isWhitespace(c));
      if (kids.length !== 1) return;
      const img = kids[0];
      const caption = takeTitle(img);
      if (!caption) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          img,
          { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] },
        ],
      };
      return SKIP;
    });
  };
}
