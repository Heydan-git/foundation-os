import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      // Node.js modules used in browser code are stubbed at runtime
      external: ['fs', 'path'],
      output: {
        globals: {
          fs: 'undefined',
          path: 'undefined',
        },
      },
    },
  },
})
