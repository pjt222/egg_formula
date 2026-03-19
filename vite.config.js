import { defineConfig } from 'vite';

export default defineConfig({
  base: '/egg_formula/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
  test: {
    globals: true,
  },
});
