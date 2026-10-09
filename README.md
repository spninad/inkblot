# Inkblot

> Scientific and technical report generator and component library from MDX.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Inkblot is both a **reusable library** and a **command-line tool** for authoring, compiling, and rendering interactive, publication-grade scientific reports from MDX documents.

---

## Highlights

- 📄 **Static Output by Default**: Produces standalone single-file HTML reports (with CSS, math, and SVGs embedded), static web directories ready for Vercel/S3, or ZIP archives.
- 🌐 **Hugo-like Multi-Page Site Engine**: Build complete report sites and documentation portals with `inkblot.config.ts`, file-system routing, global navigation, sidebars, search index, and on-demand SSR.
- ⚛️ **Next.js Adapter & React API**: Mount full report sites or individual documents in Next.js App Router (`inkblot/next`) with SSR, SSG, or ISR.
- 📊 **Scientific Primitives**: Pre-built components for Dot/Forest plots with 95% confidence intervals, XY trade-off frontiers, data tables, summary tables, question callouts, asides, glossaries, and KaTeX math.
- 🎨 **Configurable Themes**: Beautiful typography inspired by academic monographs (*Literata* + *Inter*), plus modern sans and classic LaTeX themes with light and dark mode.
- ⚡ **Zero-Runtime SVG Charts**: Semantic SVG charts rendered on the server with interactive tooltips and accessible data table toggles.

---

## Quickstart

### 1. Single Report
```bash
# Build standalone single-file HTML report
inkblot build report.mdx

# Live preview
inkblot dev report.mdx --port 3000
```

### 2. Multi-Page Site (Hugo-like)
```bash
# Scaffold a new multi-page report site
inkblot site init my-site

# Start dev server with on-demand SSR & live reload
inkblot site dev

# Build static production site to dist/
inkblot site build
```

---

## Example MDX

```mdx
---
title: "Planning with Learned World Models Under Limited Data"
date: "October 2026"
abstract: "Empirical record of seven studies in model rollouts."
theme: "academic"
---

<Section number="1" title="Introduction" id="intro">

<Question>
How should an agent learn when interaction with the environment is expensive?
</Question>

<Aside title="Latent World Models">
World models in the JEPA family operate directly in latent representations.
</Aside>

<Figure id="fig-success" title="Figure 1. Benchmark Success Rates.">
  <DotPlot
    rows={['Default', 'Damping ×5', 'Damping ×10', 'Damping ×20']}
    x={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], format: "percent" }}
    series={[
      { name: "Unadapted", color: "--s0", values: [{ v: 0.867, lo: 0.758, hi: 0.931 }, ...] },
      { name: "Adapted", color: "--s1", values: [{ v: 0.883, lo: 0.778, hi: 0.942 }, ...] }
    ]}
    legend={true}
    showDataTable={true}
  />
</Figure>

<Equation math="\mathcal{L}_{\text{energy}}(y, \hat{Y}) = \frac{1}{K}\sum_{k=1}^K \|y - \hat{y}_k\|_2" />

</Section>
```

---

## Documentation

Full documentation is available in the [`docs/`](./docs) directory:

- [Quickstart Guide](./docs/quickstart.md)
- [CLI Reference](./docs/cli.md)
- [Programmatic API (Next.js / React)](./docs/api.md)
- [Scientific MDX Component Catalog](./docs/components.md)
- [Theme Engine & Styling](./docs/themes.md)
- [System Architecture](./docs/architecture.md)

---

## License

MIT
