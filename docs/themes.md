# Theme Engine & Styling

Inkblot features a clean, CSS-variable-driven theme system. The styling works consistently whether reports are built as standalone HTML or rendered inside larger React/Next.js web applications.

---

## Built-in Themes

| Theme Name | Description | Key Typography |
| :--- | :--- | :--- |
| `academic` (default) | Warm paper aesthetic modeled directly on the reference monograph. | *Literata* (serif body) + *Inter* (sans headings & data) |
| `modern` | Clean, contemporary technical documentation styling. | *Inter* throughout for body, headings, and data |
| `classic` | Traditional LaTeX / Computer Modern academic paper aesthetic. | *Latin Modern Roman* + *Latin Modern Sans* |

---

## Design Tokens (CSS Custom Properties)

All visual properties are defined as standard CSS custom properties on `:root` and scoped via `[data-theme="..."]`:

### Canvas & Surface
- `--bg`: Background canvas color (`#fcfcfb` light / `#141416` dark).
- `--surface`: Card, aside, tooltip, and table background (`#ffffff` light / `#1b1b1e` dark).
- `--rule`: Subtle dividers, borders, and gridlines (`#e6e6e3` light / `#2a2a2e` dark).
- `--rule-strong`: Emphasized borders, axis lines, and table header dividers (`#cfcfcb` light / `#3b3b40` dark).

### Typography
- `--ink`: Primary heading, body text, and strong emphasis (`#1c1c1e` light / `#ececee` dark).
- `--ink-2`: Secondary body text, table cells, and panel titles (`#47474d` light / `#bcbcc2` dark).
- `--muted`: Captions, axis tick marks, and minor dates (`#75757c` light / `#8d8d94` dark).
- `--serif`: Font family string for prose and body reading.
- `--sans`: Font family string for headings, navigation, tables, and chart axes.
- `--mono`: Monospace font family for code blocks.

### Brand & Accents
- `--accent`: Links, active navigation states, and highlights (`#2f5585` light / `#93b3de` dark).
- `--accent-soft`: Background hover states for TOC items (`#edf1f7` light / `#1d2533` dark).

### Scientific Data Visualization Palette
- `--s0`: Baseline / unadapted series (`#8b8b91` neutral gray).
- `--s1`: Primary comparison series (`#2a78d6` academic blue).
- `--s2`: Secondary comparison / experimental arm (`#eb6834` terracotta orange).
- `--s3`: Tertiary series (`#1baf7a` forest green).
- `--band`: Shaded confidence bands (`rgba(42, 120, 214, 0.10)`).
- `--grid`: SVG chart grid lines (`#ececea`).
- `--axis`: SVG chart primary axis line (`#cfcfcb`).

---

## Dark Mode Behavior

Inkblot supports two dark mode strategies:

1. **Automatic (System Preference)**:
   By default, `@media (prefers-color-scheme: dark)` applies the dark token palette automatically without requiring JavaScript.

2. **Explicit Attribute**:
   To force light or dark mode regardless of OS settings, set `data-theme` on `<html>` or `<Report>`:
   ```html
   <html data-theme="dark">
   <!-- or -->
   <html data-theme="light">
   ```

---

## Defining Custom Themes

You can define custom themes in TypeScript:

```ts
import { registerTheme, type ThemeConfig } from 'inkblot';

export const emeraldTheme: ThemeConfig = {
  name: 'emerald',
  label: 'Emerald Laboratory',
  light: {
    bg: '#fcfdfd',
    surface: '#ffffff',
    ink: '#111c16',
    ink2: '#2f4339',
    muted: '#6a7d74',
    rule: '#e2eae5',
    ruleStrong: '#c2d1c8',
    accent: '#0d6948',
    accentSoft: '#eaf4ef',
    s0: '#7f8c85',
    s1: '#0d6948',
    s2: '#d9652a',
    s3: '#2a78d6',
    grid: '#ebf2ee',
    axis: '#c2d1c8',
    band: 'rgba(13, 105, 72, 0.10)',
  },
  dark: {
    bg: '#0f1713',
    surface: '#15211b',
    ink: '#e6eee9',
    ink2: '#b0c2b7',
    muted: '#7e9487',
    rule: '#21332a',
    ruleStrong: '#324a3e',
    accent: '#52be90',
    accentSoft: '#183325',
    s0: '#7e9487',
    s1: '#52be90',
    s2: '#eb7943',
    s3: '#4592eb',
    grid: '#1c2c23',
    axis: '#324a3e',
    band: 'rgba(82, 190, 144, 0.16)',
  },
  fonts: {
    serif: '"Literata", Georgia, serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
  },
};

// Register in runtime
registerTheme(emeraldTheme);
```

Then specify `theme: "emerald"` in your MDX frontmatter!
