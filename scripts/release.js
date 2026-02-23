#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const versionBump = args.find((arg) => arg !== '--dry-run')

const validBumps = ['patch', 'minor', 'major']

const packages = [
  resolve(root, 'packages/core/package.json'),
  resolve(root, 'packages/vue/package.json'),
]

function runCommand(command, description, allowFail = false) {
  console.log(`\n📋 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit', cwd: root })
    console.log(`✅ ${description} passed`)
  } catch (error) {
    if (!allowFail) {
      console.error(`\n❌ ${description} failed. Aborting release.`)
      process.exit(1)
    }
  }
}

function bumpVersion(currentVersion, bump) {
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  switch (bump) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
  }
}

// Validate input
if (!versionBump || !validBumps.includes(versionBump)) {
  console.error(`\nUsage: pnpm release [patch|minor|major] [--dry-run]\n`)
  console.error(`Valid version bumps: ${validBumps.join(', ')}`)
  process.exit(1)
}

console.log(
  `\n🚀 Starting release process (${dryRun ? 'DRY RUN' : 'LIVE'})...`,
)
console.log(`Version bump: ${versionBump}`)

// Run pre-publish checks
runCommand('pnpm lint', 'Linting')
runCommand('pnpm typecheck', 'Type checking')
runCommand('pnpm build', 'Building packages')
runCommand('pnpm test', 'Running tests')

// Read current version from core package
const corePkg = JSON.parse(readFileSync(packages[0], 'utf-8'))
const currentVersion = corePkg.version
const newVersion = bumpVersion(currentVersion, versionBump)

console.log(`\n📦 Version: ${currentVersion} → ${newVersion}`)

if (dryRun) {
  console.log(`\n🔍 DRY RUN: Would bump to ${newVersion} and publish.`)
  console.log('Run without --dry-run to actually publish.\n')
  process.exit(0)
}

// Bump version in all publishable packages
for (const pkgPath of packages) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  pkg.version = newVersion
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`✅ Bumped ${pkg.name} to ${newVersion}`)
}

// Commit and tag
console.log(`\n📤 Committing and tagging...`)
try {
  execSync(`git add -A && git commit -m "v${newVersion}"`, {
    stdio: 'inherit',
    cwd: root,
  })
  execSync(`git tag v${newVersion}`, { stdio: 'inherit', cwd: root })
} catch (error) {
  console.error('\n❌ Git commit/tag failed. Aborting release.')
  process.exit(1)
}

// Push to GitHub
console.log(`\n📤 Pushing to GitHub...`)
try {
  execSync('git push && git push --tags', { stdio: 'inherit', cwd: root })
  console.log(
    '\n✅ Tag pushed! GitHub Actions will now publish to npm and create a release.',
  )
} catch (error) {
  console.error('\n❌ Git push failed.')
  console.error(
    'Your local version bump and tag still exist. Push manually with: git push && git push --tags',
  )
  process.exit(1)
}
