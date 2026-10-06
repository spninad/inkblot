# Quickstart Guide

This guide walks you through creating and building your first scientific report using Inkblot.

---

## 1. Create a Report MDX Document

Create a file named `my-report.mdx`:

```mdx
---
title: "Empirical Analysis of Diffusion Planners"
date: "October 2026"
abstract: |
  We investigate trajectory sampling using learned diffusion models in continuous
  control domains. Under constrained inference budgets, guided sampling improves
  trajectory feasibility without retraining.
theme: "academic"
---

<Section number="1" title="Introduction" id="intro">

<Subsection number="1.1" title="Motivation" id="motivation">

Trajectory optimization in high-dimensional continuous state spaces requires balancing
computational latency with path optimality.

<Question>
Can classifier-free guidance preserve task success rates when denoising steps are halved?
</Question>

<Aside title="Sampling Budget">
Standard diffusion rollouts require 50-100 denoising iterations. In robotics,
closed-loop frequencies require sub-50ms execution.
</Aside>

</Subsection>

<Subsection number="1.2" title="Benchmark Results" id="results">

<Table
  caption={<><b>Table 1.</b> Benchmark success rates under compute constraints.</>}
  columns={[
    { key: "env", label: "Environment" },
    { key: "steps", label: "Denoising Steps", numeric: true },
    { key: "success", label: "Success Rate", numeric: true }
  ]}
  data={[
    { env: "PointMaze-v2", steps: 50, success: "88.4%" },
    { env: "PointMaze-v2", steps: 25, success: "86.1%" },
    { env: "PointMaze-v2", steps: 10, success: "72.0%" }
  ]}
  highlightRows={[1]}
/>

</Subsection>

</Section>

<Section number="2" title="Mathematical Formulation" id="math">

The reverse denoising objective is defined as:

<Equation math="\mu_\theta(x_t, t) = \frac{1}{\sqrt{\alpha_t}} \left( x_t - \frac{\beta_t}{\sqrt{1 - \bar{\alpha}_t}} \epsilon_\theta(x_t, t) \right)" />

</Section>
```

---

## 2. Compile to Standalone HTML

Run the `inkblot build` command:

```bash
inkblot build my-report.mdx
```

This compiles your MDX document and creates `my-report.html`. This file is completely self-contained with:
- All styles and fonts pre-wired.
- KaTeX math styling inlined.
- Interactive Table of Contents with scroll-spy.
- Zero external build or server dependencies—double-click `my-report.html` to open it in any browser!

---

## 3. Generate a Deployable Web Directory

To deploy your report to static hosting (such as Vercel, S3, or Netlify):

```bash
inkblot build my-report.mdx --format dir -o dist/
```

This generates:
- `dist/index.html`
- `dist/assets/style.css`
- `dist/assets/inkblot.js`

To also generate a ZIP archive of the entire folder:

```bash
inkblot build my-report.mdx --format dir -o dist/ --zip
```

---

## 4. Live Authoring with Dev Mode

To edit your report with live reloads:

```bash
inkblot dev my-report.mdx --port 3000
```

Open `http://localhost:3000` in your browser. Whenever you edit and save `my-report.mdx`, the browser updates automatically.
