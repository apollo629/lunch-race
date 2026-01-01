import { ref, computed } from 'vue'
import { useLunchSpots } from './useLunchSpots'
import { VALIDATION_RULES } from '../constants/raceConfig'

const APP_STATES = {
  SETUP: 'setup',
  RACE: 'race',
  RESULT: 'result',
}

const currentState = ref(APP_STATES.SETUP)
const winner = ref(null)
const finalStandings = ref([])
const raceTime = ref(30000) // Default 30 seconds in ms

export function useAppState() {
  const { lunchSpots, addSpot, removeSpot, clearSpots } = useLunchSpots()

  const canStartRace = computed(
    () => lunchSpots.value.length >= VALIDATION_RULES.MIN_SPOTS
  )

  const startRace = () => {
    if (canStartRace.value) {
      currentState.value = APP_STATES.RACE
    }
  }

  const finishRace = (winnerData, standings) => {
    winner.value = winnerData
    finalStandings.value = standings
    currentState.value = APP_STATES.RESULT
  }

  const resetRace = () => {
    currentState.value = APP_STATES.SETUP
    winner.value = null
    finalStandings.value = []
  }

  const newRace = () => {
    resetRace()
    clearSpots()
  }

  return {
    currentState,
    winner,
    finalStandings,
    lunchSpots,
    raceTime,
    addSpot,
    removeSpot,
    canStartRace,
    startRace,
    finishRace,
    resetRace,
    newRace,
  }
}
