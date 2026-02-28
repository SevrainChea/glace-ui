<script setup lang="ts">
import { ref } from 'vue'
import { useGlaceTheme } from '@glace-ui/vue'

useGlaceTheme()

const showModal = ref(false)
const inputValue = ref('')
const errorInputValue = ref('bad input')
</script>

<template>
  <div class="playground">
    <!-- Navbar -->
    <GlaceNavbar sticky blur-on-scroll>
      <template #logo>
        <span class="logo">GlaceUI</span>
      </template>
      <template #actions>
        <GlaceButton variant="ghost" size="sm">Docs</GlaceButton>
        <GlaceButton variant="ghost" size="sm">GitHub</GlaceButton>
        <GlaceButton variant="primary" size="sm">Get Started</GlaceButton>
      </template>
    </GlaceNavbar>

    <!-- Main Content -->
    <main class="content">
      <header class="hero">
        <h1>GlaceUI Playground</h1>
        <p>A showcase of all 8 liquid glass components</p>
      </header>

      <!-- Cards Section -->
      <section class="section">
        <h2 class="section-title">GlaceCard</h2>
        <div class="card-grid">
          <GlaceCard elevation="flat" blur-intensity="subtle">
            <template #header>Flat Elevation</template>
            Subtle blur with minimal shadow for understated surfaces.
            <template #footer>
              <GlaceButton variant="ghost" size="sm">Learn more</GlaceButton>
            </template>
          </GlaceCard>

          <GlaceCard elevation="raised" blur-intensity="medium">
            <template #header>Raised Elevation</template>
            Medium blur with a soft raised shadow. Hover to see the effect.
            <template #footer>
              <GlaceButton variant="ghost" size="sm">Learn more</GlaceButton>
            </template>
          </GlaceCard>

          <GlaceCard elevation="floating" blur-intensity="strong">
            <template #header>Floating Elevation</template>
            Strong blur with a pronounced floating shadow for emphasis.
            <template #footer>
              <GlaceButton variant="ghost" size="sm">Learn more</GlaceButton>
            </template>
          </GlaceCard>
        </div>
      </section>

      <!-- Badges Section -->
      <section class="section">
        <h2 class="section-title">GlaceBadge</h2>
        <div class="row">
          <GlaceBadge variant="solid">Solid</GlaceBadge>
          <GlaceBadge variant="outline">Outline</GlaceBadge>
          <GlaceBadge variant="subtle">Subtle</GlaceBadge>
          <GlaceBadge variant="solid" size="lg" color="#a78bfa">Large</GlaceBadge>
          <GlaceBadge variant="solid" removable @remove="() => {}">Removable</GlaceBadge>
        </div>
      </section>

      <!-- Buttons Section -->
      <section class="section">
        <h2 class="section-title">GlaceButton</h2>
        <div class="row">
          <GlaceButton variant="primary">Primary</GlaceButton>
          <GlaceButton variant="secondary">Secondary</GlaceButton>
          <GlaceButton variant="ghost">Ghost</GlaceButton>
          <GlaceButton variant="primary" size="lg">Large</GlaceButton>
          <GlaceButton variant="primary" size="sm">Small</GlaceButton>
          <GlaceButton variant="primary" loading>Loading</GlaceButton>
          <GlaceButton variant="secondary" disabled>Disabled</GlaceButton>
        </div>
      </section>

      <!-- Inputs Section -->
      <section class="section">
        <h2 class="section-title">GlaceInput</h2>
        <div class="input-grid">
          <GlaceInput
            v-model="inputValue"
            placeholder="Type something..."
          />
          <GlaceInput
            v-model="errorInputValue"
            error="This field is invalid"
          />
          <GlaceInput
            placeholder="Disabled input"
            disabled
          />
        </div>
      </section>

      <!-- Chat Bubbles Section -->
      <section class="section">
        <h2 class="section-title">GlaceChatBubble</h2>
        <div class="chat-container">
          <GlaceChatBubble variant="received" timestamp="10:42 AM">
            Hey! Have you seen the new GlaceUI components?
          </GlaceChatBubble>
          <GlaceChatBubble variant="sent" timestamp="10:43 AM">
            Yes, the liquid glass effects look amazing!
          </GlaceChatBubble>
          <GlaceChatBubble variant="received" timestamp="10:44 AM">
            Right? The blur and transparency really pop on dark backgrounds.
          </GlaceChatBubble>
        </div>
      </section>

      <!-- Avatars Section -->
      <section class="section">
        <h2 class="section-title">GlaceAvatar</h2>
        <div class="row">
          <GlaceAvatar size="sm" status="online" alt="User 1" />
          <GlaceAvatar size="md" status="away" alt="User 2" />
          <GlaceAvatar size="lg" status="busy" alt="User 3" />
          <GlaceAvatar size="xl" status="offline" alt="User 4" />
          <GlaceAvatar
            size="lg"
            status="online"
            src="https://api.dicebear.com/9.x/glace/svg?seed=Felix"
            alt="Felix"
          />
        </div>
      </section>

      <!-- Modal Section -->
      <section class="section">
        <h2 class="section-title">GlaceModal</h2>
        <GlaceButton variant="primary" @click="showModal = true">
          Open Modal
        </GlaceButton>

        <GlaceModal v-model="showModal" size="md" close-on-overlay>
          <template #header>GlaceUI Modal</template>
          <p>This is a liquid glass modal with backdrop blur, focus trapping, and Escape key support.</p>
          <p>Click the overlay or press Escape to close.</p>
          <template #footer>
            <div class="modal-footer-actions">
              <GlaceButton variant="ghost" @click="showModal = false">Cancel</GlaceButton>
              <GlaceButton variant="primary" @click="showModal = false">Confirm</GlaceButton>
            </div>
          </template>
        </GlaceModal>
      </section>
    </main>
  </div>
</template>

<style scoped>
.playground {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(15, 12, 41, 0.3), rgba(48, 43, 99, 0.3), rgba(36, 36, 62, 0.3)), url('/foret.webp') center / cover no-repeat fixed;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #c4b5fd, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.125rem;
  color: #94a3b8;
  margin: 0;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #cbd5e1;
  letter-spacing: -0.01em;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 520px;
}

.modal-footer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
