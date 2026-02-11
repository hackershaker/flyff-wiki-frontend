/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  /**
   * Vite build/dev configuration for the Flyff Wiki frontend.
   *
   * - This `define` block injects a per-dev-server identifier so the app can
   *   detect when the dev server restarts (useful for resetting MSW local data).
   * - The value is evaluated when the dev server starts, so it changes on restart.
   */
  define: {
    __DEV_SERVER_ID__: JSON.stringify(Date.now().toString()),
  },
  /**
   * Vitest configuration.
   *
   * - Uses jsdom to support React component tests.
   * - Loads the shared setup file to enable jest-dom matchers and reset storage.
   */
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  plugins: [react(), tailwindcss()],
})
