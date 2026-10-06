import type { TocEntry } from './types.js';

/**
 * Extracts TOC entries from markdown headings and MDX JSX Section elements.
 */
export function remarkExtractToc(tocEntries: TocEntry[]) {
  return (tree: any) => {
    let sectionCounter = 0;

    function getNodeText(node: any): string {
      if (!node) return '';
      if (node.value) return node.value;
      if (node.children && Array.isArray(node.children)) {
        return node.children.map(getNodeText).join('');
      }
      return '';
    }

    function slugify(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    function walk(node: any) {
      if (!node) return;

      // 1. Standard markdown headings: ## Heading or ### Subheading
      if (node.type === 'heading') {
        const text = getNodeText(node).trim();
        const level = node.depth;

        // Skip h1 (usually document title)
        if (level >= 2 && level <= 3) {
          // Check if heading text starts with a number like "1 Introduction" or "1.1 The problem"
          const match = text.match(/^([0-9]+(?:\.[0-9]+)*)\s*(.+)$/);
          let numberStr: string | undefined;
          let titleStr = text;

          if (match) {
            numberStr = match[1];
            titleStr = match[2];
          } else if (level === 2) {
            sectionCounter++;
            numberStr = String(sectionCounter);
          }

          const id = node.data?.id || slugify(text);

          tocEntries.push({
            id,
            title: titleStr,
            number: numberStr,
            level,
            sub: level === 3,
          });
        }
      }

      // 2. MDX JSX Elements: <Section title="..." number="..." id="..." />
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (node.name === 'Section' || node.name === 'Subsection') {
          const isSubsection = node.name === 'Subsection';
          const level = isSubsection ? 3 : 2;

          let title = '';
          let number: string | number | undefined;
          let id = '';

          if (Array.isArray(node.attributes)) {
            for (const attr of node.attributes) {
              if (attr.name === 'title' && typeof attr.value === 'string') {
                title = attr.value;
              } else if (attr.name === 'number') {
                number = typeof attr.value === 'string' ? attr.value : attr.value?.value;
              } else if (attr.name === 'id' && typeof attr.value === 'string') {
                id = attr.value;
              }
            }
          }

          if (title) {
            if (!number && !isSubsection) {
              sectionCounter++;
              number = sectionCounter;
            }
            if (!id) {
              id = isSubsection ? `sub-${slugify(title)}` : `s${number || slugify(title)}`;
            }

            tocEntries.push({
              id,
              title,
              number,
              level,
              sub: isSubsection,
            });
          }
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }

    walk(tree);
  };
}
