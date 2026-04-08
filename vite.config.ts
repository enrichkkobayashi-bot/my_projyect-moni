import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { localApiPlugin } from './vite-plugin-local-api';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Assign to process.env so that the API handler can access GEMINI_API_KEY
  process.env = { ...process.env, ...env };

  return {

    server: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
    },
    plugins: [react(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
