<script setup>
import { useCarritoStore } from './stores/carrito'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CarritoCompra from './components/CarritoCompra.vue'
import FacturaCompra from './components/FacturaCompra.vue'
import PurchaseInvoice from './components/PurchaseInvoice.vue'
import PromotionModal from './components/PromotionModal.vue'
import ToastMessage from './components/ToastMessage.vue'
import { useProductosStore } from './stores/productos'
import { usePedidosStore } from './stores/pedidos'

defineProps({})
defineEmits([])

const router = useRouter()
const route = useRoute()
const couponOffers = {
  BIENVENIDO10: { code: 'BIENVENIDO10', discount: 10, label: 'Cupón de bienvenida' },
  TRESAUTOS25: { code: 'TRESAUTOS25', discount: 25, label: 'Cupón por comprar 3 autos' },
  TODOSAUTOS50: { code: 'TODOSAUTOS50', discount: 50, label: 'Cupón por comprar todos los autos' }
}

function readStoredValue(key, fallback, isValid) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    const parsed = JSON.parse(stored)
    return isValid(parsed) ? parsed : fallback
  } catch (error) {
    console.error(`No se pudo leer ${key} del almacenamiento local.`, error)
    return fallback
  }
}

const emptyProfile = { nombre: '', correo: '', direccion: '' }
const initialProfile = readStoredValue('autoshop-profile', emptyProfile, value =>
  value && typeof value === 'object' && !Array.isArray(value)
)
const profile = reactive({
  nombre: typeof initialProfile.nombre === 'string' ? initialProfile.nombre : '',
  correo: typeof initialProfile.correo === 'string' ? initialProfile.correo : '',
  direccion: typeof initialProfile.direccion === 'string' ? initialProfile.direccion : ''
})

const initialRewards = readStoredValue('autoshop-rewards', {}, value =>
  value && typeof value === 'object' && !Array.isArray(value)
)
const savedCoupons = Array.isArray(initialRewards.coupons)
  ? [...new Set(initialRewards.coupons)]
    .filter(code => Object.hasOwn(couponOffers, code))
    .map(code => ({ ...couponOffers[code] }))
  : []
const milestones = initialRewards.milestones && typeof initialRewards.milestones === 'object'
  ? initialRewards.milestones
  : {}
const rewards = reactive({
  coupons: savedCoupons,
  purchaseCount: Number.isSafeInteger(initialRewards.purchaseCount) && initialRewards.purchaseCount > 0
    ? initialRewards.purchaseCount
    : 0,
  purchasedProductIds: Array.isArray(initialRewards.purchasedProductIds)
    ? [...new Set(initialRewards.purchasedProductIds.filter(id => Number.isSafeInteger(id) && id > 0))]
    : [],
  milestones: {
    welcome: milestones.welcome === true,
    threeCars: milestones.threeCars === true,
    allCars: milestones.allCars === true
  }
})

const legacyCoupon = readStoredValue('autoshop-coupon', null, value =>
  value && typeof value === 'object' && !Array.isArray(value)
)
if (legacyCoupon?.code === 'BIENVENIDO10') {
  rewards.milestones.welcome = true
  if (!legacyCoupon.used && !rewards.coupons.some(item => item.code === legacyCoupon.code)) {
    rewards.coupons.push({ ...couponOffers.BIENVENIDO10 })
  }
}

const savedInvoices = readStoredValue('autoshop-invoices', [], Array.isArray)
const invoices = reactive(savedInvoices.filter(invoice =>
  invoice &&
  typeof invoice.number === 'string' &&
  typeof invoice.createdAt === 'string' &&
  Array.isArray(invoice.items)
))
const latestInvoice = ref(null)
const isInvoiceOpen = ref(false)
const purchaseToastMessage = ref('')
const commentsByProduct = reactive({})

watch(profile, value => {
  try {
    localStorage.setItem('autoshop-profile', JSON.stringify(value))
  } catch (error) {
    console.error('No se pudo guardar el perfil de AutoShop.', error)
  }
}, { deep: true })

watch(rewards, value => {
  try {
    localStorage.setItem('autoshop-rewards', JSON.stringify(value))
  } catch (error) {
    console.error('No se pudieron guardar las recompensas de AutoShop.', error)
  }
}, { deep: true })

watch(invoices, value => {
  try {
    localStorage.setItem('autoshop-invoices', JSON.stringify(value))
  } catch (error) {
    console.error('No se pudieron guardar las facturas de AutoShop.', error)
  }
}, { deep: true })

const productosStore = useProductosStore()
const carritoStore = useCarritoStore()
const pedidosStore = usePedidosStore()
const { pedidos } = storeToRefs(pedidosStore)

const {
  cartCount,
  cartItemsWithDiscounts,
  selectedItems,
  selectedCount,
  selectedTotal,
  selectedProductDiscount,
  selectedOriginalTotal
} = storeToRefs(carritoStore)

const { products } = storeToRefs(productosStore)

const isCartOpen = ref(false)
const isCheckoutOpen = ref(false)
const isPromotionOpen = ref(false)
const promotionProductIndex = ref(-1)

const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout

const promotionProduct = computed(() =>
  products.value[promotionProductIndex.value] || products.value[0] || {}
)

const routeViewProps = computed(() => {
  if (route.name === 'account') return { profile, rewards, invoices }

  if (route.name === 'product-detail') {
    return { products: products.value, commentsByProduct }
  }

  if (['home', 'categories', 'promotions'].includes(route.name)) {
    return { products: products.value }
  }

  return {}
})

watch(profile, customerProfile => {
  const isComplete = customerProfile.nombre.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerProfile.correo) &&
    customerProfile.direccion.trim().length > 4

  if (isComplete && !rewards.milestones.welcome) {
    rewards.milestones.welcome = true
    const earnedCoupon = grantCoupon('BIENVENIDO10')
    if (earnedCoupon) {
      showToast(`¡Felicidades! Usa este descuento y compra a precios más bajos. Cupón ${earnedCoupon.code}: ${earnedCoupon.discount}% de descuento.`)
    }
  }
}, { deep: true, immediate: true })

watch(() => route.name, name => {
  if (name === 'home') {
    promotionProductIndex.value = (promotionProductIndex.value + 1) % products.value.length
    isPromotionOpen.value = true
  } else {
    isPromotionOpen.value = false
  }
}, { immediate: true })

function addToCart(product) {
  carritoStore.addToCart(product)
  showToast(`${product.name} se agregó al carrito.`)
}


function grantCoupon(code) {
  if (rewards.coupons.some(item => item.code === code)) return null
  const offer = couponOffers[code]
  if (!offer) return null

  const earnedCoupon = { ...offer }
  rewards.coupons.push(earnedCoupon)
  return earnedCoupon
}

function changeQuantity(productId, amount) {
  carritoStore.changeQuantity(productId, amount)
}

function removeFromCart(productId) {
  carritoStore.removeFromCart(productId)
}


function updateSelection({ id, selected }) {
  carritoStore.updateSelection({ id, selected })
}


const checkoutCouponDiscount = ref(0)


const selectedTaxableBase = computed(() =>
  selectedTotal.value - (checkoutCouponDiscount.value || 0)
)
const selectedTax = computed(() => Math.round(selectedTaxableBase.value * 0.19))
const selectedInvoiceItems = computed(() =>
  selectedItems.value.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.cantidad,
    originalUnitPrice: item.price,
    discountRate: item.discount || 0,
    unitDiscount: item.price - item.unitPrice,
    unitPrice: item.unitPrice,
    unitPriceAfterDiscount: item.unitPrice,
    productDiscount: (item.price - item.unitPrice) * item.cantidad,
    lineTotal: item.unitPrice * item.cantidad
  }))
)


function startCheckout() {
  if (!selectedItems.value.length) {
    showToast('Selecciona al menos un producto para continuar.', 'error')
    return
  }
  isCheckoutOpen.value = true
}

function completePurchase(customerData) {
  checkoutCouponDiscount.value = customerData.couponDiscount || 0
  const purchasedItems = selectedItems.value.map(item => ({ id: item.id, quantity: item.cantidad }))
  const boughtIds = purchasedItems.map(item => item.id)
  const invoiceItems = selectedInvoiceItems.value
  const couponUsed = rewards.coupons.find(item => item.code === customerData.couponCode)
  const subtotal = selectedOriginalTotal.value
  const productDiscount = selectedProductDiscount.value
  const couponDiscount = couponUsed ? customerData.couponDiscount : 0
  const totalDiscounts = productDiscount + couponDiscount
  const taxableBase = selectedTaxableBase.value
  const taxRate = 19
  const tax = selectedTax.value
  const invoiceTotal = taxableBase + tax
  const latestSequence = invoices.reduce((latest, invoice) => {
    const sequence = Number(invoice.number.match(/^FACT-(\d+)$/)?.[1] || 0)
    return Math.max(latest, sequence)
  }, 0)
  const invoiceNumber = `FACT-${String(latestSequence + 1).padStart(6, '0')}`

  const invoice = {
    number: invoiceNumber,
    createdAt: new Date().toISOString(),
    customer: {
      nombre: customerData.nombre,
      correo: customerData.correo,
      direccion: customerData.direccion
    },
    items: invoiceItems,
    subtotal,
    productDiscount,
    couponCode: couponUsed?.code || '',
    couponDiscount,
    totalDiscounts,
    taxableBase,
    taxRate,
    tax,
    total: invoiceTotal
  }
  invoices.push(invoice)
  latestInvoice.value = invoice

    pedidosStore.agregarPedido({
    id: invoiceNumber,
    createdAt: invoice.createdAt,
    customer: invoice.customer,
    items: invoiceItems,
    total: invoiceTotal,
    invoiceNumber,
    status: 'Completado'
  })


 
  if (couponUsed) {
    const couponIndex = rewards.coupons.findIndex(item => item.code === couponUsed.code)
    if (couponIndex !== -1) rewards.coupons.splice(couponIndex, 1)
  }

  rewards.purchaseCount += purchasedItems.reduce((sum, item) => sum + item.quantity, 0)
  rewards.purchasedProductIds = [...new Set([
    ...rewards.purchasedProductIds,
    ...purchasedItems.map(item => item.id)
  ])]

  const earnedCoupons = []
  if (!rewards.milestones.threeCars && rewards.purchaseCount >= 3) {
    rewards.milestones.threeCars = true
    const earnedCoupon = grantCoupon('TRESAUTOS25')
    if (earnedCoupon) earnedCoupons.push(earnedCoupon)
  }

  if (!rewards.milestones.allCars && products.value.every(product => rewards.purchasedProductIds.includes(product.id))) {
    rewards.milestones.allCars = true
    const earnedCoupon = grantCoupon('TODOSAUTOS50')
    if (earnedCoupon) earnedCoupons.push(earnedCoupon)
  }

  isCheckoutOpen.value = false
  isCartOpen.value = false
  checkoutCouponDiscount.value = 0
  if (earnedCoupons.length) {
    const couponDescriptions = earnedCoupons.map(item => `${item.code} (${item.discount}%)`).join(' y ')
    purchaseToastMessage.value = `¡Felicidades! Ganaste: ${couponDescriptions}.`
  } else {
    purchaseToastMessage.value = `¡Compra realizada, ${customerData.nombre.split(' ')[0]}! Factura ${invoiceNumber} guardada en Mis facturas.`
  }
  isInvoiceOpen.value = true
}

function startNewPurchase() {
  isInvoiceOpen.value = false
  latestInvoice.value = null
  if (purchaseToastMessage.value) {
    showToast(purchaseToastMessage.value)
    purchaseToastMessage.value = ''
  }
}

function closePromotion() {
  isPromotionOpen.value = false
}

function openProduct(product) {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

function showToast(message, type = 'success') {
  toast.value = { visible: true, message, type }
  window.clearTimeout(toastTimeout)
  toastTimeout = window.setTimeout(() => {
    toast.value.visible = false
  }, 3600)
}

function updateProfile(updatedProfile) {
  Object.assign(profile, updatedProfile)
}

function addReview({ productId, comment }) {
  if (!commentsByProduct[productId]) commentsByProduct[productId] = []
  commentsByProduct[productId].unshift(comment)
}

</script>

<template>
  <div class="page-shell">
    <AppHeader :cart-count="cartCount" @open-cart="isCartOpen = true" />

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <component
          :is="Component"
          v-bind="routeViewProps"
          @update-profile="updateProfile"
          @add-review="addReview"
          @add-to-cart="addToCart"
          @view-product="openProduct"
        />
      </RouterView>
    </main>

    <AppFooter />

    <CarritoCompra
      :open="isCartOpen"
      :items="cartItemsWithDiscounts"
      :total="selectedTotal"
      :original-total="selectedOriginalTotal"
      :discount-total="selectedProductDiscount"
      :selected-count="selectedCount"
      @close-cart="isCartOpen = false"
      @change-quantity="changeQuantity"
      @remove-item="removeFromCart"
      @selection-change="updateSelection"
      @checkout-request="startCheckout"
    />

    <FacturaCompra
      :open="isCheckoutOpen"
      :total="selectedTotal"
      :original-total="selectedOriginalTotal"
      :profile="profile"
      :rewards="rewards"
      @close-checkout="isCheckoutOpen = false"
      @confirm-purchase="completePurchase"
    />

    <PurchaseInvoice
      :open="isInvoiceOpen"
      :invoice="latestInvoice"
      @new-purchase="startNewPurchase"
    />

    <PromotionModal
      :open="isPromotionOpen"
      :product="promotionProduct"
      @close-promotion="closePromotion"
      @add-to-cart="addToCart"
      @view-product="openProduct"
    />

    <ToastMessage
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close-toast="toast.visible = false"
    />
  </div>
</template>
