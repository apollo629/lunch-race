<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRaceEngine } from '../composables/useRaceEngine'
import { useAppState } from '../composables/useAppState'
import Horse from './Horse.vue'
import { HORSE_COLORS, RACE_CONFIG } from '../constants/raceConfig'

const { lunchSpots, finishRace } = useAppState()

const trackContainerRef = ref(null)
const raceAreaWidth = ref(0)

const handleRaceComplete = (winner, standings) => {
  finishRace(winner, standings)
}

const { positions, startRace } = useRaceEngine(
  lunchSpots.value,
  handleRaceComplete
)

const finishLinePixels = computed(() => {
  // Position finish line at configured percentage of race area
  return (raceAreaWidth.value * RACE_CONFIG.FINISH_LINE_POSITION) / 100
})

onMounted(() => {
  // Measure actual race area width
  if (trackContainerRef.value) {
    const container = trackContainerRef.value
    const containerWidth = container.offsetWidth

    // Calculate padding based on screen size
    const screenWidth = window.innerWidth
    let paddingTotal
    if (screenWidth <= 374) {
      paddingTotal = 12 // 6px per side for extra small phones
    } else if (screenWidth <= 480) {
      paddingTotal = 16 // 8px per side (var(--space-sm))
    } else if (screenWidth <= 768) {
      paddingTotal = 32 // 16px per side (var(--space-md))
    } else {
      paddingTotal = 64 // 32px per side (var(--space-xl))
    }

    raceAreaWidth.value = containerWidth - paddingTotal
  }

  // Small delay for dramatic effect
  setTimeout(() => {
    startRace()
  }, 500)
})
</script>

<template>
  <div class="race-track fade-in">
    <div class="race-header">
      <h2>Race in Progress!</h2>
      <p>First to cross the finish line wins!</p>
    </div>

    <div class="track-container" ref="trackContainerRef">
      <div
        class="finish-line"
        :style="{ left: `${finishLinePixels}px` }"
      ></div>
      <div class="lanes">
        <Horse
          v-for="(spot, index) in lunchSpots"
          :key="spot.id"
          :name="spot.name"
          :color="HORSE_COLORS[index % HORSE_COLORS.length]"
          :position="positions[spot.id] || 0"
          :race-area-width="raceAreaWidth"
          :lane="index"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-track {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-xl);
}

.race-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.race-header h2 {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.race-header p {
  color: var(--color-text-light);
  font-size: 1.125rem;
}

.track-container {
  flex: 1;
  position: relative;
  background: linear-gradient(to bottom, #f0e6d2 0%, #e8dcc4 100%);
  border-radius: 16px;
  padding: var(--space-xl);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 60px rgba(139, 92, 46, 0.1);
}

.track-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(90deg, #d4af37, #d4af37 20px, #b8860b 20px, #b8860b 40px);
  border-radius: 16px 16px 0 0;
}

.finish-line {
  position: absolute;
  /* left is set dynamically via :style */
  top: 50%;
  height: calc(100% - var(--space-xl) * 2);
  width: 12px;
  background: repeating-linear-gradient(
    0deg,
    #000,
    #000 15px,
    #fff 15px,
    #fff 30px
  );
  border-radius: 4px;
  z-index: 10;
  box-shadow:
    0 0 20px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(255, 215, 0, 0.4);
  transform: translateX(-6px) translateY(-50%);
  animation: finish-line-pulse 2s ease-in-out infinite;
}

.finish-line::before {
  content: '🏁 FINISH';
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
  background: var(--color-surface);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lanes {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  position: relative;
  z-index: 2;
}

.lanes::before {
  content: 'START';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.4);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 8px 4px;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.8) 10px,
    rgba(0, 0, 0, 0.1) 10px,
    rgba(0, 0, 0, 0.1) 20px
  );
  border-radius: 4px;
  z-index: 5;
}

@media (max-width: 768px) {
  .race-track {
    padding: var(--space-md);
  }

  .race-header h2 {
    font-size: 1.5rem;
  }

  .race-header p {
    font-size: 1rem;
  }

  .track-container {
    padding: var(--space-md);
  }

  .finish-line {
    /* left is set dynamically via :style */
    height: calc(100% - var(--space-md) * 2);
  }
}

/* Phones - minimal padding */
@media (max-width: 480px) {
  .race-track {
    padding: var(--space-sm);
  }

  .race-header {
    margin-bottom: var(--space-lg);
  }

  .race-header h2 {
    font-size: 1.25rem;
    margin-bottom: var(--space-xs);
  }

  .race-header p {
    font-size: 0.875rem;
  }

  .track-container {
    padding: var(--space-sm);
    border-radius: 12px;
  }

  .finish-line {
    height: calc(100% - var(--space-sm) * 2);
    width: 10px;
  }

  .finish-line::before {
    font-size: 0.7rem;
    padding: 2px 4px;
    top: -28px;
  }

  .lanes {
    gap: var(--space-sm);
  }
}

/* Extra small phones - absolute minimum padding */
@media (max-width: 374px) {
  .race-track {
    padding: 6px;
  }

  .track-container {
    padding: 6px;
    border-radius: 8px;
  }

  .finish-line {
    height: calc(100% - 12px);
  }

  .finish-line::before {
    content: '🏁';
    font-size: 1rem;
    padding: 2px;
  }
}
</style>
