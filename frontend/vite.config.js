import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario para exponer el servidor fuera de WSL hacia Windows
    port: 5173
  }
});
