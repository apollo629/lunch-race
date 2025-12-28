import { ref, onUnmounted } from 'vue'
import {
  calculateVelocityUpdate,
  generateInitialVelocity,
} from '../utils/raceAlgorithm'
import { RACE_CONFIG } from '../constants/raceConfig'

export function useRaceEngine(participants, onRaceComplete) {
  const positions = ref({}) // { id: positionValue }
  const velocities = ref({}) // { id: currentVelocity }
  const finishTimes = ref({}) // { id: finishTimeInMs }
  const isRacing = ref(false)
  let animationFrameId = null
  let lastTimestamp = 0
  let raceStartTime = 0

  const initializeRace = () => {
    // Initialize positions and velocities for each participant
    participants.forEach((participant) => {
      positions.value[participant.id] = 0
      velocities.value[participant.id] = generateInitialVelocity()
      finishTimes.value[participant.id] = null
    })
  }

  const updateRace = (timestamp) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp
      raceStartTime = timestamp
    }

    const deltaTime = timestamp - lastTimestamp
    lastTimestamp = timestamp

    const elapsedTime = timestamp - raceStartTime

    // Update each participant's position
    participants.forEach((participant) => {
      const id = participant.id

      // Update velocity with jitter
      velocities.value[id] = calculateVelocityUpdate(
        velocities.value[id],
        deltaTime
      )

      // Update position based on velocity and delta time
      positions.value[id] += velocities.value[id] * (deltaTime / 1000)

      // Track finish time when crossing the finish line
      if (positions.value[id] >= RACE_CONFIG.FINISH_LINE_POSITION && finishTimes.value[id] === null) {
        finishTimes.value[id] = elapsedTime
      }
    })

    // Check if all horses have finished
    const allFinished = participants.every(
      (p) => finishTimes.value[p.id] !== null
    )

    // Force finish if race takes too long
    const raceTimeout = elapsedTime >= RACE_CONFIG.MAX_RACE_DURATION

    // Check if at least one horse has finished
    const someoneFinished = participants.some(
      (p) => finishTimes.value[p.id] !== null
    )

    if ((allFinished || raceTimeout) && someoneFinished) {
      stopRace()

      // Calculate final standings sorted by finish time (fastest first)
      const standings = participants
        .map((p) => ({
          ...p,
          finalPosition: positions.value[p.id],
          finishTime: finishTimes.value[p.id] || elapsedTime, // Fallback for timeout
        }))
        .sort((a, b) => a.finishTime - b.finishTime)

      // Winner is the one with the fastest time (first in sorted standings)
      const winner = standings[0]

      onRaceComplete(winner, standings)
    } else {
      animationFrameId = requestAnimationFrame(updateRace)
    }
  }

  const startRace = () => {
    initializeRace()
    isRacing.value = true
    lastTimestamp = 0
    raceStartTime = 0
    animationFrameId = requestAnimationFrame(updateRace)
  }

  const stopRace = () => {
    isRacing.value = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    stopRace()
  })

  return {
    positions,
    velocities,
    isRacing,
    startRace,
    stopRace,
  }
}
