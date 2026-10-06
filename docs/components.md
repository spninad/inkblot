# Scientific MDX Component Library

Inkblot provides a standardized library of React components tailored for technical papers, scientific reports, and research summaries.

All components are automatically available in the MDX execution scope without requiring `import` statements at the top of the document.

---

## Document Layout

### `<Report>`
Top-level layout container that renders the sticky sidebar Table of Contents on desktop, collapsible TOC on mobile, masthead header, and main article grid.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Report title displayed in the masthead. |
| `date` | `string` | Publication date string. |
| `abstract` | `ReactNode \| string` | Abstract text or formatted `<Abstract>` block. |
| `toc` | `TocItem[]` | Table of Contents hierarchy. |

---

### `<Section>` and `<Subsection>`
Numbered sections and subsections that automatically generate anchor IDs for TOC linking.

```mdx
<Section number="1" title="Introduction" id="intro">
  Content for section 1...

  <Subsection number="1.1" title="Problem Formulation" id="problem">
    Content for section 1.1...
  </Subsection>
</Section>
```

---

### `<Abstract>`
Dedicated container for academic abstracts with centered subtitle styling.

```mdx
<Abstract title="Abstract">
  <p>This report details seven empirical studies...</p>
</Abstract>
```

---

## Data Presentation

### `<Table>`
Publication-grade scientific table supporting tabular numerals, right-aligned numeric columns, and row highlighting.

```mdx
<Table
  caption={<><b>Table 2.</b> Evaluation benchmarks on PointMaze.</>}
  columns={[
    { key: "method", label: "Method" },
    { key: "episodes", label: "Episodes", numeric: true },
    { key: "success", label: "Success Rate", numeric: true },
    { key: "ci", label: "95% Interval", numeric: true }
  ]}
  data={[
    { method: "No Adaptation", episodes: 60, success: "86.7%", ci: "75.8% to 93.1%" },
    { method: "Planning-Sensitivity", episodes: 60, success: "88.3%", ci: "77.8% to 94.2%" }
  ]}
  highlightRows={[1]}
/>
```

---

### `<SummaryTable>`
Compact overview table matching the study summary table in the reference monograph.

```mdx
<SummaryTable
  caption={<><b>Table 1.</b> Studies and experimental outcomes.</>}
  headers={["Study", "Question", "Setting", "Outcome"]}
  rows={[
    {
      id: 1,
      title: "Planning-aware adaptation",
      subtitle: "Does weighting model updates improve decisions?",
      href: "#s1",
      setting: "PointMaze, JEPA world model",
      outcome: "No difference under pre-registered threshold"
    }
  ]}
/>
```

---

## Scientific Charts & Visualizations

### `<Figure>`
Figure frame with title, subtitle, optional legend, caption, and accessible data table toggle.

```mdx
<Figure
  id="fig-1"
  title="Figure 1. Convergence rates."
  caption="Comparison across six random seeds."
>
  {/* Chart content */}
</Figure>
```

---

### `<DotPlot>`
Generates publication-quality dot-row and forest plots with confidence intervals, stems, dodges, and interactive tooltips.

```mdx
<DotPlot
  rows={['Default', 'Damping ×5', 'Damping ×10', 'Damping ×20']}
  rowHead="Condition"
  metric="Success rate"
  labelW={120}
  x={{
    min: 0,
    max: 1,
    ticks: [0, 0.25, 0.5, 0.75, 1],
    format: "percent",
    label: "Success rate"
  }}
  series={[
    {
      name: "No adaptation",
      color: "--s0",
      values: [
        { v: 0.867, lo: 0.758, hi: 0.931 },
        { v: 0.883, lo: 0.778, hi: 0.942 },
        { v: 0.867, lo: 0.758, hi: 0.931 },
        { v: 0.667, lo: 0.541, hi: 0.773 }
      ]
    },
    {
      name: "Standard adaptation",
      color: "--s1",
      values: [
        { v: 0.883, lo: 0.778, hi: 0.942 },
        { v: 0.883, lo: 0.778, hi: 0.942 },
        { v: 0.867, lo: 0.758, hi: 0.931 },
        { v: 0.600, lo: 0.474, hi: 0.714 }
      ]
    }
  ]}
  legend={true}
  showDataTable={true}
/>
```

---

### `<XYPlot>`
Generates XY line, frontier, and scatter plots with interactive hover hit points.

```mdx
<XYPlot
  x={{ min: 0, max: 70, ticks: [0, 20, 40, 60], format: "percent", label: "Predictor steps saved" }}
  y={{ min: 0, max: 100, ticks: [0, 25, 50, 75, 100], format: "percent", label: "Exact elite preserved" }}
  points={[
    { x: 0, y: 100, name: "Budget 200", label: "budget 200" },
    { x: 16, y: 17.4, name: "Budget 160", label: "160" }
  ]}
  extra={[
    { x: 0.83, y: 99.8, name: "Calibrated gate", label: "calibrated: 99.8%" }
  ]}
  showDataTable={true}
/>
```

---

### `<Diagram>`
Container for SVG workflow and architecture diagrams with pre-styled arrow markers (`markerEnd="url(#ah)"`).

```mdx
<Diagram viewBox="0 0 780 200" ariaLabel="Flow Diagram">
  <rect x="20" y="50" width="120" height="60" rx="6" className="dg-box" />
  <text x="80" y="85" textAnchor="middle" className="dg-t">Encoder</text>

  <line x1="140" y1="80" x2="220" y2="80" className="dg-line" markerEnd="url(#ah)" />

  <rect x="220" y="50" width="120" height="60" rx="6" className="dg-box-accent" />
  <text x="280" y="85" textAnchor="middle" className="dg-t">Planner</text>
</Diagram>
```

---

## Interactive Primitives

### `<Question>`
Indented callout box with accent left border for highlighting central research hypotheses or questions.

```mdx
<Question>
Does updating the model online during closed-loop deployment improve decision quality?
</Question>
```

---

### `<Aside>` (alias: `<Callout>`)
Styled card for supplementary commentary, background notes, or technical caveats.

```mdx
<Aside title="Note on Latent Space">
Latent world models do not decode into observation pixels, saving substantial GPU memory.
</Aside>
```

---

### `<Tabs>` and `<Tab>`
Interactive tab switcher for presenting alternative datasets or comparative views.

```mdx
<Tabs items={[
  { label: "Walker", content: <p>Walker environment metrics...</p> },
  { label: "Quadruped", content: <p>Quadruped environment metrics...</p> }
]} />
```

---

### `<Collapse>`
Scientific collapsible details disclosure block.

```mdx
<Collapse summary="Click to view derivation of the loss objective">
  <Equation math="\mathcal{L} = \frac{1}{2} \|y - \hat{y}\|^2" />
</Collapse>
```

---

### `<Glossary>` and `<GlossaryItem>`
Two-column definition list for terminology and definitions.

```mdx
<Glossary>
  <GlossaryItem term="World Model">
    A model predicting next states given current states and actions.
  </GlossaryItem>
  <GlossaryItem term="MPC">
    Model-predictive control through simulated trajectory rollouts.
  </GlossaryItem>
</Glossary>
```

---

## Mathematical Typography

### `<Equation>` (alias: `<Math>`)
Displays centered, beautifully rendered mathematical equations via KaTeX.

```mdx
<Equation math="\mathbb{E}_{s \sim \mathcal{D}} \left[ \nabla_\theta \log \pi_\theta(a|s) Q^\pi(s,a) \right]" />
```
