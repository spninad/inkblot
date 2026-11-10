# Multi-Page Site Engine (Hugo-like)

Inkblot provides a complete multi-page static site generator and SSR engine modeled on the speed, simplicity, and directory conventions of tools like Hugo, VitePress, and Docusaurus.

You can configure an entire research publication site, technical documentation portal, or laboratory archive using a single configuration file (`inkblot.config.ts`), a folder of MDX documents (`content/`), and static assets (`public/`).

---

## Quickstart: Creating a Multi-Page Site

### 1. Initialize a Site

Run `inkblot site init`:
```bash
inkblot site init my-site
cd my-site
```

This scaffolds:
```text
my-site/
├── inkblot.config.ts      # Site configuration
├── content/               # MDX reports & documents
│   ├── index.mdx          # Home page (route: /)
│   ├── benchmarks.mdx     # Route: /benchmarks
│   └── studies/
│       └── study-1.mdx    # Route: /studies/study-1
└── public/                # Static assets (images, PDFs)
```

### 2. Start Live Development (On-demand SSR)

```bash
inkblot site dev
```
Open `http://localhost:3000` in your browser. Any change to your MDX files or configuration triggers an instant live reload over Server-Sent Events (SSE).

### 3. Build for Production (SSG)

```bash
inkblot site build
```
Generates a deployable static site inside `dist/` in under 200 milliseconds.

### 4. Serve the Production Build

```bash
inkblot site serve --port 3000
```

---

## Configuration Reference: `inkblot.config.ts`

```ts
import { defineConfig } from 'inkblot/site';

export default defineConfig({
  // Site Metadata
  title: 'AI Research Lab Reports',
  description: 'Technical records and scientific monographs',
  logo: '/logo.svg', // Optional logo in header

  // Theme: 'academic' | 'modern' | 'classic' | custom ThemeConfig
  theme: 'academic',

  // Directory paths
  contentDir: 'content', // Root folder containing MDX files
  outDir: 'dist',        // Destination folder for static build
  publicDir: 'public',   // Assets copied directly to root of outDir
  basePath: '/',         // URL prefix if hosted on a subpath (e.g. '/research/')

  // Top Navigation Bar Links
  nav: [
    { title: 'Home', href: '/' },
    { title: 'Studies', href: '/studies/study-1' },
    { title: 'Benchmarks', href: '/benchmarks' },
    { title: 'GitHub', href: 'https://github.com/my-lab/reports', external: true },
  ],

  // Multi-page Sidebar: 'auto' (derived from directory hierarchy) or explicit array
  sidebar: 'auto',
  /* Or explicit sections:
  sidebar: [
    {
      title: 'Monographs',
      items: [
        { title: 'Study 1: Adaptation', href: '/studies/study-1', badge: 'New' },
        { title: 'Study 2: Hypotheses', href: '/studies/study-2' },
      ],
    },
    {
      title: 'Benchmarks',
      items: [
        { title: 'Continuous Control', href: '/benchmarks' },
      ],
    },
  ],
  */

  // Site Footer
  footer: {
    copyright: '© 2026 AI Research Lab. All rights reserved.',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Contact', href: '/contact' },
    ],
  },

  // Optional reader language picker. Omit for a fixed language.
  themePicker: { themes: ['academic', 'journal', 'paper'] },

  // Search: enables client-side instant search modal (Ctrl+K or /)
  search: true,
});
```

---

## File-System Routing

Pages are mapped automatically based on their location inside `contentDir`:

| File Path | Output Route | Breadcrumb Hierarchy |
| :--- | :--- | :--- |
| `content/index.mdx` | `/` | `Home` |
| `content/benchmarks.mdx` | `/benchmarks` | `Home / Benchmarks` |
| `content/studies/index.mdx` | `/studies` | `Home / Studies` |
| `content/studies/study-1.mdx`| `/studies/study-1` | `Home / Studies / Study 1` |
| `content/nested/deep/report.mdx` | `/nested/deep/report` | `Home / Nested / Deep / Report` |

### Ordering Pages
Pages are sorted in the sidebar:
1. `index.mdx` is always first.
2. By the `order` property in MDX frontmatter (e.g. `order: 1`, `order: 2`).
3. Numerically/alphabetically by filename or title.

---

## Site Features

### 1. Unified Site Shell & Layout
Every page is rendered with:
- **Top Header**: Brand logo/title, top nav items, instant search button, and theme switcher.
- **Sidebar**: Multi-page site tree on desktop, collapsible on mobile. Active links are highlighted automatically.
- **Breadcrumbs**: Hierarchical route links.
- **In-Page TOC**: The scientific report's own sticky section TOC with scroll-spy.
- **Pagination**: "Previous" and "Next" study links at the bottom of each report.

### 2. Instant Client Search (Ctrl+K or `/`)
- When `search: true` is enabled, `inkblot site build` generates a lightweight `search-index.json`.
- Users can press `/` or `Ctrl+K` (`Cmd+K` on Mac) anywhere on the site to trigger a search dialog that searches report titles, abstracts, and section headings with direct deep-links.

### 3. Dark Mode Switching
- A theme toggle button in the header switches between light and dark modes.
- User preference is saved in `localStorage` and respected across navigation.

---

## Next.js Integration: `inkblot/next`

If you have an existing Next.js application (using the App Router or Pages Router), you can mount the entire multi-page report site directly inside your app using the same `inkblot.config.ts`:

### Next.js App Router Catch-All Route

Create `app/reports/[[...slug]]/page.tsx`:

```tsx
import { createNextInkblotSite } from 'inkblot/next';
import config from '@/inkblot.config';
import 'inkblot/style.css';
import 'inkblot/site.css';

const site = createNextInkblotSite({
  config,
  basePath: '/reports',
});

// SSG: Generates static routes at build time
export const generateStaticParams = site.generateStaticParams;

// Metadata: Sets page title & description from frontmatter
export const generateMetadata = site.generateMetadata;

// Renders the page with SiteLayout, breadcrumbs, sidebar, and report
export default async function ReportPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  return site.renderPage(params.slug);
}
```

### Next.js Pages Router

Create `pages/reports/[[...slug]].tsx`:

```tsx
import { createNextInkblotSite } from 'inkblot/next';
import config from '@/inkblot.config';
import 'inkblot/style.css';
import 'inkblot/site.css';

const site = createNextInkblotSite({ config, basePath: '/reports' });

export const getStaticPaths = site.getStaticPaths;
export const getStaticProps = site.getStaticProps;

export default function Page({ slug }: { slug: string[] }) {
  return site.renderPage(slug);
}
```

---

## CLI Command Summary

```bash
# Initialize a new multi-page report site
inkblot site init [dir]

# Build static multi-page site
inkblot site build [-c inkblot.config.ts] [-o dist]

# Start dev server with on-demand SSR & live reload
inkblot site dev [-c inkblot.config.ts] [-p 3000]

# Serve built static production site
inkblot site serve [-o dist] [-p 3000]
```
