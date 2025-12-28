# Lunch Race

A fun, interactive web application that helps groups decide where to eat lunch through an exciting racing simulation!

## Overview

Lunch Race is a single-page Vue 3 application where lunch spots compete as colored blocks racing across the screen. The first to cross the finish line determines where the group goes for lunch. Each race features randomized, natural-looking movement with horses that can overtake each other, making every race unpredictable and exciting.

## Features

- **Simple Setup**: Add 2-10 lunch spots with an intuitive interface
- **Realistic Racing Physics**: Horses move with natural jitter and varying speeds
- **Beautiful Animations**: Smooth, GPU-accelerated animations using requestAnimationFrame
- **Three-State Flow**: Setup → Race → Results with seamless transitions
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **No Backend Required**: Pure client-side application with no database
- **Easy Deployment**: Static site ready for Netlify, Vercel, or any hosting platform

## Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Fast build tool and dev server
- **Vanilla CSS** - Custom properties and modern CSS features
- **No external dependencies** - Lightweight and fast

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone or navigate to the project directory
cd lunch-race

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The production files will be in the `dist/` folder.

## How to Use

### 1. Setup Phase

1. Enter lunch spot names in the input field (e.g., "Pizza Palace", "Burger King", "Sushi Express")
2. Click "Add" or press Enter to add each spot
3. Add at least 2 spots to start the race (maximum 10)
4. Remove any spots you don't want by clicking the "Remove" button
5. Click "Start Race!" when ready

**Validation Rules:**
- Minimum 2 spots required
- Maximum 10 spots allowed
- No duplicate names (case-insensitive)
- Maximum 30 characters per name
- Empty names are rejected

### 2. Race Phase

- The race starts automatically with a 500ms countdown
- Watch as colored blocks race horizontally across the screen
- Horses move at varying speeds and can overtake each other
- The first horse to cross the checkered finish line wins!
- Race duration: typically 6-16 seconds for an exciting, competitive race
- Guaranteed finish: Even slowest horse reaches finish line in under 20 seconds
- Safety timeout at 30 seconds as final backup

### 3. Results Phase

- Winner is announced with celebration animation
- View final standings showing all participants
- Top 3 positions highlighted with gold, silver, and bronze
- **"Race Again"** - Keep same lunch spots, run another race
- **"New Race"** - Clear all spots and start fresh

## Project Structure

```
lunch-race/
├── src/
│   ├── components/          # Vue components
│   │   ├── SetupView.vue    # Add/remove lunch spots
│   │   ├── RaceView.vue     # Race container
│   │   ├── RaceTrack.vue    # Animation orchestration
│   │   ├── Horse.vue        # Individual racer
│   │   ├── ResultView.vue   # Winner display
│   │   └── LunchSpotInput.vue # Input form
│   ├── composables/         # Reusable logic
│   │   ├── useAppState.js   # State management
│   │   ├── useRaceEngine.js # Race animation loop
│   │   └── useLunchSpots.js # Lunch spots CRUD
│   ├── utils/
│   │   └── raceAlgorithm.js # Velocity calculations
│   ├── constants/
│   │   └── raceConfig.js    # Tunable parameters
│   ├── assets/styles/       # CSS files
│   │   ├── variables.css    # Design tokens
│   │   ├── main.css         # Global styles
│   │   └── animations.css   # Keyframes
│   ├── App.vue              # Root component
│   └── main.js              # Entry point
├── public/                  # Static assets
├── dist/                    # Production build output
├── index.html
├── vite.config.js
└── package.json
```

## Customization

### Race Parameters

Edit `/src/constants/raceConfig.js` to adjust race behavior:

```javascript
export const RACE_CONFIG = {
  BASE_SPEED: 11,           // Base speed (reaches finish in ~8.6 seconds)
  MIN_SPEED: 6,             // Minimum speed (reaches finish in ~15.8 seconds)
  MAX_SPEED: 16,            // Maximum speed (reaches finish in ~5.9 seconds)
  JITTER_INTENSITY: 2.5,    // Random variation
  MOMENTUM_FACTOR: 0.08,    // Smoothness (0-1)
  MAX_RACE_DURATION: 30000  // Timeout in milliseconds (30 seconds)
}
```

**Presets:**

**Slow & Dramatic (12-20 seconds)**
```javascript
BASE_SPEED: 7
MIN_SPEED: 5
MAX_SPEED: 10
JITTER_INTENSITY: 1.8
MOMENTUM_FACTOR: 0.06
```

**Fast & Thrilling (3-7 seconds)**
```javascript
BASE_SPEED: 18
MIN_SPEED: 14
MAX_SPEED: 25
JITTER_INTENSITY: 4
MOMENTUM_FACTOR: 0.12
```

### Horse Colors

Modify the color palette in `/src/constants/raceConfig.js`:

```javascript
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
```

### Design Tokens

Customize colors and spacing in `/src/assets/styles/variables.css`:

```css
:root {
  --color-primary: #4F46E5;
  --color-bg: #F9FAFB;
  --space-md: 1rem;
  --lane-height: 80px;
  /* ... more variables */
}
```

## Deployment

### Netlify (Recommended)

**Option 1: Drag & Drop**
1. Run `npm run build`
2. Drag the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

**Option 2: GitHub Integration**
1. Push code to GitHub
2. Connect repository in Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Vercel auto-detects Vite configuration
4. Deploy with one click

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Update vite.config.js
export default defineConfig({
  base: '/lunch-race/', // Your repo name
})

# Add deploy script to package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Other Static Hosts

Upload the `dist/` folder to:
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh
- Render
- Any static file hosting service

## Architecture Deep Dive

### Race Animation Algorithm

The race uses a physics-based animation system:

1. **requestAnimationFrame Loop** - Smooth 60fps animation
2. **Delta Time Calculation** - Consistent speed across devices
3. **Velocity with Jitter** - Random acceleration/deceleration each frame
4. **Momentum Factor** - Gradual velocity changes (no instant jumps)
5. **Speed Bounds** - MIN/MAX limits prevent unrealistic speeds

```javascript
// Simplified algorithm
velocities[id] = calculateVelocityUpdate(currentVelocity, deltaTime)
positions[id] += velocities[id] * (deltaTime / 1000)
```

### State Management

Uses Vue 3 Composition API with reactive composables:

- **useAppState** - Central state hub for app transitions
- **useLunchSpots** - Manages lunch spots with validation
- **useRaceEngine** - Controls animation loop and winner detection

No Pinia or Vuex needed - keeps the bundle size small!

### Performance Optimizations

- **GPU Acceleration** - Uses `transform: translateX()` instead of `left`
- **will-change** hints - Optimizes browser rendering
- **No CSS Transitions** - JS controls all movement via requestAnimationFrame
- **Cleanup** - Properly cancels animation frames on unmount

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Modern mobile browsers

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT License - Feel free to use this project however you'd like.

## Tips & Tricks

### For Best Results

- Use short, memorable names for lunch spots
- Add 3-5 spots for optimal visual experience
- Run multiple races if the result is contested!
- Adjust race parameters to match your group's preference

### Troubleshooting

**Race finishes too quickly?**
- Decrease `BASE_SPEED` in raceConfig.js

**Race takes too long?**
- Increase `BASE_SPEED` in raceConfig.js

**Movement looks jerky?**
- Decrease `MOMENTUM_FACTOR` for smoother transitions
- Decrease `JITTER_INTENSITY` for less chaos

**Duplicate spot error?**
- Check for case-insensitive duplicates (e.g., "Pizza" and "pizza")

## Acknowledgments

Built with Vue 3, Vite, and vanilla CSS. No external libraries for animations - just pure JavaScript and CSS!

---

**Ready to race?** Run `npm run dev` and let the lunch spots compete! 🏁
