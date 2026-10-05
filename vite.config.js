import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Membaca file .env berdasarkan environment saat ini
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(), // Plugin Tailwind CSS v4
    ],
    server: {
      // Mengatur port lokal menggunakan APP_PORT dari .env, default: 3000
      port: parseInt(env.APP_PORT || '3000'),
      strictPort: true,
    },
    define: {
      // Define konstanta DELCOM_BASEURL agar bisa diakses global di aplikasi
      'DELCOM_BASEURL': JSON.stringify(env.DELCOM_BASEURL)
    },
    test: {
 environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/setupTests.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
        }
      }
    }
  };
});