import { defineConfig } from 'tsup';
import { buildAssets } from './scripts/build-assets';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/interactive/public.tsx',
    'components/index': 'src/components/index.tsx',
    'themes/index': 'src/themes/index.ts',
    'site/index': 'src/site/index.ts',
    'next/index': 'src/next/index.tsx',
    'bin/inkblot': 'src/bin/inkblot.ts',
  },
  format: ['esm'],
  external: ['inkblot/client'],
  clean: true,
  sourcemap: true,
  splitting: true,
  shims: true,
  dts: true,
  banner: {
    js: `/** Inkblot Scientific Report & Site Engine **/`,
  },
  onSuccess: buildAssets,
});
