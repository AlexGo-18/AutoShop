<script setup>
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, required: true },
  total: { type: Number, default: 0 },
  originalTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  selectedCount: { type: Number, default: 0 }
})

const emit = defineEmits([
  'close-cart', 'change-quantity', 'remove-item', 'selection-change', 'checkout-request'
])

</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay cart-overlay" @click.self="emit('close-cart')">
      <aside class="cart-panel" role="dialog" aria-modal="true" aria-label="Tu carrito">
        <div class="panel-heading">
          <div class="panel-title">
            <svg class="panel-cart-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M3 5h4l3.1 15.1a2 2 0 0 0 2 1.6h12.8a2 2 0 0 0 1.9-1.4L30 10H9" />
              <circle cx="13" cy="27" r="1.7" />
              <circle cx="24" cy="27" r="1.7" />
            </svg>
            <div>
              <h2>Tu carrito</h2>
              <p>{{ selectedCount }} artículo(s) seleccionado(s)</p>
            </div>
          </div>
          <button class="icon-button" aria-label="Cerrar carrito" @click="emit('close-cart')">×</button>
        </div>

        <div v-if="items.length" class="cart-items">
          <article v-for="item in items" :key="item.id" class="cart-item">
            <input
              class="item-check"
              type="checkbox"
              :checked="item.seleccionado"
              :aria-label="`Seleccionar ${item.name}`"
              @change="emit('selection-change', { id: item.id, selected: $event.target.checked })"
            >
            <img :src="item.image" :alt="item.name" class="cart-item-image">
            <div class="cart-item-details">
              <h3>{{ item.name }}</h3>
              <p v-if="item.discount" class="cart-original-price">{{ money(item.price) }}</p>
              <p class="cart-discounted-price">{{ money(item.unitPrice) }} por unidad</p>
              <span class="line-total">Subtotal: {{ money(item.unitPrice * item.cantidad) }}</span>
              <div class="quantity-control">
                <button aria-label="Disminuir cantidad" @click="emit('change-quantity', item.id, -1)">−</button>
                <span>{{ item.cantidad }}</span>
                <button aria-label="Aumentar cantidad" @click="emit('change-quantity', item.id, 1)">+</button>
              </div>
            </div>
            <button class="remove-button" aria-label="Eliminar producto" @click="emit('remove-item', item.id)">⌫</button>
          </article>
        </div>

        <div v-else class="empty-cart">
          <h3>Tu carrito está vacío</h3>
          <p>Cuando agregues un auto, aparecerá aquí.</p>
          <button class="secondary-button" @click="emit('close-cart')">Seguir explorando</button>
        </div>

        <div v-if="items.length" class="cart-summary">
          <div class="summary-row">
            <span>Productos seleccionados</span>
            <strong>{{ selectedCount }}</strong>
          </div>
          <div class="summary-row">
            <span>Precio sin descuento</span>
            <strong>{{ money(originalTotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>Descuentos</span>
            <strong>-{{ money(discountTotal) }}</strong>
          </div>
          <div class="summary-row total-row">
            <span>Total con descuento</span>
            <strong>{{ money(total) }}</strong>
          </div>
          <button class="primary-button checkout-button" :disabled="selectedCount === 0" @click="emit('checkout-request')">
            Comprar seleccionados ({{ selectedCount }})
          </button>
          <p class="cart-note">Puedes seleccionar uno o varios productos para finalizar tu compra.</p>
        </div>
      </aside>
    </div>
  </Transition>
</template>
