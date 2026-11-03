<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { discountedValue } from '../utils/pricing.js'
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  originalTotal: { type: Number, default: 0 },
  profile: { type: Object, required: true },
  rewards: { type: Object, required: true }
})

const emit = defineEmits(['close-checkout', 'confirm-purchase', 'update-profile'])
const attempted = ref(false)
const profileDraft = reactive({ ...props.profile })
const couponInput = ref('')
const appliedCouponCode = ref('')
const couponMessage = ref('')

const isValid = computed(() =>
  profileDraft.nombre.trim().length > 1 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileDraft.correo) &&
  profileDraft.direccion.trim().length > 4
)
const appliedCoupon = computed(() =>
  props.rewards.coupons.find(item => item.code === appliedCouponCode.value)
)
const productDiscount = computed(() => props.originalTotal - props.total)
const discountedTotal = computed(() =>
  appliedCoupon.value
    ? Math.round(discountedValue(props.total, appliedCoupon.value.discount))
    : props.total
)
const discountAmount = computed(() => props.total - discountedTotal.value)
const taxableBase = computed(() => discountedTotal.value)
const taxAmount = computed(() => Math.round(taxableBase.value * 0.19))
const totalAfterDiscount = computed(() => taxableBase.value + taxAmount.value)

watch(() => props.open, value => {
  if (value) {
    attempted.value = false
    Object.assign(profileDraft, props.profile)
    couponInput.value = ''
    appliedCouponCode.value = ''
    couponMessage.value = ''
  }
})

function updateProfileField(field, value) {
  profileDraft[field] = value
  emit('update-profile', { ...profileDraft })
}

function applyCoupon() {
  const requestedCode = couponInput.value.trim().toUpperCase()
  const availableCoupon = props.rewards.coupons.find(item => item.code === requestedCode)
  if (!availableCoupon) {
    appliedCouponCode.value = ''
    couponMessage.value = 'El cupón no es válido o ya fue utilizado.'
    return
  }

  appliedCouponCode.value = availableCoupon.code
  couponMessage.value = `¡Cupón aplicado! Tienes ${availableCoupon.discount}% de descuento.`
}

function submit() {
  attempted.value = true
  if (!isValid.value) return
  emit('confirm-purchase', {
    ...profileDraft,
    couponCode: appliedCoupon.value?.code || '',
    couponDiscount: discountAmount.value
  })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay checkout-overlay" @click.self="emit('close-checkout')">
      <section class="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div class="modal-heading">
          <div>
            <svg class="modal-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <h2 id="checkout-title">Finalizar compra</h2>
          </div>
          <button class="icon-button" aria-label="Cerrar ventana" @click="emit('close-checkout')">×</button>
        </div>
        <p class="modal-description">Completa tus datos para realizar la compra.</p>

        <form @submit.prevent="submit" novalidate>
          <label>
            Nombre completo
            <input :value="profileDraft.nombre" type="text" placeholder="Ej. Alex Gómez" autocomplete="name" @input="updateProfileField('nombre', $event.target.value)">
            <small v-if="attempted && profileDraft.nombre.trim().length <= 1" class="field-error">Escribe tu nombre.</small>
          </label>
          <label>
            Correo electrónico
            <input :value="profileDraft.correo" type="email" placeholder="correo@ejemplo.com" autocomplete="email" @input="updateProfileField('correo', $event.target.value)">
            <small v-if="attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileDraft.correo)" class="field-error">Escribe un correo válido.</small>
          </label>
          <label>
            Dirección de envío
            <input :value="profileDraft.direccion" type="text" placeholder="Dirección de ejemplo" autocomplete="street-address" @input="updateProfileField('direccion', $event.target.value)">
            <small v-if="attempted && profileDraft.direccion.trim().length <= 4" class="field-error">Escribe una dirección.</small>
          </label>

          <div class="checkout-coupon">
            <label for="checkout-coupon-code">Cupón de descuento</label>
            <div class="checkout-coupon-entry">
              <input
                id="checkout-coupon-code"
                v-model="couponInput"
                type="text"
                placeholder="Ingresa tu cupón"
                autocomplete="off"
              >
              <button class="secondary-button" type="button" @click="applyCoupon">Aplicar</button>
            </div>
            <small v-for="availableCoupon in props.rewards.coupons" :key="availableCoupon.code" class="coupon-hint">
              Disponible: {{ availableCoupon.code }} ({{ availableCoupon.discount }}%).
            </small>
            <small v-if="couponMessage" :class="appliedCoupon ? 'coupon-success' : 'field-error'" role="status">{{ couponMessage }}</small>
          </div>

          <div class="checkout-total">
            <span>Subtotal</span>
            <strong>{{ money(originalTotal) }}</strong>
          </div>
          <div v-if="productDiscount" class="checkout-total checkout-discount">
            <span>Descuento en autos</span>
            <strong>-{{ money(productDiscount) }}</strong>
          </div>
          <div v-if="appliedCoupon" class="checkout-total checkout-discount">
            <span>Cupón ({{ appliedCoupon.discount }}%)</span>
            <strong>-{{ money(discountAmount) }}</strong>
          </div>
          <div class="checkout-total">
            <span>Base gravable</span>
            <strong>{{ money(taxableBase) }}</strong>
          </div>
          <div class="checkout-total">
            <span>IVA (19%)</span>
            <strong>{{ money(taxAmount) }}</strong>
          </div>
          <div class="checkout-total checkout-payable">
            <span>Total a pagar</span>
            <strong>{{ money(totalAfterDiscount) }}</strong>
          </div>
          <button class="primary-button confirm-button" type="submit">Confirmar compra</button>
        </form>
      </section>
    </div>
  </Transition>
</template>
