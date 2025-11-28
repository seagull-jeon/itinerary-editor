import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The base path must match your GitHub repository name for Pages deployment
  // Repo: https://github.com/username/svt-tour -> Base: '/svt-tour/'
  base: '/svt-tour/', 
});