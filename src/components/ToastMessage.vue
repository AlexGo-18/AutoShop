<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' },
  type: { type: String, default: 'success' }
})

const emit = defineEmits(['close-toast'])
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-message" :class="`toast-${type}`" role="status">
      <span class="toast-check">{{ type === 'success' ? '✓' : '!' }}</span>
      <p>{{ message }}</p>
      <button aria-label="Cerrar aviso" @click="emit('close-toast')">×</button>
    </div>
  </Transition>
</template>
