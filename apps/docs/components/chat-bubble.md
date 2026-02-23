# GlaceChatBubble

A chat message bubble with glassmorphism styling, supporting sent and received message variants with timestamps and avatars.

## Import

```ts
import { GlaceChatBubble } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceChatBubble variant="received" timestamp="10:30 AM">
    <template #avatar>
      <GlaceAvatar src="/user.jpg" size="sm" />
    </template>
    Hey, how are you?
  </GlaceChatBubble>

  <GlaceChatBubble variant="sent" timestamp="10:31 AM">
    I'm doing great, thanks!
  </GlaceChatBubble>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'sent' \| 'received'` | `'received'` | Message direction and alignment |
| `timestamp` | `string` | `undefined` | Timestamp text displayed below the message |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Message text content |
| `avatar` | Avatar element displayed beside the bubble |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-chat-bubble` | Base chat bubble class |
| `.glace-chat-bubble--sent` | Sent message variant (aligned right) |
| `.glace-chat-bubble--received` | Received message variant (aligned left) |
| `.glace-chat-bubble__avatar` | Avatar container |
| `.glace-chat-bubble__content` | Message content area |
| `.glace-chat-bubble__timestamp` | Timestamp text element |
