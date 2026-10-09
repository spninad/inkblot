import { defineConfig } from 'inkblot/site';

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
