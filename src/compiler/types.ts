import type { PluggableList } from 'unified';
import type React from 'react';
import type { ThemeConfig, ThemePickerConfig } from '../themes/types.js';

export interface ReportFrontmatter {
  title?: string;
  date?: string;
  abstract?: string;
  theme?: string;
  themePicker?: ThemePickerConfig;
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
  themePicker?: ThemePickerConfig;
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
  /** Self-contained runtime for component-only HTML consumers. Empty when clientScript is false. */
  script: string;
  html: string;
  css: string;
  frontmatter: ReportFrontmatter;
  toc: TocEntry[];
}
