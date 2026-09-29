import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/bot': 'http://127.0.0.1:3000',
      '/api': 'http://127.0.0.1:3000'
    }
  }
})
