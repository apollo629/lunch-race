<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCountdownRaceEngine } from '../composables/useCountdownRaceEngine'
import { useAppState } from '../composables/useAppState'
import { loadSprites } from '../utils/spriteLoader'
import {
  drawBackgroundLayers,
  drawHorse,
  drawFinishLine,
  drawTimer,
} from '../utils/canvasRenderer'
import { calculateYPositions } from '../utils/treadmillPhysics'
import { TREADMILL_CONFIG } from '../constants/treadmillConfig'

const { lunchSpots, finishRace, raceTime } = useAppState()

const canvasRef = ref(null)
const ctx = ref(null)
const animationFrameId = ref(null)
const assetsLoaded = ref(false)
const scrollOffset = ref(0)
const finishLine = ref(null)

const handleRaceComplete = (winner, standings) => {
  finishRace(winner, standings)
}

const {
  horses,
  remainingTime,
  formattedTime,
  isRunning,
  startCountdown,
  updateRace,
} = useCountdownRaceEngine(lunchSpots.value, handleRaceComplete)

onMounted(async () => {
  console.log('TreadmillRaceCanvas mounted')

  // Setup canvas
  const canvas = canvasRef.value
  if (!canvas) {
    console.error('Canvas element not found')
    return
  }

  ctx.value = canvas.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Load assets
  try {
    await loadSprites()
  } catch (error) {
    console.warn('Some assets failed to load, will use fallbacks:', error)
  }
  assetsLoaded.value = true

  // Initialize horse Y positions
  const yPositions = calculateYPositions(horses.value.length, canvas.height)
  horses.value.forEach((horse, i) => {
    horse.y = yPositions[i]
  })

  console.log('Starting race with', horses.value.length, 'horses')

  // Start race
  setTimeout(() => {
    startCountdown(raceTime.value)
    startAnimationLoop()
  }, 500)
})

onUnmounted(() => {
  console.log('TreadmillRaceCanvas unmounted')
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function startAnimationLoop() {
  let lastTimestamp = 0

  function loop(timestamp) {
    const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 0
    lastTimestamp = timestamp

    // Update race state
    updateRace(timestamp, deltaTime)

    // Update scroll offset
    scrollOffset.value += TREADMILL_CONFIG.BASE_SCROLL_SPEED * (deltaTime / 1000)

    // Spawn finish line at 5 seconds remaining
    if (
      remainingTime.value <= TREADMILL_CONFIG.FINISH_LINE_SPAWN_TIME &&
      !finishLine.value
    ) {
      finishLine.value = {
        x: canvasRef.value.width + 200,
        width: TREADMILL_CONFIG.FINISH_LINE_WIDTH,
        spawned: true,
      }
      console.log('Finish line spawned!')
    }

    // Move finish line
    if (finishLine.value) {
      finishLine.value.x -= TREADMILL_CONFIG.BASE_SCROLL_SPEED * (deltaTime / 1000)
    }

    // Render
    const canvas = canvasRef.value
    ctx.value.clearRect(0, 0, canvas.width, canvas.height)

    drawBackgroundLayers(
      ctx.value,
      scrollOffset.value,
      canvas.width,
      canvas.height
    )
    horses.value.forEach((horse) => drawHorse(ctx.value, horse))
    drawFinishLine(ctx.value, finishLine.value, canvas.height)
    drawTimer(ctx.value, formattedTime.value, canvas.width)

    if (isRunning.value) {
      animationFrameId.value = requestAnimationFrame(loop)
    }
  }

  animationFrameId.value = requestAnimationFrame(loop)
}

function handleReset() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  // Emit reset event to parent
  window.location.reload() // Simple reset for now
}
</script>

<template>
  <div class="treadmill-race">
    <div v-if="!assetsLoaded" class="loading-screen">
      <div class="loading-spinner"></div>
      <p>Loading race assets...</p>
    </div>

    <canvas ref="canvasRef"></canvas>

    <div class="race-controls">
      <button class="btn btn-secondary" @click="handleReset">Clear</button>
    </div>
  </div>
</template>

<style scoped>
.treadmill-race {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.loading-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.race-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 100;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}
</style>
