# Getting Started

## Installation

```bash
# Install Vue bindings (includes core as dependency)
pnpm add @glace-ui/vue

# Or install core only (CSS + tokens, no framework)
pnpm add @glace-ui/core
```

## Quick Start (Vue 3)

```ts
// main.ts
import { createApp } from 'vue'
import { GlacePlugin } from '@glace-ui/vue'
import '@glace-ui/core/css'
import App from './App.vue'

createApp(App).use(GlacePlugin).mount('#app')
```

All components are now available globally:

```vue
<template>
  <GlaceCard hoverable>
    <template #header>Welcome</template>
    Your glace content here
  </GlaceCard>
</template>
```

## Tree-Shaking (Import Individual Components)

```vue
<script setup>
import { GlaceCard, GlaceButton } from '@glace-ui/vue'
</script>
```

## CSS-Only Usage

Use the core CSS without any framework:

```html
<link rel="stylesheet" href="node_modules/@glace-ui/core/dist/index.css" />

<div class="glace-card glace-card--hoverable">
  <div class="glace-card__header">Title</div>
  <div class="glace-card__body">Content</div>
</div>
```

You must set the CSS custom properties on a parent element:

```css
:root {
  --glace-bg: rgba(255, 255, 255, 0.12);
  --glace-bg-hover: rgba(255, 255, 255, 0.18);
  --glace-border: rgba(255, 255, 255, 0.2);
  --glace-text-primary: rgba(255, 255, 255, 0.95);
  --glace-text-secondary: rgba(255, 255, 255, 0.7);
  --glace-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  --glace-blur: 16px;
  --glace-blur-intense: 24px;
  --glace-blur-subtle: 8px;
  --glace-radius: 16px;
  --glace-radius-sm: 8px;
  --glace-radius-lg: 24px;
  --glace-radius-full: 9999px;
  --glace-border-width: 1px;
}
```
