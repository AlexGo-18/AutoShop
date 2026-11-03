<script setup>
defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['open-cart'])
</script>

<template>
  <button class="cart-trigger" aria-label="Abrir carrito" @click="emit('open-cart')">
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 5h4l3.1 15.1a2 2 0 0 0 2 1.6h12.8a2 2 0 0 0 1.9-1.4L30 10H9" />
      <circle cx="13" cy="27" r="1.7" />
      <circle cx="24" cy="27" r="1.7" />
    </svg>
    <span class="cart-count">{{ count }}</span>
  </button>
</template>
