import React from 'react';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { loadSiteConfig } from '../site/config.js';
import { discoverSitePages } from '../site/content.js';
import { SiteLayout } from '../site/layout/SiteLayout.js';
import { Report } from '../components/layout/Report.js';
import { defaultComponents } from '../components/index.js';
import { getTheme } from '../themes/index.js';
import { compileReport } from '../compiler/compile.js';
import type { SiteConfig, SitePage } from '../site/types.js';

export interface NextInkblotOptions {
  config: SiteConfig;
  cwd?: string;
  basePath?: string;
}

export function createNextInkblotSite(options: NextInkblotOptions) {
  const cwd = options.cwd || process.cwd();
  const config = options.config;
  const basePath = options.basePath || config.basePath || '/';

  return {
    /**
     * Next.js App Router: generateStaticParams
     */
    async generateStaticParams() {
      const { pages } = await discoverSitePages(cwd, config);
      return pages.map((page) => {
        const slugArray = page.slug === '' ? [] : page.slug.split('/');
        return { slug: slugArray };
      });
    },

    /**
     * Next.js App Router: generateMetadata
     */
    async generateMetadata({ params }: { params: { slug?: string[] } }) {
      const { pages } = await discoverSitePages(cwd, config);
      const slugStr = (params.slug || []).join('/');
      const page = pages.find((p) => p.slug === slugStr);

      if (!page) {
        return { title: config.title };
      }

      return {
        title: page.frontmatter.title
          ? `${page.frontmatter.title} | ${config.title}`
          : config.title,
        description: page.frontmatter.abstract || config.description,
      };
    },

    /**
     * Next.js App Router: renderPage
     */
    async renderPage(slug?: string[]) {
      const { pages, sidebar } = await discoverSitePages(cwd, config);
      const slugStr = (slug || []).join('/');
      const page = pages.find((p) => p.slug === slugStr);

      if (!page) {
        return (
          <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
            <h2>404 - Report Not Found</h2>
            <p>No report exists for route: <code>/{slugStr}</code></p>
          </div>
        );
      }

      const theme = getTheme(config.theme || 'academic');
      const compiled = await compileReport(page.rawSource);
      const { default: MDXContent } = await run(compiled.code, runtime);

      const reportElement = React.createElement(
        Report,
        {
          title: page.frontmatter.title,
          date: page.frontmatter.date,
          abstract: page.frontmatter.abstract,
          toc: page.toc,
          theme: theme.name,
        },
        React.createElement(MDXContent, { components: defaultComponents })
      );

      return (
        <SiteLayout
          config={config}
          page={page}
          sidebar={sidebar}
          basePath={basePath}
        >
          {reportElement}
        </SiteLayout>
      );
    },

    /**
     * Next.js Pages Router: getStaticPaths
     */
    async getStaticPaths() {
      const { pages } = await discoverSitePages(cwd, config);
      const paths = pages.map((p) => ({
        params: { slug: p.slug === '' ? [] : p.slug.split('/') },
      }));
      return { paths, fallback: false };
    },

    /**
     * Next.js Pages Router: getStaticProps
     */
    async getStaticProps({ params }: { params: { slug?: string[] } }) {
      const { pages } = await discoverSitePages(cwd, config);
      const slugStr = (params?.slug || []).join('/');
      const page = pages.find((p) => p.slug === slugStr);

      if (!page) {
        return { notFound: true };
      }

      return {
        props: {
          slug: params?.slug || [],
        },
      };
    },
  };
}
