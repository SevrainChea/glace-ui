<script setup lang="ts">
/**
 * A glassmorphism text input with icon/suffix slots and error state.
 *
 * @example
 * ```vue
 * <GlaceInput v-model="email" type="email" placeholder="Email" :error="emailError">
 *   <template #icon><MailIcon /></template>
 * </GlaceInput>
 * ```
 */

import { computed, useSlots } from 'vue'
import type { GlaceInputProps } from './types'

const props = withDefaults(defineProps<GlaceInputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const slots = useSlots()

const inputId = `glace-input-${Math.random().toString(36).slice(2, 9)}`
const errorId = computed(() => props.error ? `${inputId}-error` : undefined)

const wrapperClasses = computed(() => [
  'glace-input',
  props.error && 'glace-input--error',
  props.disabled && 'glace-input--disabled',
  slots.icon && 'glace-input--has-icon',
  slots.suffix && 'glace-input--has-suffix',
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <div :class="wrapperClasses">
      <span v-if="slots.icon" class="glace-input__icon">
        <slot name="icon" />
      </span>
      <input
        :id="inputId"
        class="glace-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="!!error || undefined"
        :aria-describedby="errorId"
        @input="onInput"
      />
      <span v-if="slots.suffix" class="glace-input__suffix">
        <slot name="suffix" />
      </span>
    </div>
    <p v-if="error" :id="errorId" class="glace-input__error-text" role="alert">
      {{ error }}
    </p>
  </div>
</template>
