/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built assets load over file:// inside Electron.
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'node',
  },
})
