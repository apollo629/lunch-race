<script setup>
import { useAppState } from '../composables/useAppState'
import { HORSE_COLORS } from '../constants/raceConfig'

const { winner, finalStandings, resetRace, newRace, lunchSpots } =
  useAppState()

const getColorForSpot = (spotId) => {
  const index = lunchSpots.value.findIndex((spot) => spot.id === spotId)
  return HORSE_COLORS[index % HORSE_COLORS.length]
}

const formatPosition = (position) => {
  const suffixes = ['st', 'nd', 'rd']
  const suffix = position <= 3 ? suffixes[position - 1] : 'th'
  return `${position}${suffix} place`
}
</script>

<template>
  <div class="result-view fade-in">
    <div class="result-container">
      <div class="winner-announcement celebrate">
        <h1>We're going to...</h1>
        <div
          class="winner-name"
          :style="{ color: getColorForSpot(winner.id) }"
        >
          {{ winner.name }}!
        </div>
        <p class="winner-subtitle">Winner of the Lunch Race</p>
      </div>

      <div class="standings">
        <h2>Final Standings</h2>
        <ol>
          <li
            v-for="(spot, index) in finalStandings"
            :key="spot.id"
            class="standing-item slide-in"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <span class="position">{{ index + 1 }}</span>
            <span
              class="spot-indicator"
              :style="{ backgroundColor: getColorForSpot(spot.id) }"
            ></span>
            <span class="spot-name">{{ spot.name }}</span>
            <span class="race-position">
              {{ formatPosition(spot.position) }}
            </span>
          </li>
        </ol>
      </div>

      <div class="result-actions">
        <button @click="resetRace">Race Again</button>
        <button class="secondary" @click="newRace">New Race</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.result-container {
  background: var(--color-surface);
  border-radius: 16px;
  padding: var(--space-2xl);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.winner-announcement {
  text-align: center;
  margin-bottom: var(--space-2xl);
  padding: var(--space-xl);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
}

.winner-announcement h1 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.winner-name {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: var(--space-sm);
  line-height: 1.2;
  word-wrap: break-word;
}

.winner-subtitle {
  color: var(--color-text-light);
  font-size: 1rem;
}

.standings {
  margin-bottom: var(--space-2xl);
}

.standings h2 {
  font-size: 1.5rem;
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.standings ol {
  list-style: none;
  counter-reset: standings-counter;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.standing-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg);
  border-radius: 8px;
}

.position {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-text-light);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.standing-item:nth-child(1) .position {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: var(--color-text);
}

.standing-item:nth-child(2) .position {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: var(--color-text);
}

.standing-item:nth-child(3) .position {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%);
  color: white;
}

.spot-indicator {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
}

.spot-name {
  flex: 1;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.race-position {
  font-weight: 600;
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.result-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.result-actions button {
  flex: 1;
  max-width: 200px;
}

@media (max-width: 768px) {
  .result-container {
    padding: var(--space-lg);
  }

  .winner-name {
    font-size: 2rem;
  }

  .winner-announcement h1 {
    font-size: 1.25rem;
  }

  .standings h2 {
    font-size: 1.25rem;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions button {
    max-width: none;
    min-height: 44px;
  }
}

/* Phones - compact fonts and full width */
@media (max-width: 480px) {
  .result-view {
    padding: var(--space-sm);
  }

  .result-container {
    padding: var(--space-md);
    border-radius: 12px;
    max-width: 100%;
  }

  .winner-announcement {
    padding: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .winner-announcement h1 {
    font-size: 1.125rem;
    margin-bottom: var(--space-sm);
  }

  .winner-name {
    font-size: 1.75rem;
    line-height: 1.1;
  }

  .winner-subtitle {
    font-size: 0.875rem;
  }

  .standings {
    margin-bottom: var(--space-lg);
  }

  .standings h2 {
    font-size: 1.125rem;
  }

  .standing-item {
    padding: var(--space-sm) var(--space-md);
    gap: var(--space-sm);
  }

  .spot-indicator {
    width: 20px;
    height: 20px;
  }

  .race-position {
    font-size: 0.75rem;
  }

  .result-actions {
    gap: var(--space-sm);
  }
}

/* Extra small phones */
@media (max-width: 374px) {
  .result-container {
    padding: var(--space-sm);
  }

  .winner-announcement {
    padding: var(--space-sm);
  }

  .winner-name {
    font-size: 1.5rem;
  }

  .winner-announcement h1 {
    font-size: 1rem;
  }

  .position {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .spot-indicator {
    width: 18px;
    height: 18px;
  }
}
</style>
