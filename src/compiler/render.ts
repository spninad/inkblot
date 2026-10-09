import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { compileReport } from './compile.js';
import { defaultComponents } from '../components/index.js';
import { Report } from '../components/layout/Report.js';
import { getTheme, getFontHeadTags } from '../themes/index.js';
import { getFullReportCss } from './css.js';
import { INKBLOT_CLIENT_SCRIPT } from '../runtime/client.js';
import { INKBLOT_THREE_SCRIPT } from '../runtime/three-runtime.js';
import type {
  CompiledReport,
  RenderHtmlOptions,
  RenderHtmlResult,
} from './types.js';

export async function renderReportToHtml(
  sourceOrCompiled: string | CompiledReport,
  options: RenderHtmlOptions = {}
): Promise<RenderHtmlResult> {
  const compiled: CompiledReport =
    typeof sourceOrCompiled === 'string'
      ? await compileReport(sourceOrCompiled, options)
      : sourceOrCompiled;

  const themeName =
    typeof options.theme === 'string'
      ? options.theme
      : compiled.frontmatter.theme || 'academic';

  const theme = getTheme(options.theme || themeName);

  // Evaluate the compiled MDX function body
  const { default: MDXContent } = await run(compiled.code, runtime);

  const mergedComponents = {
    ...defaultComponents,
    ...(options.components || {}),
  };

  // Build the complete React component tree
  const reportElement = React.createElement(
    Report,
    {
      title: compiled.frontmatter.title,
      date: compiled.frontmatter.date,
      abstract: compiled.frontmatter.abstract,
      toc: compiled.toc,
      theme: theme.name,
    },
    React.createElement(MDXContent, { components: mergedComponents })
  );

  const bodyHtml = renderToStaticMarkup(reportElement);
  const css = getFullReportCss(theme);

  const standalone = options.standalone !== false;

  if (!standalone) {
    return {
      html: bodyHtml,
      css,
      frontmatter: compiled.frontmatter,
      toc: compiled.toc,
    };
  }

  const fontTags = getFontHeadTags(theme.name);
  const clientScript =
    options.clientScript !== false
      ? `${INKBLOT_CLIENT_SCRIPT}\n\n${INKBLOT_THREE_SCRIPT}`
      : '';

  const fullHtml = `<!doctype html>
<html lang="en" data-theme="${theme.name}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${compiled.frontmatter.title || 'Scientific Report'}</title>
  ${fontTags}
  <style>
${css}
  </style>
</head>
<body>
  <div id="inkblot-tip" class="inkblot-tip" hidden></div>
  ${bodyHtml}
  ${clientScript ? `<script>\n${clientScript}\n</script>` : ''}
</body>
</html>`;

  return {
    html: fullHtml,
    css,
    frontmatter: compiled.frontmatter,
    toc: compiled.toc,
  };
}
