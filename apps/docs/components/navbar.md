# GlaceNavbar

A navigation bar with glassmorphism effect that supports sticky positioning and scroll-aware blur transitions.

## Import

```ts
import { GlaceNavbar } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceNavbar sticky blur-on-scroll>
    <template #logo>
      <img src="/logo.svg" alt="Logo" />
    </template>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <template #actions>
      <GlaceButton variant="ghost">Sign In</GlaceButton>
    </template>
  </GlaceNavbar>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `boolean` | `false` | Sticks the navbar to the top of the viewport |
| `blur-on-scroll` | `boolean` | `false` | Increases blur intensity as the user scrolls |
| `transparent` | `boolean` | `false` | Removes the background until scrolled |

## Slots

| Slot | Description |
|------|-------------|
| `logo` | Logo or brand area on the left |
| `default` | Main navigation content in the center |
| `actions` | Action buttons/links on the right |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-navbar` | Base navbar class |
| `.glace-navbar--sticky` | Sticky positioning |
| `.glace-navbar--transparent` | Transparent background state |
| `.glace-navbar--scrolled` | Applied after user has scrolled down |
| `.glace-navbar__logo` | Logo container |
| `.glace-navbar__content` | Main content area |
| `.glace-navbar__actions` | Actions container |
