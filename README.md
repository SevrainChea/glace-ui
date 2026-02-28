# GlaceUI

A liquid glass component library with framework-agnostic CSS tokens and Vue 3 bindings.

## Packages

| Package | Description |
|---------|-------------|
| `@glace-ui/core` | CSS + TypeScript tokens and utilities |
| `@glace-ui/vue` | Vue 3 component bindings |
| `@glace-ui/react` | React bindings (coming soon) |

## Installation

```bash
# Vue 3 (includes core)
pnpm add @glace-ui/vue

# CSS-only
pnpm add @glace-ui/core
```

## Quick Start

```ts
import { createApp } from 'vue'
import { GlacePlugin } from '@glace-ui/vue'
import '@glace-ui/core/css'

createApp(App).use(GlacePlugin).mount('#app')
```

```vue
<template>
  <GlaceCard hoverable elevation="floating">
    <template #header>Welcome</template>
    Beautiful liquid glass content
  </GlaceCard>
</template>
```

## Components

GlaceCard | GlaceBadge | GlaceButton | GlaceInput | GlaceNavbar | GlaceModal | GlaceChatBubble | GlaceAvatar

## AI-Friendly

GlaceUI includes an `llms.txt` file and comprehensive JSDoc for AI-assisted development. See the [AI Usage Guide](https://glace-ui.dev/guide/ai-usage) for details.

## License

[MIT](./LICENSE)
