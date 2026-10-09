# Inkblot Documentation

Welcome to **Inkblot**, a command-line tool and reusable library for authoring and generating publication-grade scientific and technical reports from MDX documents.

Inkblot was created to make generating interactive scientific reports lightweight, consistent, and portable. Authors and autonomous agents primarily need to write standard MDX with structured scientific components, and then either:

1. **Use the CLI** to produce portable static output (a single self-contained HTML file, a static hosting directory, or a ZIP package); or
2. **Use the Library** to compile and render that same MDX document inside an existing React or Next.js web application.

---

## Key Features

- **Academic Monograph Styling**: Calibrated serif body text (*Literata*), clean sans-serif UI and data labels (*Inter*), and tabular figures for numbers.
- **Dual Architecture**: Clean separation between the MDX compilation/rendering layer (`inkblot`) and the static bundler CLI (`inkblot build`).
- **Zero-Config Static Hosting**: Static directory output ready for instant deployment to Vercel, S3, Netlify, or Cloudflare Pages with no post-processing.
- **Self-Contained Standalone Artifacts**: Inlines CSS, KaTeX math stylesheets, semantic SVGs, and client scripts into a single `.html` file.
- **Scientific Component Primitives**: Pre-built components for dot/forest plots, XY frontier charts, data tables, summary tables, question callouts, asides, glossaries, tabs, and math.
- **Tufte Visualizations**: Maximize data-ink ratio with embedded word-sized `<Sparkline>` micro-graphics, paired `<Slopegraph>` comparisons, and aligned `<SmallMultiples>`.
- **Interactive 3D WebGL**: Native Three.js integration (`<Plot3D>`) for interactive loss landscapes, parameter manifolds, and agent trajectory rollouts with orbit drag and zoom.
- **Configurable Theme Engine**: Built-in `academic`, `modern`, and `classic` themes with automatic or toggleable dark mode support.
- **Programmatic React / Next.js API**: Full support for Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), and runtime dynamic rendering.

---

## Documentation Index

- [Quickstart & Tutorial](./quickstart.md) - Build your first scientific report in 5 minutes.
- [Multi-Page Site Engine (Hugo-like)](./site.md) - Build multi-page publication portals and documentation sites with config files, routing, search, and Next.js.
- [CLI Reference](./cli.md) - Complete documentation for `inkblot build`, `inkblot dev`, and `inkblot site`.
- [Programmatic API](./api.md) - Using Inkblot in Next.js, Remix, and React web apps.
- [Component Catalog](./components.md) - Props and usage examples for all scientific report components.
- [Theme Engine & Styling](./themes.md) - Customizing CSS variables, dark mode, and custom themes.
- [System Architecture](./architecture.md) - Pipeline design, micro-runtime, and static bundling.

---

## Installation

Using [Bun](https://bun.sh/):
```bash
bun add inkblot
```

Or using npm / pnpm:
```bash
npm install inkblot
# or
pnpm add inkblot
```
