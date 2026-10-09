import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compileReport } from '../compiler/compile.js';
import type {
  SiteConfig,
  SitePage,
  PageBreadcrumb,
  SidebarSection,
  SidebarItem,
  SearchIndexEntry,
} from './types.js';

function formatTitleFromSlug(segment: string): string {
  return segment
    .replace(/^([0-9]+-)/, '') // remove leading ordering digits like 01-intro
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function discoverSitePages(
  cwd: string,
  config: SiteConfig
): Promise<{
  pages: SitePage[];
  sidebar: SidebarSection[];
  searchIndex: SearchIndexEntry[];
}> {
  const contentDir = path.resolve(cwd, config.contentDir || 'content');
  if (!fs.existsSync(contentDir)) {
    return { pages: [], sidebar: [], searchIndex: [] };
  }

  const rawFiles: string[] = [];
  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        rawFiles.push(fullPath);
      }
    }
  }
  scan(contentDir);

  const pages: SitePage[] = [];

  for (const filePath of rawFiles) {
    const relPath = path.relative(contentDir, filePath);
    const parsed = path.parse(relPath);

    // Compute slug and route
    let slug: string;
    if (parsed.name === 'index') {
      slug = parsed.dir ? parsed.dir.replace(/\\/g, '/') : '';
    } else {
      slug = parsed.dir
        ? `${parsed.dir.replace(/\\/g, '/')}/${parsed.name}`
        : parsed.name;
    }

    const route = slug === '' ? '/' : `/${slug}`;
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    // Compile to extract TOC and frontmatter
    const compiled = await compileReport(rawContent);

    // Build breadcrumbs
    const breadcrumbs: PageBreadcrumb[] = [{ title: 'Home', href: '/' }];
    if (slug !== '') {
      const parts = slug.split('/');
      let accumulated = '';
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        accumulated += `/${part}`;
        const isLast = i === parts.length - 1;
        const crumbTitle = isLast
          ? compiled.frontmatter.title || formatTitleFromSlug(part)
          : formatTitleFromSlug(part);
        breadcrumbs.push({
          title: crumbTitle,
          href: accumulated,
        });
      }
    }

    pages.push({
      slug,
      route,
      filePath,
      rawSource: rawContent,
      frontmatter: compiled.frontmatter,
      toc: compiled.toc,
      breadcrumbs,
    });
  }

  // Sort pages: index first, then by frontmatter.order if present, then alphabetical
  pages.sort((a, b) => {
    if (a.route === '/') return -1;
    if (b.route === '/') return 1;
    const orderA = a.frontmatter.order != null ? Number(a.frontmatter.order) : Infinity;
    const orderB = b.frontmatter.order != null ? Number(b.frontmatter.order) : Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return a.route.localeCompare(b.route);
  });

  // Populate prevPage and nextPage
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      pages[i].prevPage = {
        title: pages[i - 1].frontmatter.title || pages[i - 1].route,
        href: pages[i - 1].route,
      };
    }
    if (i < pages.length - 1) {
      pages[i].nextPage = {
        title: pages[i + 1].frontmatter.title || pages[i + 1].route,
        href: pages[i + 1].route,
      };
    }
  }

  // Build sidebar
  let sidebar: SidebarSection[] = [];
  if (config.sidebar === 'auto' || !config.sidebar) {
    const grouped = new Map<string, SidebarItem[]>();

    for (const page of pages) {
      const parts = page.slug.split('/');
      const sectionName = parts.length > 1 ? formatTitleFromSlug(parts[0]) : 'Overview';
      if (!grouped.has(sectionName)) {
        grouped.set(sectionName, []);
      }
      grouped.get(sectionName)!.push({
        title: page.frontmatter.title || formatTitleFromSlug(parts[parts.length - 1] || 'Home'),
        href: page.route,
      });
    }

    sidebar = Array.from(grouped.entries()).map(([title, items]) => ({
      title: title === 'Overview' && grouped.size === 1 ? undefined : title,
      items,
    }));
  } else {
    sidebar = config.sidebar;
  }

  // Build search index
  const searchIndex: SearchIndexEntry[] = pages.map((page) => ({
    title: page.frontmatter.title || page.route,
    route: page.route,
    abstract: page.frontmatter.abstract,
    headings: page.toc.map((t) => ({
      title: t.title,
      anchor: t.id,
    })),
  }));

  return { pages, sidebar, searchIndex };
}
