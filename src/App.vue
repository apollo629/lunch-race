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
  background: linear-gradient(135deg, #1a472a 0%, #2d5f3f 50%, #1a472a 100%);
  color: #f0e6d2;
  padding: var(--space-lg) var(--space-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-bottom: 3px solid #d4af37;
  position: relative;
}

header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    #000 0px,
    #000 15px,
    #fff 15px,
    #fff 30px
  );
  opacity: 0.3;
}

header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
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

/* Phones - compact header */
@media (max-width: 480px) {
  header {
    padding: var(--space-sm) var(--space-md);
  }

  header h1 {
    font-size: 1.25rem;
  }
}
</style>
