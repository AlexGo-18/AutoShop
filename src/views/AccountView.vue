<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  profile: { type: Object, required: true },
  rewards: { type: Object, required: true },
  invoices: { type: Array, required: true }
})
const emit = defineEmits(['update-profile'])
const saved = ref(false)
const profileDraft = reactive({ ...props.profile })
const activeImageIndex = ref(0)
const transitionDirection = ref('next')
const carImages = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=900&q=85'
]
let imageRotation
let pointerStart
const invoiceSortOrder = ref('newest')
const sortedInvoices = computed(() => [...props.invoices].sort((a, b) => {
  const dateDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  return invoiceSortOrder.value === 'newest' ? -dateDifference : dateDifference
}))

watch(() => props.profile, value => Object.assign(profileDraft, value), { deep: true })

function formatInvoiceDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function saveProfile() {
  saved.value = true
}

function updateProfileField(field, value) {
  profileDraft[field] = value
  emit('update-profile', { ...profileDraft })
}

function changeImage(direction) {
  transitionDirection.value = direction
  const offset = direction === 'next' ? 1 : -1
  activeImageIndex.value = (activeImageIndex.value + offset + carImages.length) % carImages.length
}

function startSwipe(event) {
  pointerStart = { x: event.clientX, y: event.clientY }
}

function finishSwipe(event) {
  if (!pointerStart) return

  const deltaX = event.clientX - pointerStart.x
  const deltaY = event.clientY - pointerStart.y
  pointerStart = null

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return
  changeImage(deltaX < 0 ? 'next' : 'prev')
}

onMounted(() => {
  imageRotation = window.setInterval(() => {
    changeImage('next')
  }, 3000)
})

onUnmounted(() => {
  window.clearInterval(imageRotation)
})
</script>

<template>
  <section class="account-page">
    <div class="page-intro">
      <p class="eyebrow">TU ESPACIO</p>
      <h1>Hola, conductor</h1>
      <p>Completa tus datos para tener tu perfil a mano.</p>
    </div>

    <div class="account-content">
      <form class="account-form" @submit.prevent="saveProfile">
        <h2>Mi perfil</h2>
        <label>
          Nombre completo
          <input :value="profileDraft.nombre" type="text" autocomplete="name" placeholder="Ej. Alex Gómez" required minlength="2" @input="updateProfileField('nombre', $event.target.value)">
        </label>
        <label>
          Correo electrónico
          <input :value="profileDraft.correo" type="email" autocomplete="email" placeholder="correo@ejemplo.com" required @input="updateProfileField('correo', $event.target.value)">
        </label>
        <label>
          Dirección
          <input :value="profileDraft.direccion" type="text" autocomplete="street-address" placeholder="Tu dirección" required minlength="5" @input="updateProfileField('direccion', $event.target.value)">
        </label>
        <button class="primary-button confirm-button" type="submit">Guardar perfil</button>
        <p v-if="saved" class="profile-saved" role="status">Tu perfil se guardó en este dispositivo.</p>
      </form>

      <div
        class="account-gallery"
        role="group"
        aria-label="Galería de autos"
        aria-roledescription="carrusel"
        @pointerdown="startSwipe"
        @pointerup="finishSwipe"
        @pointercancel="pointerStart = null"
      >
        <Transition :name="`account-image-${transitionDirection}`" mode="out-in">
          <img
            :key="activeImageIndex"
            :src="carImages[activeImageIndex]"
            alt="Auto destacado"
          >
        </Transition>
        <button
          class="account-gallery-control account-gallery-prev"
          type="button"
          aria-label="Ver auto anterior"
          @click="changeImage('prev')"
        >‹</button>
        <button
          class="account-gallery-control account-gallery-next"
          type="button"
          aria-label="Ver auto siguiente"
          @click="changeImage('next')"
        >›</button>
      </div>
    </div>

    <section class="my-coupons" aria-labelledby="my-coupons-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">TUS RECOMPENSAS</p>
          <h2 id="my-coupons-title">Mis cupones</h2>
        </div>
        <span class="product-counter">{{ props.rewards.coupons.length }} disponibles</span>
      </div>
      <div v-if="props.rewards.coupons.length" class="coupon-list">
        <article v-for="userCoupon in props.rewards.coupons" :key="userCoupon.code" class="account-coupon">
          <div>
            <h3>{{ userCoupon.label }}</h3>
            <p>Válido para una compra.</p>
          </div>
          <div class="account-coupon-code">
            <strong>{{ userCoupon.code }}</strong>
            <span>{{ userCoupon.discount }}% de descuento</span>
          </div>
        </article>
      </div>
      <div v-else class="no-results">
        <h3>Aún no tienes cupones</h3>
        <p>Completa tu perfil o compra autos para ganar descuentos.</p>
      </div>
    </section>

    <section class="my-invoices" aria-labelledby="my-invoices-title">
      <div class="section-heading invoice-heading">
        <div>
          <p class="eyebrow">HISTORIAL DE COMPRAS</p>
          <h2 id="my-invoices-title">Mis facturas</h2>
        </div>
        <label class="invoice-sort">
          Ordenar:
          <select v-model="invoiceSortOrder" aria-label="Ordenar facturas">
            <option value="newest">Más reciente a más antigua</option>
            <option value="oldest">Más antigua a más reciente</option>
          </select>
        </label>
      </div>

      <div v-if="sortedInvoices.length" class="invoice-list">
        <details v-for="invoice in sortedInvoices" :key="invoice.number" class="invoice-card">
          <summary class="invoice-summary">
            <span>
              <strong>{{ invoice.number }}</strong>
              <small>{{ formatInvoiceDate(invoice.createdAt) }}</small>
            </span>
            <span class="invoice-summary-total">{{ money(invoice.total) }}</span>
          </summary>
          <div class="invoice-content">
            <p class="invoice-customer">
              <strong>Cliente:</strong> {{ invoice.customer.nombre }} · {{ invoice.customer.correo }} · {{ invoice.customer.direccion }}
            </p>
            <div class="invoice-table-wrap">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th scope="col">Descripción</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Valor unitario (COP)</th>
                    <th scope="col">Descuento</th>
                    <th scope="col">Valor con descuento (COP)</th>
                    <th scope="col">Subtotal (COP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in invoice.items" :key="item.id">
                    <th scope="row">{{ item.name }}</th>
                    <td>{{ item.quantity }}</td>
                    <td>{{ money(item.originalUnitPrice) }}</td>
                    <td>{{ money(item.unitDiscount ?? (item.originalUnitPrice - item.unitPrice)) }} ({{ item.discountRate ?? 0 }}%)</td>
                    <td>{{ money(item.unitPriceAfterDiscount ?? item.unitPrice) }}</td>
                    <td>{{ money(item.lineTotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <dl class="invoice-totals">
              <div><dt>Subtotal</dt><dd>{{ money(invoice.subtotal) }}</dd></div>
              <div>
                <dt>Total de descuentos<span v-if="invoice.couponCode"> (incluye {{ invoice.couponCode }})</span></dt>
                <dd>-{{ money(invoice.totalDiscounts ?? (invoice.productDiscount + invoice.couponDiscount)) }}</dd>
              </div>
              <div><dt>Base gravable</dt><dd>{{ money(invoice.taxableBase) }}</dd></div>
              <div><dt>IVA ({{ invoice.taxRate }}%)</dt><dd>{{ money(invoice.tax) }}</dd></div>
              <div class="invoice-final-total"><dt>Total a pagar</dt><dd>{{ money(invoice.total) }}</dd></div>
            </dl>
          </div>
        </details>
      </div>
      <div v-else class="no-results">
        <h3>Aún no tienes facturas</h3>
        <p>Las facturas de tus compras aparecerán aquí.</p>
      </div>
    </section>
  </section>
</template>
