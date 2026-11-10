# Programmatic Rendering API

Inkblot provides a first-class programmatic library API that can be used directly inside React, Next.js, Remix, Astro, and Node.js web applications.

---

## Installation

```bash
bun add inkblot
```

In your application root or CSS entry point (e.g. `layout.tsx` or `_app.tsx`):
```tsx
import 'inkblot/style.css';
```

---

## Core Functions

### `compileReport(source, options?)`

Compiles raw MDX content into an executable report object, extracting frontmatter and generating the Table of Contents hierarchy.

```ts
import { compileReport } from 'inkblot';

const compiled = await compileReport(mdxString, {
  theme: 'academic', // Any built-in or registered theme
  remarkPlugins: [], // Optional unified remark plugins
  rehypePlugins: [], // Optional unified rehype plugins
});

console.log(compiled.frontmatter);
// { title: '...', date: '...', abstract: '...' }

console.log(compiled.toc);
// [
//   { id: 'intro', title: 'Introduction', number: '1', level: 2 },
//   { id: 'methods', title: 'Methods', number: '2', level: 2 }
// ]
```

#### Return Type: `CompiledReport`
```ts
interface CompiledReport {
  code: string;            // Compiled JS function body
  frontmatter: Record<string, any>; // Parsed YAML metadata
  toc: TocEntry[];         // Extracted Table of Contents
  rawSource: string;       // Original MDX text minus frontmatter
}
```

---

### `renderReportToHtml(sourceOrCompiled, options?)`

Renders an MDX document or pre-compiled report to an HTML string.

```ts
import { renderReportToHtml } from 'inkblot';

const result = await renderReportToHtml(mdxString, {
  theme: 'academic',
  standalone: true,  // false returns component markup without <!doctype html>
  embedFonts: false,
  themePicker: { themes: ['academic', 'journal', 'paper'] },
  clientScript: true, // false exposes all tab content and emits no scripts
});

console.log(result.html); // Full HTML document string
console.log(result.css);  // Extracted stylesheet
console.log(result.script); // Self-contained runtime for component-only HTML output
```

---

## Next.js Integration Patterns

### 1. Next.js App Router (Server-Side Rendering / SSR)

Inside `app/reports/[slug]/page.tsx`:

```tsx
import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { compileReport } from 'inkblot';
import { ReportViewer, ReportProvider } from 'inkblot/client';
import 'inkblot/style.css';

interface Props {
  params: { slug: string };
}

export default async function ReportPage({ params }: Props) {
  const filePath = path.join(process.cwd(), 'reports', `${params.slug}.mdx`);

  let fileContent: string;
  try {
    fileContent = await fs.readFile(filePath, 'utf-8');
  } catch {
    notFound();
  }

  // Compile MDX on the server
  const compiled = await compileReport(fileContent);

  return (
    <ReportProvider theme="academic">
      <ReportViewer report={compiled} />
    </ReportProvider>
  );
}
```

### 2. Next.js Static Site Generation (SSG)

Combine `compileReport` with `generateStaticParams`:

```tsx
export async function generateStaticParams() {
  const reportsDir = path.join(process.cwd(), 'reports');
  const files = await fs.readdir(reportsDir);

  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ''),
    }));
}
```

### 3. Incremental Static Regeneration (ISR)

Add the `revalidate` segment config to recompile reports periodically:

```tsx
// Revalidate report every 60 seconds
export const revalidate = 60;

export default async function ReportPage({ params }: Props) {
  // Fetches MDX from CMS or API and renders with Inkblot
}
```

### 4. Custom Component Overrides

You can pass application-specific components or override default primitives using `components`:

```tsx
import { ReportViewer } from 'inkblot';
import { CustomModelViewer } from '@/components/CustomModelViewer';

export function MyReportPage({ compiled }) {
  return (
    <ReportViewer
      report={compiled}
      components={{
        ModelViewer: CustomModelViewer,
        // Override standard table or callout
        Aside: ({ children, title }) => (
          <div className="my-custom-callout">
            <h5>{title}</h5>
            {children}
          </div>
        ),
      }}
    />
  );
}
```


## Client controls and appearance options

Use `inkblot/client` for `ReportProvider`, `ReportViewer`, `Tabs`, `Tab`, and `Collapse` in client components. Keep MDX compilation and HTML generation on the server. The existing MDX component names and props are preserved.

`themePicker?: boolean | { themes?: string[] }` is accepted by site configuration, report frontmatter, rendering options, `ReportProvider`, and `ReportViewer`. It defaults to `false`. The configured `theme` remains the default language; `true` enables all built-ins, and an explicit list restricts the choices. Rendering options override frontmatter; viewer props override provider appearance settings. See [Theme Engine & Styling](./themes.md) for persistence, custom semantic colors, and embedding details.

If you consume component-only HTML strings, include the returned CSS and run `result.script` once after inserting the HTML. Native React hosts render the client components directly and should not inject this generated-page runtime.
