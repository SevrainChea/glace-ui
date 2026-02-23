# Theming

GlaceUI uses CSS custom properties (`--glace-*`) for all visual values, making theming straightforward.

## Using `useGlaceTheme`

```vue
<script setup>
import { useGlaceTheme } from '@glace-ui/vue'

const { tokens, setTheme, toggleDarkMode, isDark } = useGlaceTheme({
  darkMode: true,
  tokens: {
    '--glace-blur': '20px',
  },
})
</script>
```

The composable injects all tokens as CSS custom properties on `:root` and reactively updates them.

## Theme Presets

```ts
import { glaceTokens, glaceTokensLight, glaceTokensDark } from '@glace-ui/core'
```

| Preset | Description |
|--------|-------------|
| `glaceTokens` | Default tokens (dark-friendly) |
| `glaceTokensLight` | Light theme overrides |
| `glaceTokensDark` | Dark theme overrides |

## Custom Tokens

Override any token via `createGlaceTheme`:

```ts
import { createGlaceTheme, injectGlaceTokens } from '@glace-ui/core'

const theme = createGlaceTheme({
  '--glace-blur': '24px',
  '--glace-radius': '12px',
  '--glace-bg': 'rgba(100, 50, 200, 0.15)',
})

injectGlaceTokens(theme)
```

## Available Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--glace-bg` | `rgba(255, 255, 255, 0.12)` | Background color |
| `--glace-bg-hover` | `rgba(255, 255, 255, 0.18)` | Hover background |
| `--glace-border` | `rgba(255, 255, 255, 0.2)` | Border color |
| `--glace-text-primary` | `rgba(255, 255, 255, 0.95)` | Primary text |
| `--glace-text-secondary` | `rgba(255, 255, 255, 0.7)` | Secondary text |
| `--glace-shadow` | `0 8px 32px rgba(0, 0, 0, 0.12)` | Box shadow |
| `--glace-blur` | `16px` | Default blur |
| `--glace-blur-intense` | `24px` | Intense blur |
| `--glace-blur-subtle` | `8px` | Subtle blur |
| `--glace-radius` | `16px` | Default radius |
| `--glace-radius-sm` | `8px` | Small radius |
| `--glace-radius-lg` | `24px` | Large radius |
| `--glace-radius-full` | `9999px` | Full/pill radius |
| `--glace-border-width` | `1px` | Border width |
