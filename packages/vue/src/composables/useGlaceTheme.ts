import { computed, inject, provide, ref, watch } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { glaceTokens, glaceTokensLight, glaceTokensDark, injectGlaceTokens } from '@glace-ui/core'
import type { GlaceTokens } from '@glace-ui/core'

/** Options for useGlaceTheme */
export interface GlaceThemeOptions {
  /** Initial token overrides */
  tokens?: Partial<GlaceTokens>
  /** Start in dark mode (default: true) */
  darkMode?: boolean
}

export interface GlaceThemeReturn {
  /** Current resolved tokens */
  tokens: ComputedRef<GlaceTokens>
  /** Apply partial token overrides */
  setTheme: (overrides: Partial<GlaceTokens>) => void
  /** Toggle between light and dark mode */
  toggleDarkMode: () => void
  /** Current dark mode state */
  isDark: Ref<boolean>
}

const GLASS_THEME_KEY: InjectionKey<GlaceThemeReturn> = Symbol('glace-theme')

/**
 * Provides reactive glace theme management via Vue's provide/inject.
 * Call at root component to provide theme; call in children to consume it.
 *
 * @param options - Initial theme options
 * @returns Theme controls and reactive token state
 */
export function useGlaceTheme(options?: GlaceThemeOptions): GlaceThemeReturn {
  const existing = inject(GLASS_THEME_KEY, null)
  if (existing) return existing

  const isDark = ref(options?.darkMode ?? true)
  const overrides = ref<Partial<GlaceTokens>>(options?.tokens ?? {})

  const tokens = computed<GlaceTokens>(() => {
    const base = isDark.value ? { ...glaceTokens, ...glaceTokensDark } : { ...glaceTokens, ...glaceTokensLight }
    return { ...base, ...overrides.value }
  })

  function setTheme(newOverrides: Partial<GlaceTokens>) {
    overrides.value = { ...overrides.value, ...newOverrides }
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value
  }

  // Inject CSS custom properties into the document whenever tokens change
  watch(tokens, (t) => {
    if (typeof document !== 'undefined') {
      injectGlaceTokens(t)
    }
  }, { immediate: true })

  const themeReturn: GlaceThemeReturn = { tokens, setTheme, toggleDarkMode, isDark }
  provide(GLASS_THEME_KEY, themeReturn)
  return themeReturn
}
