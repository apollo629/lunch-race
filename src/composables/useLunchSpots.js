import { ref } from 'vue'
import { VALIDATION_RULES } from '../constants/raceConfig'

const lunchSpots = ref([])

export function useLunchSpots() {
  const addSpot = (name) => {
    const trimmed = name.trim()

    // Validations
    if (!trimmed) {
      return { success: false, error: 'Name cannot be empty' }
    }

    if (trimmed.length > VALIDATION_RULES.MAX_NAME_LENGTH) {
      return {
        success: false,
        error: `Name too long (max ${VALIDATION_RULES.MAX_NAME_LENGTH} chars)`,
      }
    }

    if (lunchSpots.value.length >= VALIDATION_RULES.MAX_SPOTS) {
      return {
        success: false,
        error: `Maximum ${VALIDATION_RULES.MAX_SPOTS} spots allowed`,
      }
    }

    // Check duplicates (case-insensitive)
    const duplicate = lunchSpots.value.some(
      (spot) => spot.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (duplicate) {
      return { success: false, error: 'This spot is already in the race!' }
    }

    lunchSpots.value.push({
      id: Date.now() + Math.random(), // Simple unique ID
      name: trimmed,
    })

    return { success: true }
  }

  const removeSpot = (id) => {
    lunchSpots.value = lunchSpots.value.filter((spot) => spot.id !== id)
  }

  const clearSpots = () => {
    lunchSpots.value = []
  }

  return {
    lunchSpots,
    addSpot,
    removeSpot,
    clearSpots,
  }
}
