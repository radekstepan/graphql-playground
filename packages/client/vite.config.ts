import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  server: {
    port: 1234
  },
  plugins: [react()]
});
