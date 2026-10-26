import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// GitHub Pages serves 404.html for paths it has no file for, such as /column/…,
// so a copy of the app there lets the router handle them.
function spaFallback(): Plugin {
  let outDir = ''
  return {
    name: 'spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Served as a project site at open-data-discover.github.io/open-data-discover/
  base: '/open-data-discover/',
  plugins: [react(), tailwindcss(), spaFallback()],
})
