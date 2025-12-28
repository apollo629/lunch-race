<script setup>
import { ref } from 'vue'
import { useAppState } from '../composables/useAppState'

const { addSpot } = useAppState()

const inputValue = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  if (!inputValue.value.trim()) {
    return
  }

  const result = addSpot(inputValue.value)

  if (result.success) {
    inputValue.value = ''
    errorMessage.value = ''
  } else {
    errorMessage.value = result.error
  }
}

const handleInput = () => {
  // Clear error when user starts typing
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}
</script>

<template>
  <div class="lunch-spot-input">
    <div class="input-group">
      <input
        v-model="inputValue"
        type="text"
        placeholder="Enter lunch spot name..."
        maxlength="30"
        :class="{ error: errorMessage }"
        @keyup.enter="handleSubmit"
        @input="handleInput"
      />
      <button @click="handleSubmit">Add</button>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.lunch-spot-input {
  width: 100%;
  max-width: 500px;
}

.input-group {
  display: flex;
  gap: var(--space-sm);
}

.input-group input {
  flex: 1;
}

.input-group button {
  flex-shrink: 0;
}
</style>
