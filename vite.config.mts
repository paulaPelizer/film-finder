import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy da OMDb (desenvolvimento) para evitar CORS
      '/omdb': {
        target: 'https://www.omdbapi.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/omdb/, ''),
      },
      // Proxy opcional das imagens da Amazon (quando quiser forçar via proxy)
      '/imgproxy': {
        target: 'https://m.media-amazon.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/imgproxy/, ''),
      },
    },
  },
})
