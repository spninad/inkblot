import type { ThemeConfig } from '../themes/types.js';
import type { ReportFrontmatter, TocEntry } from '../compiler/types.js';

export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
}

export interface SidebarItem {
  title: string;
  href: string;
  badge?: string;
  active?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SiteFooter {
  copyright?: string;
  links?: NavItem[];
}

export interface SiteConfig {
  title: string;
  description?: string;
  logo?: string;
  theme?: string | ThemeConfig;
  contentDir?: string; // Default: 'content'
  outDir?: string; // Default: 'dist'
  publicDir?: string; // Default: 'public'
  basePath?: string; // Default: '/'
  nav?: NavItem[];
  sidebar?: 'auto' | SidebarSection[];
  footer?: string | SiteFooter;
  search?: boolean; // Default: true
  ssr?: boolean;
}

export interface PageBreadcrumb {
  title: string;
  href: string;
}

export interface SitePage {
  slug: string; // e.g. "", "studies/study-1"
  route: string; // e.g. "/", "/studies/study-1"
  filePath: string; // Absolute path to .mdx file
  rawSource: string;
  frontmatter: ReportFrontmatter;
  toc: TocEntry[];
  breadcrumbs: PageBreadcrumb[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

export interface SearchIndexEntry {
  title: string;
  route: string;
  abstract?: string;
  headings: Array<{ title: string; anchor: string }>;
}
