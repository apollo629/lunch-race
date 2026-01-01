<script setup>
import { ref } from 'vue'
import { useAppState } from '../composables/useAppState'
import LunchSpotInput from './LunchSpotInput.vue'
import { VALIDATION_RULES } from '../constants/raceConfig'

const { lunchSpots, raceTime, removeSpot, canStartRace, startRace } = useAppState()

// Local race duration in seconds for the input
const raceDuration = ref(30)

// Update raceTime when duration changes
const updateRaceTime = () => {
  raceTime.value = raceDuration.value * 1000 // Convert to ms
}
</script>

<template>
  <div class="setup-view fade-in">
    <div class="setup-container">
      <div class="setup-header">
        <h2>Add Lunch Spots</h2>
        <p class="subtitle">
          Add at least {{ VALIDATION_RULES.MIN_SPOTS }} lunch spots to start the
          race!
        </p>
      </div>

      <div class="race-duration-input">
        <label for="race-duration">Race Duration (seconds):</label>
        <input
          id="race-duration"
          type="number"
          v-model.number="raceDuration"
          @change="updateRaceTime"
          min="10"
          max="120"
          step="5"
        />
        <span class="duration-hint">{{ raceDuration }}s countdown</span>
      </div>

      <LunchSpotInput />

      <div v-if="lunchSpots.length > 0" class="lunch-spots-list">
        <h3>Racers ({{ lunchSpots.length }})</h3>
        <ul>
          <li
            v-for="(spot, index) in lunchSpots"
            :key="spot.id"
            class="lunch-spot-item slide-in"
          >
            <span class="spot-number">{{ index + 1 }}</span>
            <span class="spot-name">{{ spot.name }}</span>
            <button class="danger" @click="removeSpot(spot.id)">Remove</button>
          </li>
        </ul>
      </div>

      <div v-else class="empty-state">
        <p>No lunch spots added yet. Start by adding some locations above!</p>
      </div>

      <div class="setup-actions">
        <button
          :disabled="!canStartRace"
          class="start-button"
          @click="startRace"
        >
          {{ canStartRace ? 'Start Race!' : 'Add More Spots to Start' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.setup-container {
  background: var(--color-surface);
  border-radius: 16px;
  padding: var(--space-xl);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.setup-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.setup-header h2 {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.subtitle {
  color: var(--color-text-light);
  font-size: 1rem;
}

.race-duration-input {
  margin: var(--space-lg) 0;
  padding: var(--space-md);
  background: var(--color-bg);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.race-duration-input label {
  font-weight: 600;
  color: var(--color-text);
  flex-shrink: 0;
}

.race-duration-input input {
  width: 100px;
  padding: var(--space-sm);
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
}

.race-duration-input input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.duration-hint {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.lunch-spots-list {
  margin-top: var(--space-xl);
}

.lunch-spots-list h3 {
  margin-bottom: var(--space-md);
  color: var(--color-text);
  font-size: 1.25rem;
}

.lunch-spots-list ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.lunch-spot-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg);
  border-radius: 8px;
  transition: transform var(--transition-fast);
}

.lunch-spot-item:hover {
  transform: translateX(4px);
}

.spot-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.spot-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lunch-spot-item button {
  flex-shrink: 0;
  padding: var(--space-xs) var(--space-md);
  font-size: 0.875rem;
}

.empty-state {
  margin-top: var(--space-xl);
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-text-light);
  background: var(--color-bg);
  border-radius: 8px;
  border: 2px dashed var(--color-border);
}

.setup-actions {
  margin-top: var(--space-xl);
  display: flex;
  justify-content: center;
}

.start-button {
  padding: var(--space-md) var(--space-2xl);
  font-size: 1.125rem;
  min-width: 200px;
}

@media (max-width: 768px) {
  .setup-container {
    padding: var(--space-lg);
  }

  .setup-header h2 {
    font-size: 1.5rem;
  }

  .lunch-spot-item button {
    padding: var(--space-sm) var(--space-lg);
    min-height: 44px;
    font-size: 1rem;
  }
}

/* Phones - full width and larger touch targets */
@media (max-width: 480px) {
  .setup-view {
    padding: var(--space-sm);
  }

  .setup-container {
    padding: var(--space-md);
    border-radius: 12px;
    max-width: 100%;
  }

  .setup-header {
    margin-bottom: var(--space-lg);
  }

  .setup-header h2 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .lunch-spots-list h3 {
    font-size: 1.125rem;
  }

  .lunch-spot-item {
    padding: var(--space-sm) var(--space-md);
  }

  .lunch-spot-item button {
    padding: var(--space-sm) var(--space-md);
    min-height: 44px;
  }

  .start-button {
    width: 100%;
    min-width: auto;
  }
}

/* Extra small phones */
@media (max-width: 374px) {
  .setup-container {
    padding: var(--space-sm);
  }

  .setup-header h2 {
    font-size: 1.125rem;
  }

  .spot-number {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>
