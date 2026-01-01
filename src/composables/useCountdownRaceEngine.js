import { ref, computed } from 'vue'
import { TREADMILL_CONFIG } from '../constants/treadmillConfig'
import { HORSE_COLORS } from '../constants/raceConfig'
import { updateHorsePosition, updateSpriteFrame } from '../utils/treadmillPhysics'

export function useCountdownRaceEngine(lunchSpots, onRaceComplete) {
  const raceTime = ref(TREADMILL_CONFIG.DEFAULT_RACE_TIME)
  const remainingTime = ref(raceTime.value)
  const isRunning = ref(false)
  const startTimestamp = ref(null)

  // Initialize horses
  const horses = ref(
    lunchSpots.map((spot, index) => ({
      id: spot.id,
      name: spot.name,
      color: HORSE_COLORS[index % HORSE_COLORS.length],
      x: TREADMILL_CONFIG.HORSE_CENTER_X,
      y: 0, // Will be calculated in component
      velocity: 0,
      spriteFrame: 0,
      frameTimer: 0,
    }))
  )

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(remainingTime.value / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (num) => String(num).padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  function startCountdown(duration) {
    raceTime.value = duration || TREADMILL_CONFIG.DEFAULT_RACE_TIME
    remainingTime.value = raceTime.value
    isRunning.value = true
    startTimestamp.value = null
  }

  let debugCounter = 0

  function updateRace(timestamp, deltaTime) {
    if (!isRunning.value) return

    if (!startTimestamp.value) {
      startTimestamp.value = timestamp
    }

    const elapsed = timestamp - startTimestamp.value
    remainingTime.value = Math.max(0, raceTime.value - elapsed)

    // Update horse positions and animations
    horses.value.forEach((horse) => {
      updateHorsePosition(horse, deltaTime)
      updateSpriteFrame(horse, deltaTime)
    })

    // Debug: Log horse positions every 3 seconds
    debugCounter++
    if (debugCounter % 180 === 0) { // Every ~3 seconds at 60fps
      const positions = horses.value.map(h => ({
        name: h.name,
        x: Math.round(h.x),
        velocity: Math.round(h.velocity),
        target: Math.round(h.targetSpeed || 0)
      }))
      console.log('Horse positions:', positions)
    }

    // Check for race completion
    if (remainingTime.value <= 0) {
      isRunning.value = false
      determineWinner()
    }
  }

  function determineWinner() {
    // Sort horses by X position (furthest right wins)
    const sorted = [...horses.value].sort((a, b) => b.x - a.x)

    const winner = sorted[0]
    const standings = sorted.map((horse, i) => ({
      ...horse,
      position: i + 1,
      finalX: horse.x,
    }))

    onRaceComplete(winner, standings)
  }

  return {
    horses,
    remainingTime,
    formattedTime,
    isRunning,
    startCountdown,
    updateRace,
  }
}
