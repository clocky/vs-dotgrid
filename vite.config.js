import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
});
