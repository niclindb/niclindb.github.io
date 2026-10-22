import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of the domain
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
