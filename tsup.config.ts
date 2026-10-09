import { defineConfig } from 'tsup';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'components/index': 'src/components/index.tsx',
    'themes/index': 'src/themes/index.ts',
    'site/index': 'src/site/index.ts',
    'next/index': 'src/next/index.tsx',
    'bin/inkblot': 'src/bin/inkblot.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  banner: {
    js: `/** Inkblot Scientific Report & Site Engine **/`,
  },
  onSuccess: async () => {
    // Ensure dist directory has the bundled CSS
    const srcCss = path.resolve('src/themes/styles/inkblot.css');
    const distCss = path.resolve('dist/style.css');
    if (fs.existsSync(srcCss)) {
      fs.copyFileSync(srcCss, distCss);
    }
    const srcSiteCss = path.resolve('src/themes/styles/site.css');
    const distSiteCss = path.resolve('dist/site.css');
    if (fs.existsSync(srcSiteCss)) {
      fs.copyFileSync(srcSiteCss, distSiteCss);
    }
  },
});
