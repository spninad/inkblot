import { defineConfig } from 'inkblot/site';

export default defineConfig({
  title: 'Frontier AI Research Monographs',
  description: 'Empirical studies, geometric deep learning, and interactive WebGL visualizations',
  theme: 'academic',
  contentDir: 'content',
  outDir: 'dist',
  nav: [
    { title: 'Overview', href: '/' },
    { title: 'Diffusion Planning', href: '/studies/diffusion-planning' },
    { title: 'Latent Geometry', href: '/studies/representation-geometry' },
    { title: 'World Models', href: '/studies/study-1' },
    { title: 'Benchmarks', href: '/benchmarks' },
  ],
  sidebar: 'auto',
  footer: {
    copyright: '© 2026 Frontier AI Research Collective. Open scientific record compiled with Inkblot.',
  },
});
