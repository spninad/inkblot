import path from 'node:path';
import { bundleReport, type BundleOptions } from './bundler.js';

export interface CliBuildOptions {
  output?: string;
  format?: 'standalone' | 'dir' | 'zip';
  theme?: string;
  zip?: boolean;
  embedFonts?: boolean;
  quiet?: boolean;
}

export async function runBuild(inputFile: string, options: CliBuildOptions): Promise<void> {
  const inputPath = path.resolve(process.cwd(), inputFile);

  if (!options.quiet) {
    console.log(`\n✒️  Inkblot: Compiling ${path.basename(inputFile)}...`);
  }

  const startTime = Date.now();

  const bundleOptions: BundleOptions = {
    inputPath,
    outputPath: options.output ? path.resolve(process.cwd(), options.output) : undefined,
    format: options.format,
    theme: options.theme,
    zip: options.zip,
    embedFonts: options.embedFonts,
  };

  try {
    const result = await bundleReport(bundleOptions);
    const elapsed = Date.now() - startTime;

    if (!options.quiet) {
      console.log(`✨ Generated ${result.format} output in ${elapsed}ms:`);
      result.outputFiles.forEach((file) => {
        console.log(`   📄 ${path.relative(process.cwd(), file)}`);
      });
      if (result.zipPath) {
        console.log(`   📦 ${path.relative(process.cwd(), result.zipPath)}`);
      }
      console.log('');
    }
  } catch (err: any) {
    console.error(`\n❌ Build failed: ${err.message}`);
    process.exit(1);
  }
}
