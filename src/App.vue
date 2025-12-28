<script setup>
import { useAppState } from './composables/useAppState'
import SetupView from './components/SetupView.vue'
import RaceView from './components/RaceView.vue'
import ResultView from './components/ResultView.vue'

const { currentState } = useAppState()
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Lunch Race</h1>
    </header>
    <main>
      <SetupView v-if="currentState === 'setup'" />
      <RaceView v-else-if="currentState === 'race'" />
      <ResultView v-else-if="currentState === 'result'" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
  color: white;
  padding: var(--space-lg) var(--space-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  header {
    padding: var(--space-md);
  }

  header h1 {
    font-size: 1.5rem;
  }
}
</style>
