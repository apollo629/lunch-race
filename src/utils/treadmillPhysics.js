import { TREADMILL_CONFIG } from '../constants/treadmillConfig'

export function updateHorsePosition(horse, deltaTime, allHorses) {
  const dt = deltaTime / 1000 // Convert to seconds

  // Initialize horse with racing characteristics
  if (!horse.targetSpeed) {
    // Wide speed range for dramatic racing
    horse.minSpeed = 20   // Can slow down to 20 px/s
    horse.maxSpeed = 120  // Can speed up to 120 px/s
    horse.targetSpeed = 60 + Math.random() * 30  // Initial target: 60-90 px/s
    horse.currentSpeed = horse.targetSpeed
    horse.distanceTraveled = 0

    // Acceleration characteristics (unique per horse)
    horse.acceleration = 15 + Math.random() * 25  // How fast they speed up/slow down
  }

  // Randomly change target speed frequently for exciting racing
  // Higher chance = more speed changes = more overtaking
  if (Math.random() < 0.05) {  // 5% chance per frame (~3x per second at 60fps)
    // Dramatic speed changes - can go from very slow to very fast!
    horse.targetSpeed = horse.minSpeed + Math.random() * (horse.maxSpeed - horse.minSpeed)
  }

  // Smooth acceleration/deceleration toward target speed
  // This creates natural momentum - horses don't instantly change speed
  const speedDiff = horse.targetSpeed - horse.currentSpeed
  horse.currentSpeed += speedDiff * (horse.acceleration * dt)

  // Clamp to min/max to prevent extreme values
  horse.currentSpeed = Math.max(horse.minSpeed, Math.min(horse.maxSpeed, horse.currentSpeed))

  // Add small random jitter for natural movement
  const jitter = (Math.random() - 0.5) * 10
  const actualSpeed = horse.currentSpeed + jitter

  // Update distance traveled (this determines the winner!)
  horse.distanceTraveled += actualSpeed * dt

  // Visual X position: All horses start at same position and spread out over time
  const startX = 250  // All horses start here (left side of screen)
  const scale = 0.35   // Scale factor: distance traveled -> screen movement

  // Map distance directly to screen position
  horse.x = startX + (horse.distanceTraveled * scale)

  // Soft boundary to prevent going off-screen
  if (horse.x > 1400) {
    horse.x = 1400  // Right edge
  }
  if (horse.x < 100) {
    horse.x = 100  // Left edge (in case someone goes backward)
  }

  // Store velocity for display/debug
  horse.velocity = actualSpeed
}

export function calculateYPositions(numHorses, canvasHeight) {
  const padding = 80 // Top/bottom padding
  const availableHeight = canvasHeight - padding * 2
  const laneHeight = availableHeight / numHorses

  // Evenly distribute horses in lanes
  return Array.from({ length: numHorses }, (_, i) => {
    // Center each horse in its lane
    return padding + laneHeight * i + laneHeight / 2
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
