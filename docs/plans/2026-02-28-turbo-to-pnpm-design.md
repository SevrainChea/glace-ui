# Design: Remove Turbo, Use pnpm Native Commands

**Date:** 2026-02-28
**Status:** Approved

## Goal

Remove `turbo` as a dependency and replace all `turbo <task>` invocations with pnpm native recursive commands. No new tools introduced.

## Approach

Use `pnpm -r run <task>`. pnpm's recursive runner topologically sorts packages based on `workspace:*` dependencies before executing, so `@glace-ui/core` always builds before `@glace-ui/vue`.

## Changes

### 1. Root `package.json`

Replace scripts:

| Before | After |
|--------|-------|
| `turbo dev` | `pnpm -r --parallel run dev` |
| `turbo build` | `pnpm -r run build` |
| `turbo test` | `pnpm -r run build && pnpm -r run test` |
| `turbo typecheck` | `pnpm -r run typecheck` |
| `turbo build && pnpm run link:global` | `pnpm run build && pnpm run link:global` |

Remove `"turbo": "^2.3.0"` from `devDependencies`.

### 2. `turbo.json`

Delete the file entirely.

### 3. `CLAUDE.md`

Remove `(turbo, ...)` annotations from the build/test command descriptions.

## Trade-offs

- **Lost:** Build output caching. Negligible for this repo (sub-second builds).
- **Gained:** One fewer dependency, simpler mental model, no turbo.json to maintain.

## Build Order Guarantee

`@glace-ui/vue` declares `"@glace-ui/core": "workspace:*"` in dependencies. pnpm uses this to determine execution order in `-r run` calls — core builds first, always.

For `test`: since packages don't declare test-time workspace deps on each other, the explicit `pnpm -r run build && pnpm -r run test` chain ensures dist/ exists before tests run.
