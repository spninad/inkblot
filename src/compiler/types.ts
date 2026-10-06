import type { PluggableList } from 'unified';
import type React from 'react';
import type { ThemeConfig } from '../themes/types.js';

export interface ReportFrontmatter {
  title?: string;
  date?: string;
  abstract?: string;
  theme?: string;
  author?: string;
  authors?: string[];
  [key: string]: any;
}

export interface TocEntry {
  id: string;
  title: string;
  level: number;
  number?: string | number;
  sub?: boolean;
}

export interface CompileReportOptions {
  theme?: string | ThemeConfig;
  components?: Record<string, React.ComponentType<any>>;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  development?: boolean;
}

export interface CompiledReport {
  code: string;
  frontmatter: ReportFrontmatter;
  toc: TocEntry[];
  rawSource: string;
}

export interface RenderHtmlOptions extends CompileReportOptions {
  standalone?: boolean; // default true
  embedFonts?: boolean;
  inlineCss?: boolean; // default true
  clientScript?: boolean; // default true
  className?: string;
}

export interface RenderHtmlResult {
  html: string;
  css: string;
  frontmatter: ReportFrontmatter;
  toc: TocEntry[];
}
