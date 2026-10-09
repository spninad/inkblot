import fs from 'node:fs';
import path from 'node:path';

export function initSite(targetDir: string = '.'): void {
  const dir = path.resolve(process.cwd(), targetDir);
  fs.mkdirSync(dir, { recursive: true });

  const configPath = path.join(dir, 'inkblot.config.ts');
  const contentDir = path.join(dir, 'content');
  const studiesDir = path.join(contentDir, 'studies');
  const publicDir = path.join(dir, 'public');

  fs.mkdirSync(studiesDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // 1. inkblot.config.ts
  const configContent = `import { defineConfig } from 'inkblot/site';

export default defineConfig({
  title: 'AI Research Lab Reports',
  description: 'Technical records, empirical studies, and scientific monographs',
  theme: 'academic',
  contentDir: 'content',
  outDir: 'dist',
  nav: [
    { title: 'Home', href: '/' },
    { title: 'Studies', href: '/studies/study-1' },
    { title: 'Benchmarks', href: '/benchmarks' },
  ],
  sidebar: 'auto',
  footer: {
    copyright: '© 2026 AI Research Lab. All rights reserved.',
  },
});
`;
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, configContent, 'utf-8');
  }

  // 2. content/index.mdx
  const indexContent = `---
title: "Research Monograph Series"
date: "October 2026"
abstract: |
  Welcome to the open technical record of research studies. This site houses our
  empirical findings, world model evaluations, and benchmark records.
---

<Section number="1" title="Overview">

This research repository collects peer-reviewed technical monographs and replication studies.
Use the sidebar navigation or search bar above to explore individual studies.

<SummaryTable
  caption={<><b>Recent Studies</b></>}
  rows={[
    {
      id: 1,
      title: "Planning with Learned World Models",
      subtitle: "Seven empirical studies under limited data",
      href: "/studies/study-1",
      setting: "PointMaze, DMControl",
      outcome: "Empirical record complete"
    },
    {
      id: 2,
      title: "Benchmark Comparisons",
      subtitle: "Learned MPC vs Model-Free Baselines",
      href: "/benchmarks",
      setting: "Continuous Control",
      outcome: "Frontier established"
    }
  ]}
/>

</Section>
`;
  const indexPath = path.join(contentDir, 'index.mdx');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
  }

  // 3. content/studies/study-1.mdx
  const study1Content = `---
title: "Study 1: Planning-Aware Test-Time Adaptation"
date: "October 2026"
abstract: |
  Investigating whether weighting world model updates by their relevance to the
  planner improves decision quality after test-time dynamics change.
---

<Section number="1" title="Introduction">

<Question>
Does weighting model updates by planning sensitivity outperform standard test-time adaptation?
</Question>

<Aside title="Key Finding">
Under pre-registered success criteria, planning sensitivity showed equivalent performance
to standard adaptation across six perturbation regimes.
</Aside>

<Figure id="fig-study1" title="Figure 1. Success rate across dynamics shifts.">
  <DotPlot
    rows={['Default', 'Damping ×5', 'Damping ×10', 'Mass ×0.2']}
    x={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], format: "percent" }}
    series={[
      { name: "No Adaptation", color: "--s0", values: [0.867, 0.883, 0.867, 0.217] },
      { name: "Standard", color: "--s1", values: [0.883, 0.883, 0.867, 0.183] }
    ]}
    legend={true}
    showDataTable={true}
  />
</Figure>

</Section>
`;
  const study1Path = path.join(studiesDir, 'study-1.mdx');
  if (!fs.existsSync(study1Path)) {
    fs.writeFileSync(study1Path, study1Content, 'utf-8');
  }

  // 4. content/benchmarks.mdx
  const benchContent = `---
title: "Benchmark Comparisons"
date: "October 2026"
abstract: |
  Trade-off frontiers and computational evaluation comparing learned MPC against
  directly trained policies.
---

<Section number="1" title="Computational Frontier">

<Figure id="fig-frontier" title="Figure 1. Predictor step savings frontier.">
  <XYPlot
    x={{ min: 0, max: 70, ticks: [0, 20, 40, 60], format: "percent", label: "Predictor steps saved" }}
    y={{ min: 0, max: 100, ticks: [0, 25, 50, 75, 100], format: "percent", label: "Batches with exact elite" }}
    points={[
      { x: 0, y: 100, name: "Budget 200", label: "budget 200" },
      { x: 16, y: 17.4, name: "Budget 160", label: "160" },
      { x: 32, y: 5.8, name: "Budget 120", label: "120" }
    ]}
    showDataTable={true}
  />
</Figure>

</Section>
`;
  const benchPath = path.join(contentDir, 'benchmarks.mdx');
  if (!fs.existsSync(benchPath)) {
    fs.writeFileSync(benchPath, benchContent, 'utf-8');
  }

  console.log(`\n🎉 Initialized new Inkblot report site in ${path.relative(process.cwd(), dir) || '.'}/`);
  console.log(`   📄 inkblot.config.ts`);
  console.log(`   📁 content/`);
  console.log(`      ├── index.mdx`);
  console.log(`      ├── benchmarks.mdx`);
  console.log(`      └── studies/study-1.mdx`);
  console.log(`\nRun:`);
  console.log(`   inkblot site dev    # Start live preview server`);
  console.log(`   inkblot site build  # Build static production site\n`);
}
