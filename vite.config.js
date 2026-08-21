import { resolve } from 'path';
import { cpSync, existsSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        resumeiq: resolve(__dirname, 'projects/resumeiq.html'),
        backup_for_you: resolve(__dirname, 'projects/backup-for-you.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        // Copy assets/docs/resume.pdf
        if (existsSync('assets/docs/resume.pdf')) {
          cpSync('assets/docs', 'dist/assets/docs', { recursive: true });
        }
        // Copy assets/svg
        if (existsSync('assets/svg')) {
          cpSync('assets/svg', 'dist/assets/svg', { recursive: true });
        }
        // Copy robots.txt and sitemap.xml
        if (existsSync('robots.txt')) {
          cpSync('robots.txt', 'dist/robots.txt');
        }
        if (existsSync('sitemap.xml')) {
          cpSync('sitemap.xml', 'dist/sitemap.xml');
        }
      },
    },
  ],
});
