import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/zip-game/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'canvas-confetti']
  }
});
