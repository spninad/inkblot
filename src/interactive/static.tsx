import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticControlsContext, type StaticControls } from './context.js';
import { controlRegistry } from './registry.js';

/** Prose stays static; each interactive boundary has its own stable hydration IDs. */
export function renderStaticPage(element: React.ReactNode, enabled = true): string {
  let sequence = 0;
  const context: StaticControls = {
    enabled,
    content: (node) =>
      renderToStaticMarkup(
        <StaticControlsContext.Provider value={context}>{node}</StaticControlsContext.Provider>,
      ),
    island(name, props) {
      const Component = controlRegistry[name];
      if (!Component) throw new Error(`Unknown Inkblot control: ${name}`);
      const id = `ib-${++sequence}-`;
      const html = renderToString(<Component {...props} />, { identifierPrefix: id });
      return (
        <div
          data-inkblot-island={name}
          data-inkblot-id={id}
          data-inkblot-props={JSON.stringify(props)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    },
  };
  return context.content(element);
}
