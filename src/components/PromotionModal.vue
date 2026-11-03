<script setup>
import { computed } from 'vue'
import { discountedValue } from '../utils/pricing.js'
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  product: { type: Object, required: true }
})
const emit = defineEmits(['close-promotion', 'add-to-cart', 'view-product'])
const finalPrice = computed(() => discountedValue(props.product.price, props.product.discount))

function addToCart() {
  emit('add-to-cart', props.product)
  emit('close-promotion')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay promotion-overlay" @click.self="emit('close-promotion')">
      <section class="promotion-modal" role="dialog" aria-modal="true" aria-labelledby="promotion-title">
        <button class="icon-button promotion-close" aria-label="Cerrar promoción" @click="emit('close-promotion')">×</button>
        <img :src="product.image" :alt="product.name" class="promotion-image">
        <div class="promotion-content">
          <p class="eyebrow">
            {{ product.discount ? `OFERTA ESPECIAL · ${product.discount}% DE DESCUENTO` : 'AUTO DESTACADO' }}
          </p>
          <h2 id="promotion-title">Un viaje especial te espera</h2>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <span v-if="product.discount" class="old-price">{{ money(product.price) }}</span>
          <strong class="promotion-price">{{ money(finalPrice) }}</strong>
          <div class="promotion-actions">
            <button class="primary-button" @click="addToCart">Agregar al carrito</button>
            <button class="secondary-button" @click="emit('view-product', product); emit('close-promotion')">Ver detalles</button>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>
