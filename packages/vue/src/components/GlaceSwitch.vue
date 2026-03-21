<script setup lang="ts">
/**
 * A liquid glass toggle switch with track and pill (dual-icon) modes.
 *
 * @example
 * ```vue
 * <!-- Basic -->
 * <GlaceSwitch v-model="enabled" label="Enable notifications" />
 *
 * <!-- Dual-icon pill (light/dark toggle) -->
 * <GlaceSwitch v-model="isDark">
 *   <template #unchecked-icon><MoonIcon /></template>
 *   <template #checked-icon><SunIcon /></template>
 * </GlaceSwitch>
 * ```
 */

import { computed, ref, useSlots } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceSwitchProps } from './types'

const props = withDefaults(defineProps<GlaceSwitchProps>(), {
  modelValue: false,
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

/** Pill mode activates when both icon slots are provided */
const isPillMode = computed(() => !!slots['checked-icon'] && !!slots['unchecked-icon'])

const classes = computed(() => [
  'glace-switch',
  `glace-switch--${props.size}`,
  props.modelValue && 'glace-switch--checked',
  props.disabled && 'glace-switch--disabled',
  isPillMode.value && 'glace-switch--pill',
])

function toggle() {
  emit('update:modelValue', !props.modelValue)
}

// Specular hover effect on the track. In pill mode the effect is visually suppressed
// via CSS: --glace-hover-enabled: 0 on .glace-switch--pill .glace-switch__track
useGlaceLight(trackRef)

defineExpose({ rootRef })
</script>

<template>
  <label ref="rootRef" :class="classes">
    <input
      class="glace-switch__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />

    <!-- Track -->
    <span ref="trackRef" class="glace-switch__track glace-glass">
      <!-- Pill mode: both icons always visible -->
      <template v-if="isPillMode">
        <span
          class="glace-switch__thumb"
          :class="modelValue ? 'glace-switch__thumb--inactive' : 'glace-switch__thumb--active'"
        >
          <slot name="unchecked-icon" />
        </span>
        <span
          class="glace-switch__thumb"
          :class="modelValue ? 'glace-switch__thumb--active' : 'glace-switch__thumb--inactive'"
        >
          <slot name="checked-icon" />
        </span>
      </template>

      <!-- Track mode: single thumb, optional icon -->
      <span v-else class="glace-switch__thumb">
        <slot v-if="modelValue" name="checked-icon" />
        <slot v-else name="unchecked-icon" />
      </span>
    </span>

    <!-- Label -->
    <span v-if="label || $slots.default" class="glace-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
