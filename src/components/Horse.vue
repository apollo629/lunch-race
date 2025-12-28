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
    <div class="lane-label">
      <span class="label-text">{{ name }}</span>
    </div>
    <div class="lane-track">
      <div
        class="horse"
        :style="{
          backgroundColor: color,
          transform: transform,
        }"
      ></div>
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
}

.label-text {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.lane-track {
  flex: 1;
  height: 60px;
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
  border-radius: 8px;
  position: relative;
  overflow: visible;
  border: 2px solid var(--color-border);
}

.horse {
  position: absolute;
  left: 0;
  top: 50%;
  transform-origin: left center;
  margin-top: -25px;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  will-change: transform;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: box-shadow 100ms ease;
}

.horse::after {
  content: '';
  position: absolute;
  left: -15px;
  top: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(to right, transparent, currentColor);
  opacity: 0.15;
  border-radius: 4px 0 0 4px;
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

  .horse {
    width: 40px;
    height: 40px;
    margin-top: -20px;
  }
}
</style>
