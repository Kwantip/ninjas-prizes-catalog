import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',  // This is fine to specify where the build output goes
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // Proxy API requests to the backend API
    },
  },
});
