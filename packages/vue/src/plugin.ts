import type { App } from 'vue'
import type { GlaceTokens } from '@glace-ui/core'
import { injectGlaceTokens } from '@glace-ui/core'

import GlaceCard from './components/GlaceCard.vue'
import GlaceBadge from './components/GlaceBadge.vue'
import GlaceButton from './components/GlaceButton.vue'
import GlaceInput from './components/GlaceInput.vue'
import GlaceNavbar from './components/GlaceNavbar.vue'
import GlaceModal from './components/GlaceModal.vue'
import GlaceChatBubble from './components/GlaceChatBubble.vue'
import GlaceAvatar from './components/GlaceAvatar.vue'

/** Options for the GlaceUI Vue plugin */
export interface GlacePluginOptions {
  /** Token overrides to apply on install */
  theme?: Partial<GlaceTokens>
}

/**
 * Vue plugin that registers all GlaceUI components globally
 * and optionally injects theme tokens.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { GlacePlugin } from '@glace-ui/vue'
 * createApp(App).use(GlacePlugin, { theme: { '--glace-blur': '20px' } })
 * ```
 */
export const GlacePlugin = {
  install(app: App, options?: GlacePluginOptions) {
    app.component('GlaceCard', GlaceCard)
    app.component('GlaceBadge', GlaceBadge)
    app.component('GlaceButton', GlaceButton)
    app.component('GlaceInput', GlaceInput)
    app.component('GlaceNavbar', GlaceNavbar)
    app.component('GlaceModal', GlaceModal)
    app.component('GlaceChatBubble', GlaceChatBubble)
    app.component('GlaceAvatar', GlaceAvatar)

    if (options?.theme && typeof document !== 'undefined') {
      injectGlaceTokens(options.theme)
    }
  },
}
