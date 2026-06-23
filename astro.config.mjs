import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://JCGoulart.github.io',
  base: '/guia-vigilancia-socioassistencial/',
  integrations: [
    react(),
  ],
  output: 'static',
  build: {
    assets: '_astro',
  },
  vite: {
    resolve: {
      alias: { '@': '/src' },
    },
    optimizeDeps: {
      include: ['react-dom/client'],
    },
  },
})
