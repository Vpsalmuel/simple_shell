import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:preview` makes a single self-contained HTML file for sharing a preview.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  // In development, Rex AI calls go to the local server (npm run dev:api).
  server: { proxy: { '/api': 'http://localhost:3001' } },
  build: mode === 'preview' ? { outDir: 'dist-preview', assetsInlineLimit: 1e8 } : {},
}))
