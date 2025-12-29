<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  raceAreaWidth: {
    type: Number,
    required: true,
  },
  lane: {
    type: Number,
    required: true,
  },
})

const transform = computed(() => {
  // Convert position percentage (0-100) to pixels
  const pixelPosition = (props.position / 100) * props.raceAreaWidth
  return `translateX(${pixelPosition}px)`
})
</script>

<template>
  <div class="lane-container">
    <div class="lane-label" :data-gate="lane + 1">
      <span class="label-text">{{ name }}</span>
    </div>
    <div class="lane-track">
      <div class="horse-container" :style="{ transform: transform }">
        <div class="jockey-silks" :style="{ backgroundColor: color }"></div>
        <div class="horse-emoji">🏇</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lane-container {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  height: var(--lane-height);
  padding: var(--space-sm) 0;
}

.lane-label {
  width: 150px;
  flex-shrink: 0;
  background: rgba(26, 71, 42, 0.8);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 6px 0 0 6px;
  border: 2px solid #d4af37;
  border-right: none;
  position: relative;
}

.lane-label::before {
  content: attr(data-gate);
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #d4af37;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid #1a472a;
}

.label-text {
  font-weight: 700;
  color: #f0e6d2;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lane-track {
  flex: 1;
  height: 60px;
  background: repeating-linear-gradient(
      90deg,
      #a67c52,
      #a67c52 10px,
      #8b6239 10px,
      #8b6239 20px
    ),
    linear-gradient(to bottom, #8b6239, #a67c52);
  border-radius: 4px;
  position: relative;
  overflow: visible;
  border: 2px solid #6b4423;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lane-track::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.horse-container {
  position: absolute;
  left: 0;
  top: 50%;
  transform-origin: left center;
  margin-top: -25px;
  width: 50px;
  height: 50px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jockey-silks {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  opacity: 0.85;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.horse-emoji {
  position: relative;
  font-size: 32px;
  z-index: 2;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3));
  animation: gallop 0.3s steps(4) infinite;
}

.horse-container::after {
  content: '';
  position: absolute;
  left: -15px;
  top: 50%;
  width: 20px;
  height: 30px;
  background: radial-gradient(
    ellipse at center,
    rgba(139, 92, 46, 0.4) 0%,
    rgba(139, 92, 46, 0.2) 50%,
    transparent 100%
  );
  transform: translateY(-50%);
  animation: dust-cloud 0.4s ease-out infinite;
  z-index: 0;
}

@media (max-width: 768px) {
  .lane-label {
    width: 100px;
  }

  .label-text {
    font-size: 0.75rem;
  }

  .lane-track {
    height: 50px;
  }

  .horse-container {
    width: 40px;
    height: 40px;
    margin-top: -20px;
  }

  .horse-emoji {
    font-size: 26px;
  }
}

/* Phones - compact layout */
@media (max-width: 480px) {
  .lane-container {
    height: 50px;
    gap: var(--space-sm);
  }

  .lane-label {
    width: 70px;
  }

  .label-text {
    font-size: 0.7rem;
    line-height: 1.2;
  }

  .lane-track {
    height: 40px;
  }

  .horse-container {
    width: 28px;
    height: 28px;
    margin-top: -14px;
  }

  .jockey-silks {
    border-radius: 6px;
  }

  .horse-emoji {
    font-size: 18px;
  }

  .horse-container::after {
    left: -10px;
    width: 10px;
  }
}

/* Extra small phones - minimal layout */
@media (max-width: 374px) {
  .lane-container {
    height: 45px;
  }

  .lane-label {
    width: 60px;
  }

  .lane-track {
    height: 35px;
  }

  .horse-container {
    width: 24px;
    height: 24px;
    margin-top: -12px;
  }

  .jockey-silks {
    border-radius: 4px;
  }

  .horse-emoji {
    font-size: 16px;
  }

  .horse-container::after {
    left: -8px;
    width: 8px;
  }
}
</style>
