# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lunch Race is a Vue 3 single-page application that gamifies lunch decisions through racing simulations. It features two distinct race modes: a simple horizontal block race and a treadmill-style countdown race with sprite animations and parallax backgrounds.

## Development Commands

```bash
# Start development server (http://localhost:5173/)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management Pattern

The app uses Vue 3 Composition API with **singleton composables** for global state:

- **useAppState.js**: Central state hub managing app flow (setup → race → result)
  - Exports reactive refs defined at module level (not inside function)
  - Single source of truth accessed by multiple components
  - Coordinates state transitions: `startRace()`, `finishRace()`, `resetRace()`, `newRace()`

- **useLunchSpots.js**: Manages lunch spots with validation
  - Singleton pattern for shared spots array
  - Enforces rules from `VALIDATION_RULES` in raceConfig.js

### Race Implementation

The race is a **treadmill-style countdown race** with canvas-based rendering:

- Full-screen canvas-based racing with sprite animations
- Located in: `TreadmillRaceCanvas.vue`
- Uses `useCountdownRaceEngine.js` for countdown timer and race logic
- Canvas rendering in `canvasRenderer.js` with parallax scrolling backgrounds
- Physics simulation in `treadmillPhysics.js`

### Canvas Rendering System

The race uses a layered rendering architecture:

1. **Background Layers**: Parallax scrolling with 5 layers (sky, stadium, bunting, fence, grass)
   - Each layer has different scroll speeds for depth effect
   - Configured in `BACKGROUND_LAYERS` array in `treadmillConfig.js`
   - Rendered first to back

2. **Sprite System**: 8-frame gallop animation
   - Sprites loaded via `spriteLoader.js` with fallback rendering
   - Frame timing controlled by `GALLOP_FRAME_DURATION`
   - Individual sprite frames from spritesheet in `/public/sprites/`

3. **Animation Loop**: `requestAnimationFrame` with delta time
   - Maintains 60fps across devices
   - Delta time ensures consistent physics regardless of frame rate
   - Pattern: `loop(timestamp) → updateRace(timestamp, deltaTime) → render()`

4. **Physics Updates**: Each horse has unique characteristics
   - Random `minSpeed`/`maxSpeed` initialized once
   - `targetSpeed` changes randomly (~3% chance per frame)
   - Smoothly interpolates `currentSpeed` toward `targetSpeed`
   - Random jitter added each frame for natural movement
   - Soft boundaries prevent horses from going off-screen

### Component Structure

```
App.vue (root)
  └─ Conditionally renders based on currentState:
     ├─ SetupView.vue (state: 'setup')
     │   └─ LunchSpotInput.vue
     ├─ RaceView.vue (state: 'race')
     │   └─ TreadmillRaceCanvas.vue
     └─ ResultView.vue (state: 'result')
```

### Configuration Constants

All tunable parameters are centralized in `/src/constants/`:

- **raceConfig.js**: Shared config (horse colors, validation rules)
- **treadmillConfig.js**: Countdown race specific (timer, physics, sprite settings)

When modifying race behavior:
- Timer duration: `DEFAULT_RACE_TIME` in treadmillConfig.js
- Horse physics: Modify values in `TREADMILL_CONFIG` object
- Background layers: Edit `BACKGROUND_LAYERS` array
- Number of sprite frames: `GALLOP_FRAME_COUNT`

### Asset Loading

The treadmill race loads visual assets asynchronously:
- Background images from `/public/backgrounds/`
- Sprite sheets from `/public/sprites/`
- Shows loading screen while assets load
- Falls back to colored rectangles if sprites fail to load
- Asset loading managed in `spriteLoader.js`

## Key Implementation Details

### Race Completion Logic

The race determines winner by:
1. Countdown timer reaches 0
2. Sort horses by X position (furthest right wins)
3. Call `onRaceComplete(winner, standings)` which triggers `finishRace()` in useAppState

### Physics Simulation

Each horse maintains:
- `x, y`: Current position
- `velocity`: Current frame velocity (px/s)
- `targetSpeed`: Desired speed (changes randomly)
- `currentSpeed`: Actual speed (interpolates toward target)
- `minSpeed, maxSpeed`: Horse-specific speed range
- `speedChangeRate`: Acceleration characteristic
- `randomness`: Jitter amount

Position update formula (treadmillPhysics.js:33):
```javascript
horse.velocity = horse.currentSpeed + jitter
horse.x += horse.velocity * deltaTime
```

### Scroll Offset and Finish Line

- Background scrolls at `BASE_SCROLL_SPEED` (200 px/s)
- Finish line spawns at 5 seconds remaining (`FINISH_LINE_SPAWN_TIME`)
- Finish line moves left at same speed as background scroll
- Creates illusion of horses running on treadmill toward finish

## Testing the Application

No automated tests currently. Manual testing:
1. Add 2-10 lunch spots with various names
2. Verify validation (duplicates rejected, max 30 chars)
3. Start race and observe natural movement
4. Confirm timer counts down from 30 seconds
5. Verify finish line appears at 5s remaining
6. Check winner determination and standings display
7. Test "Race Again" (keeps spots) vs "New Race" (clears all)
8. Test on mobile/tablet for responsive behavior

## Common Modifications

### Adjusting Race Duration
Edit `DEFAULT_RACE_TIME` in src/constants/treadmillConfig.js (in milliseconds)

### Changing When Finish Line Spawns
Edit `FINISH_LINE_SPAWN_TIME` in src/constants/treadmillConfig.js

### Modifying Horse Speed/Behavior
Edit physics constants in `TREADMILL_CONFIG` or modify the update logic in src/utils/treadmillPhysics.js:updateHorsePosition()

### Adding/Removing Background Layers
Edit `BACKGROUND_LAYERS` array in src/constants/treadmillConfig.js and add corresponding images to /public/backgrounds/

### Changing Sprite Animation Speed
Edit `GALLOP_FRAME_DURATION` in src/constants/treadmillConfig.js (lower = faster)
