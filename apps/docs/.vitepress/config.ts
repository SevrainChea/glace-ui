import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

export default defineConfig({
  title: 'GlaceUI',
  description: 'A liquid glass component library for Vue 3',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/card' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
          { text: 'AI Usage', link: '/guide/ai-usage' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Card', link: '/components/card' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
          { text: 'Navbar', link: '/components/navbar' },
          { text: 'Modal', link: '/components/modal' },
          { text: 'Chat Bubble', link: '/components/chat-bubble' },
          { text: 'Avatar', link: '/components/avatar' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sevrainchea/glace-ui' },
    ],
  },
  vite: {
    plugins: [llmstxt()],
  },
})
