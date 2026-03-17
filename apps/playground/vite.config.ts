import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@glace-ui/core/css': fileURLToPath(new URL('../../packages/core/src/css/index.css', import.meta.url)),
      '@glace-ui/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
      '@glace-ui/vue': fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
    },
  },
})
