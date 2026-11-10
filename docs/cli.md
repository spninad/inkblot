# CLI Reference

Inkblot includes a command-line interface (`inkblot`) designed for compiling MDX reports and running a local live-reload preview server.

---

## Global Syntax

```bash
inkblot [command] [options] <input>
```

If no command is provided, `inkblot <input>` defaults to `inkblot build <input>`.

---

## Commands

### `inkblot build`

Builds a static scientific report from an MDX document.

```bash
inkblot build <input> [options]
```

#### Arguments
- `<input>`: Path to the input `.mdx` or `.md` file.

#### Options

| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--output <path>` | `-o` | Output file path or directory. Inferred from format if omitted. | `<basename>.html` |
| `--format <type>` | `-f` | Output format: `standalone`, `dir`, or `zip`. | `standalone` |
| `--theme <name>` | `-t` | Select any built-in or registered theme. | frontmatter, then `academic` |
| `--zip` | `-z` | Package the output into a `.zip` archive alongside HTML. | `false` |
| `--embed-fonts` | | Inlines web fonts as base64 data URIs for 100% offline self-containment. | `false` |
| `--quiet` | `-q` | Suppress build logs. | `false` |

#### Output Formats

##### 1. Standalone Single HTML (`--format standalone`)
Produces a single, fully self-contained `.html` file.
```bash
inkblot build report.mdx -o report.html
```
- Inlines all CSS, theme variables, and KaTeX math styles into `<style>` in `<head>`.
- Inlines the micro client runtime (`<script>`) for hover tooltips and scroll-synchronized TOC spy.
- Renders all charts and diagrams as pure semantic SVG.
- Ideal for sharing via email, Slack, attachments, or opening directly from local disks without running a web server.

##### 2. Static Web Directory (`--format dir`)
Produces a clean static directory ready for hosting.
```bash
inkblot build report.mdx --format dir -o public/
```
Output tree:
```text
public/
├── index.html
└── assets/
    ├── inkblot.js
    └── style.css
```
- Completely static: requires no Node.js runtime, no custom server, and no server-side build steps.
- Deploy directly to Vercel, Amazon S3, Netlify, Cloudflare Pages, or GitHub Pages.

##### 3. Static Directory with ZIP Archive (`--zip`)
```bash
inkblot build report.mdx --format dir -o dist/ --zip
```
Generates `dist/` plus `dist.zip` for instant distribution or automated artifact uploads.

---

### `inkblot dev`

Starts a fast local development server with Server-Sent Events (SSE) live reloading.

```bash
inkblot dev <input> [options]
```

#### Options
| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--port <number>`| `-p` | Port number to listen on. | `3000` |
| `--theme <name>` | `-t` | Override the report theme during development. | Defined in frontmatter |

#### Dev Server Behavior
- Watches the target MDX file on disk.
- Automatically compiles and pushes a reload event over SSE when changes are saved.
- Renders compilation errors with line numbers and stack traces directly in the browser if MDX syntax is invalid.

---

### `inkblot site` (Hugo-like Multi-Page Sites)

Commands for building and serving multi-page report collections and publication portals configured via `inkblot.config.ts`.

#### `inkblot site init [dir]`
Scaffolds a new multi-page report site with sample configuration and MDX reports:
```bash
inkblot site init my-reports
```

#### `inkblot site build`
Compiles all MDX pages in `content/` to static HTML inside `dist/`:
```bash
inkblot site build
# Or with custom config:
inkblot site build -c custom.config.ts -o output/
```

#### `inkblot site dev`
Starts local development server with on-demand SSR and live reloading:
```bash
inkblot site dev -p 3000
```

#### `inkblot site serve`
Serves the built production static site:
```bash
inkblot site serve -o dist -p 3000
```

---

## Deployment Recipes

### Deploying to Vercel

Build into a directory named `public/`:
```bash
inkblot build report.mdx --format dir -o public/
vercel deploy --prod
```

### Deploying to AWS S3 / CloudFront

```bash
inkblot build report.mdx --format dir -o dist/
aws s3 sync dist/ s3://my-reports-bucket/study-1/ --acl public-read
```

### Deploying to Cloudflare Pages

```bash
inkblot build report.mdx --format dir -o dist/
wrangler pages deploy dist/ --project-name scientific-reports
```
