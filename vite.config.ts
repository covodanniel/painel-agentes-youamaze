import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// UI em :5173 no dev; chamadas /api são repassadas para o Express em :3000.
// Em produção o Express serve o conteúdo de dist/ e a API no mesmo processo.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
  },
});
