import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import type { SiteConfig } from './types.js';

export function defineConfig(config: SiteConfig): SiteConfig {
  return config;
}

const DEFAULT_CONFIG_FILENAMES = [
  'inkblot.config.ts',
  'inkblot.config.js',
  'inkblot.config.mjs',
  'inkblot.config.json',
];

export async function loadSiteConfig(
  cwd: string = process.cwd(),
  customPath?: string
): Promise<{ config: SiteConfig; configPath: string | null }> {
  let configPath: string | null = null;

  if (customPath) {
    const fromProc = path.resolve(process.cwd(), customPath);
    const fromCwd = path.resolve(cwd, customPath);
    if (fs.existsSync(fromProc)) {
      configPath = fromProc;
    } else if (fs.existsSync(fromCwd)) {
      configPath = fromCwd;
    } else {
      throw new Error(`Configuration file not found at: ${customPath}`);
    }
  } else {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.resolve(cwd, filename);
      if (fs.existsSync(candidate)) {
        configPath = candidate;
        break;
      }
    }
  }

  const baseConfig: SiteConfig = {
    title: 'Inkblot Scientific Site',
    theme: 'academic',
    contentDir: 'content',
    outDir: 'dist',
    publicDir: 'public',
    basePath: '/',
    search: true,
    sidebar: 'auto',
  };

  if (!configPath) {
    return { config: baseConfig, configPath: null };
  }

  if (configPath.endsWith('.json')) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return { config: { ...baseConfig, ...parsed }, configPath };
  }

  // For .ts, .js, .mjs files
  try {
    // If running in Bun, native import supports .ts directly
    if (typeof (globalThis as any).Bun !== 'undefined') {
      const mod = await import(pathToFileURL(configPath).href);
      const loaded = mod.default || mod;
      return { config: { ...baseConfig, ...loaded }, configPath };
    }

    // In standard Node.js, bundle config with esbuild to a temporary CJS/ESM module
    const result = await esbuild.build({
      entryPoints: [configPath],
      bundle: true,
      write: false,
      format: 'esm',
      target: 'es2022',
      platform: 'node',
      packages: 'external',
    });

    const bundledCode = result.outputFiles[0].text;
    const tempFile = path.resolve(
      path.dirname(configPath),
      `.inkblot-config-${Date.now()}.mjs`
    );

    fs.writeFileSync(tempFile, bundledCode, 'utf-8');
    try {
      const mod = await import(pathToFileURL(tempFile).href);
      const loaded = mod.default || mod;
      return { config: { ...baseConfig, ...loaded }, configPath };
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  } catch (err: any) {
    throw new Error(`Failed to load configuration file at ${configPath}: ${err.message}`);
  }
}
