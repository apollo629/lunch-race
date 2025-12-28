export const RACE_CONFIG = {
  // Speed configuration (percentage points per second)
  // These values represent how many percentage points the horse moves per second
  // Formula: time to finish = FINISH_LINE_POSITION / speed
  BASE_SPEED: 11, // Base speed (reaches 95% in ~8.6 seconds)
  MIN_SPEED: 6, // Minimum speed (reaches 95% in ~15.8 seconds)
  MAX_SPEED: 16, // Maximum speed (reaches 95% in ~5.9 seconds)
  SPEED_VARIANCE: 3, // Initial speed randomization range

  // Jitter configuration
  JITTER_INTENSITY: 2.5, // How much random variation per frame
  MOMENTUM_FACTOR: 0.08, // How quickly velocity changes (0-1, lower = smoother)

  // Visual configuration
  TRACK_LENGTH: 100, // Track length in percentage (100%)
  FINISH_LINE_POSITION: 95, // Where finish line is positioned (% of track)

  // Timing
  MIN_RACE_DURATION: 4000, // Minimum race time in ms (prevents too-fast races)
  MAX_RACE_DURATION: 30000, // Maximum race time in ms (prevents stalled races)
}

export const HORSE_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#14B8A6', // Teal
]

export const VALIDATION_RULES = {
  MIN_SPOTS: 2,
  MAX_SPOTS: 10,
  MAX_NAME_LENGTH: 30,
}
