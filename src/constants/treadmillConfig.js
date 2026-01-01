export const TREADMILL_CONFIG = {
  // Timer settings
  DEFAULT_RACE_TIME: 30000, // 30 seconds in ms
  MIN_RACE_TIME: 10000, // 10 seconds
  MAX_RACE_TIME: 120000, // 2 minutes
  FINISH_LINE_SPAWN_TIME: 5000, // Spawn finish line at 5s remaining

  // Scrolling
  BASE_SCROLL_SPEED: 200, // pixels per second

  // Horse physics
  HORSE_CENTER_X: 400, // Target center position
  HORSE_MAX_DEVIATION: 150, // ±150px from center
  HORSE_VELOCITY_CHANGE: 30, // Acceleration magnitude
  HORSE_MAX_VELOCITY: 80, // Max speed in px/s
  HORSE_FRICTION: 0.95, // Velocity damping
  HORSE_SPRING_CONSTANT: 0.02, // Centering force

  // Sprite animation
  GALLOP_FRAME_COUNT: 8,
  GALLOP_FRAME_DURATION: 100, // ms per frame
  HORSE_SPRITE_SIZE: 64, // px

  // Finish line
  FINISH_LINE_WIDTH: 80,
  FINISH_LINE_SQUARE_SIZE: 40, // Checkered square size
}

export const BACKGROUND_LAYERS = [
  {
    id: 'sky',
    zIndex: 0,
    scrollSpeed: 0.2,
    imagePath: '/backgrounds/sky.png',
  },
  {
    id: 'stadium',
    zIndex: 1,
    scrollSpeed: 0.4,
    imagePath: '/backgrounds/stadium.png',
  },
  {
    id: 'bunting',
    zIndex: 2,
    scrollSpeed: 0.6,
    imagePath: '/backgrounds/bunting.png',
  },
  {
    id: 'fence',
    zIndex: 3,
    scrollSpeed: 0.8,
    imagePath: '/backgrounds/fence.png',
  },
  {
    id: 'grass',
    zIndex: 4,
    scrollSpeed: 1.0,
    imagePath: '/backgrounds/grass.png',
  },
]
