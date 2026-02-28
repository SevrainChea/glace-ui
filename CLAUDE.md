# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build              # Build all packages (respects dependency order: core → vue → apps)
pnpm test               # Run all tests (requires build first)
pnpm lint               # ESLint across monorepo
pnpm typecheck          # TypeScript strict check all packages

# Single-package commands
pnpm --filter @glace-ui/core build       # Build core (tsdown + CSS concatenation)
pnpm --filter @glace-ui/core test        # Run core tests only
pnpm --filter @glace-ui/vue build        # Build Vue bindings (tsdown + unplugin-vue)
pnpm --filter @glace-ui/vue test         # Run Vue component tests only
pnpm --filter @glace-ui/playground dev   # Start playground dev server
pnpm --filter @glace-ui/docs dev         # Start VitePress docs dev server

# Run a single test file
pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceCard.test.ts
pnpm --filter @glace-ui/core exec vitest run src/__tests__/tokens.test.ts
```

## Architecture

**Dependency flow**: `@glace-ui/core` → `@glace-ui/vue` → `apps/playground`, `apps/docs`

### @glace-ui/core (framework-agnostic)
- **Tokens** (`src/tokens/`): Design tokens as TypeScript objects (`GlaceTokens` type) with three presets: `glaceTokens` (default), `glaceTokensLight`, `glaceTokensDark`. Tokens map 1:1 to `--glace-*` CSS custom properties.
- **Utils** (`src/utils/`): `getContrastColor()`, `generateGlaceGradient()`, `createGlaceTheme()`. Pure functions, no DOM dependency.
- **CSS** (`src/css/`): 8 BEM component stylesheets using only `var(--glace-*)` references. Never hardcode values. Every component includes `backdrop-filter` + `-webkit-backdrop-filter` + `@supports` fallback.
- **CSS Build**: `scripts/build-css.mjs` concatenates individual CSS files into `dist/index.css` (runs after tsdown).
- **`injectGlaceTokens()`**: Sets CSS custom properties on an element (default `:root`). This is how tokens connect to CSS.

### @glace-ui/vue
- **Components** (`src/components/`): 8 SFCs using `<script setup lang="ts">`. Props are defined in `types.ts` (separate from SFCs) for clean DTS generation.
- **Composables**: `useGlaceTheme()` uses Vue provide/inject + watches tokens to auto-inject CSS vars. `useGlaceOverlay()` manages open/close + body scroll lock.
- **Plugin** (`src/plugin.ts`): Registers all components globally, optionally injects theme tokens.
- **Build**: tsdown with `unplugin-vue/rolldown` for SFC compilation, `dts: { vue: true }` for Vue-aware type generation. Vue and @glace-ui/core are externalized.

### Build tooling
- **tsdown** (rolldown-powered): All packages use `tsdown.config.ts` producing ESM + CJS + DTS.
- **pnpm workspaces**: `workspace:*` protocol links packages.

## Key Conventions

- **CSS token naming**: All custom properties use `--glace-` prefix. All CSS classes use `glace-` BEM prefix (e.g., `.glace-card__header`, `.glace-card--hoverable`).
- **Component prop → CSS class mapping**: Props like `variant`, `size`, `elevation` map to BEM modifier classes via computed arrays.
- **No hardcoded CSS values in component styles**: Everything references `var(--glace-*)` tokens.
- **Formatting**: No semicolons, single quotes, trailing commas, 100 char width (Prettier).
- **Strict TypeScript**: `strict: true`, `isolatedModules`, bundler moduleResolution.
- **Exports**: Core exposes `"./css"` for CSS import path (`@glace-ui/core/css`). Types condition comes first in exports map.

## Local Linking (for developing with consumer repos)

```bash
# In glace-ui: build and register packages globally
pnpm run dev:link

# In consumer repo (e.g. portfolio-frontend): symlink packages
pnpm link --global @glace-ui/core @glace-ui/vue

# Watch mode: run in glace-ui so changes rebuild dist/ automatically
pnpm dev

# Unlink in consumer repo (restore registry versions)
pnpm uninstall @glace-ui/core @glace-ui/vue && pnpm install
```

- `dev:link` builds all packages then registers them globally via `pnpm link --global`
- `link:global` registers without building (when dist is already up to date)
- Consumer repos pick up changes via symlink — no publish cycle needed
- Portfolio has `link:glace` / `unlink:glace` convenience scripts

## Release & Publishing

`@glace-ui/core` and `@glace-ui/vue` are version-locked (bumped together). Playground and docs are not published.

```bash
pnpm release patch          # Bump patch, commit, tag, push (triggers npm publish)
pnpm release minor          # Bump minor
pnpm release major          # Bump major
pnpm release:dry patch      # Dry run — shows what would happen without publishing
```

The release script (`scripts/release.js`) runs lint, typecheck, build, and tests before bumping versions, then commits as `v<version>`, tags, and pushes. Both packages use `publishConfig.access: "public"`.
