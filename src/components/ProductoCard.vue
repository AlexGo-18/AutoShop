<script setup>
import { computed } from 'vue'
import { discountedValue } from '../utils/pricing.js'
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['add-to-cart', 'view-product'])

function openProduct() {
  emit('view-product', props.product)
}

function handleKeydown(event) {
  if (event.target.closest('button')) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openProduct()
  }
}

const finalPrice = computed(() =>
  discountedValue(props.product.price, props.product.discount)
)

</script>

<template>
  <article
    class="product-card"
    role="link"
    tabindex="0"
    :aria-label="`Ver detalles de ${product.name}`"
    @click="openProduct"
    @keydown="handleKeydown"
  >
    <div class="product-image-wrap">
      <span v-if="product.discount" class="discount-badge">-{{ product.discount }}%</span>
      <img :src="product.image" :alt="product.name" class="product-image" loading="lazy">
      <span class="category-pill">{{ product.category }}</span>
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <div class="price-area">
        <span v-if="product.discount" class="old-price">{{ money(product.price) }}</span>
        <span class="current-price">{{ money(finalPrice) }}</span>
      </div>

      <button class="primary-button buy-button" @click.stop="emit('add-to-cart', product)">
        <svg class="button-cart-icon" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 5h4l3.1 15.1a2 2 0 0 0 2 1.6h12.8a2 2 0 0 0 1.9-1.4L30 10H9" />
          <circle cx="13" cy="27" r="1.7" />
          <circle cx="24" cy="27" r="1.7" />
        </svg>
        Comprar
      </button>
    </div>
  </article>
</template>
