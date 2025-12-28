import { RACE_CONFIG } from '../constants/raceConfig'

/**
 * Calculate velocity update with natural jitter
 *
 * @param {number} currentVelocity - Current velocity in units/second
 * @param {number} deltaTime - Time since last frame in milliseconds
 * @returns {number} New velocity
 */
export function calculateVelocityUpdate(currentVelocity, deltaTime) {
  const { MIN_SPEED, MAX_SPEED, JITTER_INTENSITY, MOMENTUM_FACTOR } = RACE_CONFIG

  // Random acceleration/deceleration
  // Use Gaussian-like randomness for more natural variation
  const jitter = (Math.random() - 0.5) * JITTER_INTENSITY

  // Apply momentum (velocity changes gradually, not instantly)
  const targetVelocity = currentVelocity + jitter
  const newVelocity =
    currentVelocity + (targetVelocity - currentVelocity) * MOMENTUM_FACTOR

  // Clamp to min/max bounds
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, newVelocity))
}

/**
 * Generate random initial velocity for each horse
 *
 * @returns {number} Initial velocity
 */
export function generateInitialVelocity() {
  const { BASE_SPEED, SPEED_VARIANCE } = RACE_CONFIG
  return BASE_SPEED + (Math.random() - 0.5) * SPEED_VARIANCE
}
