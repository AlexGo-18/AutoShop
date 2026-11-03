<script setup>
import ProductoCard from './ProductoCard.vue'

defineProps({
  products: { type: Array, required: true }
})

const emit = defineEmits(['add-to-cart', 'view-product'])
</script>

<template>
  <div class="product-grid">
    <ProductoCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="emit('add-to-cart', $event)"
      @view-product="emit('view-product', $event)"
    />
  </div>
</template>
