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
  theme: 'academic', // 'academic' | 'modern' | 'classic'
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
});

console.log(result.html); // Full HTML document string
console.log(result.css);  // Extracted stylesheet
```

---

## Next.js Integration Patterns

### 1. Next.js App Router (Server-Side Rendering / SSR)

Inside `app/reports/[slug]/page.tsx`:

```tsx
import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { compileReport, ReportViewer, ReportProvider } from 'inkblot';
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
