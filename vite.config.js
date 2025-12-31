import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    emptyOutDir: false,
    outDir: 'assets',
    rollupOptions: {
      input: 'src/js/app.js',
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/assets/**'],
    },
  },
});
