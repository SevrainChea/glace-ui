import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cssDir = resolve(__dirname, '../src/css')
const distDir = resolve(__dirname, '../dist')

const files = [
  'glace-card.css',
  'glace-badge.css',
  'glace-button.css',
  'glace-input.css',
  'glace-navbar.css',
  'glace-modal.css',
  'glace-chat-bubble.css',
  'glace-avatar.css',
]

mkdirSync(distDir, { recursive: true })

const output = files
  .map((file) => readFileSync(resolve(cssDir, file), 'utf-8'))
  .join('\n')

writeFileSync(resolve(distDir, 'index.css'), output)
console.log(`Built dist/index.css (${files.length} components)`)
