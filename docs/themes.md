# Theme Engine & Styling

Inkblot features a clean, CSS-variable-driven theme system. The styling works consistently whether reports are built as standalone HTML or rendered inside larger React/Next.js web applications.

---

## Built-in Themes

| Theme Name | Description | Key Typography |
| :--- | :--- | :--- |
| `academic` (default) | Warm paper aesthetic modeled directly on the reference monograph. | *Literata* (serif body) + *Inter* (sans headings & data) |
| `classic` | Traditional academic paper. | Latin Modern with system serif fallbacks |
| `industrie` | Precise, compact, restrained. | Inter with monospace data |
| `cozy` | Warm reading surfaces and copper accents. | Crimson Pro + Inter |
| `modern` | Quiet neutral surfaces and warm accents. | Inter |
| `colorful` | Modern structure with categorical color. | Inter |
| `glass` | Soft shapes and violet accents. | Inter |
| `paper` | Light headlines, fine rules, measured spacing. | Inter |
| `journal` | Toned paper, serif headings, teal accents. | Newsreader + Inter + JetBrains Mono |

Set `theme` in report frontmatter, site configuration, or `renderReportToHtml` options. `getBuiltinThemes()` returns the available themes.

The seven shared languages are vendored in `src/themes/tokens/` (originally the `@design/tokens` package from the internal monorepo, included here so Inkblot is self-contained). Inkblot maps semantic colors, reading and display fonts, radii, and motion into its report tokens. Report layout retains readable document sizing rather than using application-sized body text.

`bun run build` refreshes the compiled JavaScript and CSS outputs.

Generated HTML requests Inter and the selected reading fonts from Google Fonts, with system fallbacks for offline use. Latin Modern and Paper Mono use locally installed fonts when available and otherwise use their fallback stacks. Applications importing CSS should load their preferred fonts themselves.

---

## Component foundation and language selection

Inkblot uses the Radix Luma components from shadcn preset `b1aIdeaGW` (neutral base, indigo theme, Inter, Lucide). The preset's component structure, borders, and spacing provide the foundation; each Inkblot language supplies its own semantic colors, fonts, radii, and motion. Preset provenance is recorded in `shadcn.preset.json`.

Existing configurations stay fixed-language. Add `themePicker` to let readers choose:

```ts
export default defineConfig({
  title: 'Research notes',
  theme: 'journal',
  themePicker: { themes: ['journal', 'paper', 'cozy'] },
});
```

`themePicker: true` offers all nine built-in languages plus a configured custom theme. Omit it or use `false` for a fixed language. An explicit list must contain the configured default and only registered theme names. Invalid lists fail with a configuration error.

Standalone reports accept the same option in frontmatter and rendering options:

```ts
await renderReportToHtml(source, { theme: 'paper', themePicker: true });
```

```yaml
theme: journal
themePicker:
  themes: [journal, paper]
```

Explicit rendering options override frontmatter. Language and Light/Dark/System mode are separate controls. Choices persist per origin and site base path, or per standalone document path. Fixed-language output ignores saved language choices. Invalid preferences and unavailable storage fall back to configuration and system appearance. Generated output restores preferences before paint, and picker-enabled output loads the selectable reading fonts up front.

## Design tokens and embedding

The document retains its existing tokens (`--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--s1`, and related variables). Shadcn receives a separate semantic namespace: `--ib-background`, `--ib-foreground`, `--ib-primary`, `--ib-primary-foreground`, `--ib-muted`, `--ib-muted-foreground`, `--ib-border`, `--ib-input`, `--ib-ring`, sidebar tokens, and `--ib-chart-1` through `--ib-chart-5`. In particular, document `--muted` is a text color while shadcn `--ib-muted` is a surface color.

Shared palettes map directly from the vendored tokens in `src/themes/tokens/`. Academic, Classic, and custom themes derive semantic defaults from their existing fields. A custom `ThemeConfig` may additionally provide `ui.light` and `ui.dark` maps with semantic keys such as `primary` and `primary-foreground`; no new fields are required for existing custom themes. Supply paired foreground overrides when a custom primary color needs them.

Compiled utilities have the `ib:` prefix and styles are scoped to `.inkblot-root`. There is no global Tailwind preflight. Hosts import the compiled styles without installing Tailwind themselves:

```tsx
import { ReportProvider, ReportViewer } from 'inkblot/client';
import 'inkblot/style.css';

<ReportProvider theme="journal" themePicker={{ themes: ['journal', 'paper'] }}>
  <ReportViewer report={compiled} />
</ReportProvider>
```

The provider and report own their theme containers. Portalled dialogs and menus inherit that container's tokens, and appearance changes do not alter the host document's language. Hosts load their chosen fonts themselves. SSR containers include preference restoration; client-only containers restore in a layout effect. Neither requires a separate `hydrateRoot` call or a generated-page runtime script.

Generated documents apply `data-theme` and `data-color-mode` to `<html class="inkblot-root">`. Embedded containers use `data-inkblot-theme` instead. The default system setting also follows CSS media queries without JavaScript. `appearanceInit(resolveAppearance(...))` is available for custom HTML generators. `THEME_INIT_SCRIPT` remains a legacy compatibility export.

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


## Preview and verification

After `bun install` and `bun run build`, run `bun run preview` to serve the example site at `http://localhost:4319`. Standalone component previews for each theme are available at `/themes/paper.html`, `/themes/journal.html`, and the corresponding paths for the other theme names.

Run `bun run typecheck`, `bun run test`, and `bun run test:browser` for validation. Install the test browser once with `bunx playwright install chromium`, or use installed Chrome with `PLAYWRIGHT_CHANNEL=chrome bun run test:browser`. Stop the preview before running browser tests because both use port 4319. Browser checks cover both modes of all nine themes, five site pages from 320 to 1920 pixels wide, nested tabs, mobile navigation, search, saved preferences, and reduced motion. Temporary preview files are generated outside the source tree.
