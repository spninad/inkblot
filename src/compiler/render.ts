import React from 'react';
import { renderStaticPage } from '../interactive/static.js';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { compileReport } from './compile.js';
import { defaultComponents } from '../components/index.js';
import { Report } from '../components/layout/Report.js';
import { getTheme, getFontHeadTags, resolveAppearance, appearanceInit } from '../themes/index.js';
import { getFullReportCss, getBrowserScript } from './css.js';
import type { CompiledReport, RenderHtmlOptions, RenderHtmlResult } from './types.js';

export async function renderReportToHtml(
  sourceOrCompiled: string | CompiledReport,
  options: RenderHtmlOptions = {},
): Promise<RenderHtmlResult> {
  const compiled: CompiledReport =
    typeof sourceOrCompiled === 'string'
      ? await compileReport(sourceOrCompiled, options)
      : sourceOrCompiled;

  const themeName =
    typeof options.theme === 'string' ? options.theme : compiled.frontmatter.theme || 'academic';

  const theme = getTheme(options.theme || themeName);

  const picker = options.themePicker ?? compiled.frontmatter.themePicker ?? false;
  const appearance = resolveAppearance(theme, options.clientScript === false ? false : picker);
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
      theme,
      themePicker: options.clientScript === false ? false : picker,
    },
    React.createElement(MDXContent, { components: mergedComponents }),
  );

  const bodyHtml = renderStaticPage(reportElement, options.clientScript !== false);
  const css = getFullReportCss(
    theme,
    appearance.themes.map((t) => t.name),
  );

  const script = options.clientScript !== false ? getBrowserScript() : '';
  const standalone = options.standalone !== false;

  if (!standalone) {
    return {
      html: bodyHtml,
      script,
      css,
      frontmatter: compiled.frontmatter,
      toc: compiled.toc,
    };
  }

  const fontTags = getFontHeadTags(
    appearance.themes.length ? appearance.themes.map((t) => t.name) : theme.name,
  );
  const clientScript = script;

  const fullHtml = `<!doctype html>
<html lang="en" class="inkblot-root" data-inkblot-root data-inkblot-generated data-theme="${theme.name}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${compiled.frontmatter.title || 'Scientific Report'}</title>
  ${options.clientScript !== false ? `<script>${appearanceInit(appearance)}</script>` : ''}
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
    script,
    css,
    frontmatter: compiled.frontmatter,
    toc: compiled.toc,
  };
}
