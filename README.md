# Inkblot

> Scientific and technical report generator and component library from MDX.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Inkblot is both a **reusable library** and a **command-line tool** for authoring, compiling, and rendering interactive, publication-grade scientific reports from MDX documents.

---

## Highlights

- 📄 **Static Output by Default**: Produces standalone single-file HTML reports (with CSS, math, and SVGs embedded), static web directories ready for Vercel/S3, or ZIP archives.
- ⚛️ **Programmatic Web App API**: Render reports directly inside Next.js (SSR, SSG, ISR) or React applications.
- 📊 **Scientific Primitives**: Pre-built components for Dot/Forest plots with 95% confidence intervals, XY trade-off frontiers, data tables, summary tables, question callouts, asides, glossaries, and KaTeX math.
- 🎨 **Configurable Themes**: Beautiful typography inspired by academic monographs (*Literata* + *Inter*), plus modern sans and classic LaTeX themes with light and dark mode.
- ⚡ **Zero-Runtime SVG Charts**: Semantic SVG charts rendered on the server with interactive tooltips and accessible data table toggles.

---

## Quickstart

```bash
# 1. Install
bun add inkblot
# or: npm install inkblot

# 2. Build a standalone single-file HTML report
inkblot build report.mdx

# 3. Generate a static directory deployable directly to Vercel or S3
inkblot build report.mdx --format dir -o dist/ --zip

# 4. Run local preview with live reload
inkblot dev report.mdx --port 3000
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
