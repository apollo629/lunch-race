import { TREADMILL_CONFIG } from '../constants/treadmillConfig'

export function updateHorsePosition(horse, deltaTime) {
  const dt = deltaTime / 1000 // Convert to seconds

  // Initialize each horse with unique racing characteristics
  if (!horse.targetSpeed) {
    // Each horse has a unique base speed - LOWER speeds so they don't fly off screen
    horse.minSpeed = -10 + Math.random() * 30 // -10 to 20 px/s (can move backward/forward)
    horse.maxSpeed = 30 + Math.random() * 40 // 30-70 px/s
    horse.targetSpeed = horse.minSpeed + Math.random() * (horse.maxSpeed - horse.minSpeed)
    horse.currentSpeed = horse.targetSpeed
    horse.speedChangeRate = 0.15 + Math.random() * 0.25 // How quickly they accelerate/decelerate
    horse.randomness = 20 + Math.random() * 30 // Amount of random jitter
  }

  // Randomly change target speed - each horse independently
  if (Math.random() < 0.03) { // 3% chance per frame (~2x per second at 60fps)
    horse.targetSpeed = horse.minSpeed + Math.random() * (horse.maxSpeed - horse.minSpeed)
  }

  // Smoothly move current speed toward target speed
  const speedDiff = horse.targetSpeed - horse.currentSpeed
  horse.currentSpeed += speedDiff * horse.speedChangeRate

  // Add random jitter each frame (different amount for each horse)
  const jitter = (Math.random() - 0.5) * horse.randomness

  // Set velocity directly
  horse.velocity = horse.currentSpeed + jitter

  // Update position
  horse.x += horse.velocity * dt

  // Gentle boundaries - keep horses on screen without forcing convergence
  const centerX = TREADMILL_CONFIG.HORSE_CENTER_X
  const maxDeviation = 300 // Horses can spread ±300px from center

  if (horse.x < centerX - maxDeviation) {
    // Too far left - gently push back without forcing same target speed
    const pushBack = (centerX - maxDeviation - horse.x) * 0.5
    horse.x += pushBack
    // Encourage forward movement but keep randomness
    if (horse.targetSpeed < 10) {
      horse.targetSpeed = 10 + Math.random() * 30
    }
  } else if (horse.x > centerX + maxDeviation) {
    // Too far right - gently push back
    const pushBack = (horse.x - (centerX + maxDeviation)) * 0.5
    horse.x -= pushBack
    // Encourage backward/slower movement but keep randomness
    if (horse.targetSpeed > 20) {
      horse.targetSpeed = -5 + Math.random() * 25
    }
  }
}

export function calculateYPositions(numHorses, canvasHeight) {
  const center = canvasHeight / 2
  const groupHeight = 350 // Total height of horse group (wider spread)

  // More natural clustering - horses aren't in perfect rows
  return Array.from({ length: numHorses }, () => {
    // Random position within the group height
    const randomY = center + (Math.random() - 0.5) * groupHeight
    return randomY
  })
}

export function updateSpriteFrame(horse, deltaTime) {
  horse.frameTimer = (horse.frameTimer || 0) + deltaTime

  if (horse.frameTimer >= TREADMILL_CONFIG.GALLOP_FRAME_DURATION) {
    horse.spriteFrame =
      (horse.spriteFrame + 1) % TREADMILL_CONFIG.GALLOP_FRAME_COUNT
    horse.frameTimer = 0
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}
