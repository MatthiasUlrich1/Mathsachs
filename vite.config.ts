/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built assets load over file:// inside Electron.
  base: './',
  plugins: [react()],
  // Keep anatomy (and other) assets as real files — data: URLs break when an
  // SVG has a bad encoding and are harder to debug in Electron.
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'node',
  },
})
