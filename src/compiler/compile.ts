import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remarkExtractToc } from './toc.js';
import type { CompileReportOptions, CompiledReport, TocEntry } from './types.js';

export async function compileReport(
  source: string,
  options: CompileReportOptions = {}
): Promise<CompiledReport> {
  const { data: frontmatter, content } = matter(source);
  const toc: TocEntry[] = [];

  const remarkPlugins = [
    remarkGfm,
    remarkMath,
    () => remarkExtractToc(toc),
    ...(options.remarkPlugins || []),
  ];

  const rehypePlugins = [
    rehypeSlug,
    rehypeKatex,
    ...(options.rehypePlugins || []),
  ];

  const vfile = await compile(content, {
    outputFormat: 'function-body',
    development: options.development ?? false,
    remarkPlugins,
    rehypePlugins,
  });

  return {
    code: String(vfile),
    frontmatter,
    toc,
    rawSource: content,
  };
}
