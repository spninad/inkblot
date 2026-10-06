#!/usr/bin/env node
import { Command } from 'commander';
import { runBuild } from '../cli/build.js';
import { runDev } from '../cli/dev.js';

const program = new Command();

program
  .name('inkblot')
  .description('Scientific and technical report generator from MDX')
  .version('0.1.0');

program
  .command('build')
  .description('Build a static scientific report from an MDX document')
  .argument('<input>', 'Input MDX file (e.g. report.mdx)')
  .option('-o, --output <path>', 'Output path (file, directory, or .zip)')
  .option(
    '-f, --format <format>',
    'Output format: standalone (single self-contained HTML), dir (static web directory), or zip',
    'standalone'
  )
  .option('-t, --theme <theme>', 'Theme name (academic, modern, classic)', 'academic')
  .option('-z, --zip', 'Also package static output into a ZIP archive', false)
  .option('--embed-fonts', 'Inline web fonts as base64 for 100% offline self-containment', false)
  .option('-q, --quiet', 'Suppress console logs', false)
  .action((input, options) => {
    runBuild(input, options);
  });

program
  .command('dev')
  .description('Start local development server with hot reload')
  .argument('<input>', 'Input MDX file (e.g. report.mdx)')
  .option('-p, --port <port>', 'Port number to listen on', (val) => parseInt(val, 10), 3000)
  .option('-t, --theme <theme>', 'Theme name override')
  .action((input, options) => {
    runDev(input, options);
  });

// If user invokes `inkblot file.mdx` directly, default to build
if (
  process.argv.length === 3 &&
  !process.argv[2].startsWith('-') &&
  process.argv[2] !== 'build' &&
  process.argv[2] !== 'dev' &&
  process.argv[2] !== 'help'
) {
  const inputFile = process.argv[2];
  runBuild(inputFile, { format: 'standalone' });
} else {
  program.parse(process.argv);
}
