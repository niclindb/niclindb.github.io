import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://niclindb.github.io/portfolio/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
