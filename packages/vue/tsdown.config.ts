import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { vue: true },
  external: ['vue', '@glace-ui/core'],
  clean: true,
  plugins: [Vue({ isProduction: true })],
})
