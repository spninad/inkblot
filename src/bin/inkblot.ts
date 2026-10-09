#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { runBuild } from '../cli/build.js';
import { runDev } from '../cli/dev.js';
import { buildSite } from '../site/build.js';
import { devSite } from '../site/dev.js';
import { serveSite } from '../site/serve.js';
import { initSite } from '../site/init.js';

const program = new Command();

program
  .name('inkblot')
  .description('Scientific and technical report generator & site engine from MDX')
  .version('0.2.0');

function hasSiteConfigOrContent(cwd: string = process.cwd()): boolean {
  const configs = [
    'inkblot.config.ts',
    'inkblot.config.js',
    'inkblot.config.mjs',
    'inkblot.config.json',
  ];
  return configs.some((c) => fs.existsSync(path.join(cwd, c))) || fs.existsSync(path.join(cwd, 'content'));
}

// 1. Single Report / Auto Site Build
program
  .command('build')
  .description('Build static report or site from MDX')
  .argument('[input]', 'Input MDX file (or omit to build site using inkblot.config.ts)')
  .option('-o, --output <path>', 'Output path (file, directory, or .zip)')
  .option(
    '-f, --format <format>',
    'Output format: standalone (single HTML), dir (static directory), or zip',
    'standalone'
  )
  .option('-t, --theme <theme>', 'Theme name (academic, modern, classic)', 'academic')
  .option('-c, --config <config>', 'Path to custom site configuration file')
  .option('-z, --zip', 'Also package static output into a ZIP archive', false)
  .option('--embed-fonts', 'Inline web fonts as base64 for 100% offline self-containment', false)
  .option('-q, --quiet', 'Suppress console logs', false)
  .action((input, options) => {
    if (!input && hasSiteConfigOrContent()) {
      buildSite({
        configPath: options.config,
        outDir: options.output,
        quiet: options.quiet,
      });
    } else if (input) {
      runBuild(input, options);
    } else {
      console.error(`\n❌ Error: No input file specified and no inkblot.config.ts or content/ folder found.`);
      console.log(`Run 'inkblot site init' to scaffold a new site, or 'inkblot build report.mdx'.\n`);
      process.exit(1);
    }
  });

// 2. Single Report / Auto Site Dev
program
  .command('dev')
  .description('Start local development server with hot reload')
  .argument('[input]', 'Input MDX file (or omit to start site dev server)')
  .option('-p, --port <port>', 'Port number to listen on', (val) => parseInt(val, 10), 3000)
  .option('-t, --theme <theme>', 'Theme name override')
  .option('-c, --config <config>', 'Path to custom site configuration file')
  .action((input, options) => {
    if (!input && hasSiteConfigOrContent()) {
      devSite({
        configPath: options.config,
        port: options.port,
      });
    } else if (input) {
      runDev(input, options);
    } else {
      console.error(`\n❌ Error: No input file specified and no inkblot.config.ts or content/ folder found.`);
      console.log(`Run 'inkblot site init' to scaffold a new site, or 'inkblot dev report.mdx'.\n`);
      process.exit(1);
    }
  });

// 3. Site Subcommands (Hugo-like workflow)
const siteCommand = program
  .command('site')
  .description('Multi-page scientific report site generator (Hugo-like)');

siteCommand
  .command('init')
  .description('Scaffold a new multi-page report site')
  .argument('[dir]', 'Directory to initialize (default: current directory)', '.')
  .action((dir) => {
    initSite(dir);
  });

siteCommand
  .command('build')
  .description('Build static multi-page site from content/ and config')
  .option('-c, --config <config>', 'Path to custom configuration file')
  .option('-o, --output <dir>', 'Output directory (default: dist)')
  .option('-q, --quiet', 'Suppress console logs', false)
  .action((options) => {
    buildSite({
      configPath: options.config,
      outDir: options.output,
      quiet: options.quiet,
    });
  });

siteCommand
  .command('dev')
  .description('Start local multi-page site development server with on-demand SSR')
  .option('-c, --config <config>', 'Path to custom configuration file')
  .option('-p, --port <port>', 'Port number (default: 3000)', (val) => parseInt(val, 10), 3000)
  .action((options) => {
    devSite({
      configPath: options.config,
      port: options.port,
    });
  });

siteCommand
  .command('serve')
  .description('Serve the built static production site')
  .option('-o, --output <dir>', 'Directory to serve (default: dist)', 'dist')
  .option('-p, --port <port>', 'Port number (default: 3000)', (val) => parseInt(val, 10), 3000)
  .action((options) => {
    serveSite({
      outDir: options.output,
      port: options.port,
    });
  });

// Direct invocation without subcommand
if (
  process.argv.length === 3 &&
  !process.argv[2].startsWith('-') &&
  process.argv[2] !== 'build' &&
  process.argv[2] !== 'dev' &&
  process.argv[2] !== 'site' &&
  process.argv[2] !== 'help'
) {
  const inputFile = process.argv[2];
  runBuild(inputFile, { format: 'standalone' });
} else {
  program.parse(process.argv);
}
