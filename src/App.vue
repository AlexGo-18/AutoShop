<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CarritoCompra from './components/CarritoCompra.vue'
import FacturaCompra from './components/FacturaCompra.vue'
import PurchaseInvoice from './components/PurchaseInvoice.vue'
import PromotionModal from './components/PromotionModal.vue'
import ToastMessage from './components/ToastMessage.vue'
import { discountedValue } from './utils/pricing.js'

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

const products = ref([
  {
    id: 1,
    name: 'Mazda MX-5',
    description: 'Rendimiento y estilo en un solo auto.',
    price: 183200000,
    discount: 20,
    image: 'https://media-assets.mazda.eu/image/upload/q_auto,f_auto/mazdaes/globalassets/cars/2027-mazda-mx-5-rf/assets/masonry-grid/mme-mazda-mx-5-rf-masonry-grid-mobile-01.jpg?rnd=4a65a9',
    images: [
      'https://media-assets.mazda.eu/image/upload/q_auto,f_auto/mazdaes/globalassets/cars/2027-mazda-mx-5-rf/assets/masonry-grid/mme-mazda-mx-5-rf-masonry-grid-mobile-01.jpg?rnd=4a65a9',
      'https://hips.hearstapps.com/es.h-cdn.co/cades/contenidos/10117/4mazda_mx-5rf_showmodel_fq_open_white.jpg?resize=640:*',
      'https://www.elcarrocolombiano.com/wp-content/uploads/2024/01/20240125-MAZDA-MX-5-2024-ACTUALIZACION-02.jpg'
    ],
    category: 'Deportivos',
    characteristics: 'El Mazda MX-5 es un automóvil deportivo de dos plazas que destaca por su diseño moderno y aerodinámico. Cuenta con un techo descapotable retráctil, motor de 2.0 litros y 181 caballos de fuerza, transmisión manual de seis velocidades y tracción trasera. Su interior combina comodidad y tecnología, con pantalla multimedia, conectividad Apple CarPlay y Android Auto, cámara de reversa y sistemas de seguridad. Es un vehículo ideal para quienes buscan una experiencia de conducción dinámica, libertad y estilo deportivo.',
    rating: 5
  },
  {
    id: 2,
    name: 'Jeep Cherokee XJ',
    description: 'Comodidad y espacio para tus aventuras.',
    price: 30000000,
    discount: 0,
    image: 'https://www.diariomotor.com/imagenes/2026/03/jeep-cherokee-xj-pioneer-concept-01-69c8e37039c2f.jpg?class=XL',
    category: 'Todoterreno',
    images: [
      'https://www.diariomotor.com/imagenes/2026/03/jeep-cherokee-xj-pioneer-concept-01-69c8e37039c2f.jpg?class=XL',
      'https://hagerty-media-prod.imgix.net/2026/08/RR_JeepCherokeeXJ_DSC05024-scaled.jpg?auto=format%2Ccompress&ixlib=php-3.3.0',
      'https://images.squarespace-cdn.com/content/v1/5febbf6e3ce7d665de39acdd/1638035134650-GD87KN6L2CZ25SHWFOQX/green%2Bcherokee%2BXJ%2BSport%2B.jpg'
    ],
    characteristics: 'Su estilo todoterreno, carrocería de líneas cuadradas y amplia cabina le dan una personalidad única. Está equipada, en sus versiones más reconocidas, con un potente motor de 4.0 litros, tracción 4x4 y una suspensión diseñada para afrontar caminos exigentes. Su interior ofrece espacio para cinco pasajeros y comodidad para viajes largos. Es una excelente opción para quienes buscan resistencia, versatilidad y un vehículo con carácter propio.',
    rating: 4
  },
  {
    id: 3,
    name: 'Ford Mustang 1967',
    description: 'Un ícono de la carretera que nunca pasa de moda.',
    price: 140000000,
    discount: 0,
    image: 'https://am-s3-bucket-assets.s3.eu-west-2.amazonaws.com/silverstone/prod/lot_images/large/REC17257-1/REC17257-1_27.jpg.webp?dummy=1793001457',
    category: 'Deportivos',
    images: [
      'https://am-s3-bucket-assets.s3.eu-west-2.amazonaws.com/silverstone/prod/lot_images/large/REC17257-1/REC17257-1_27.jpg.webp?dummy=1793001457',
      'https://www.gallery-aaldering.com/wp-content/uploads/2025/06/ford-mustang-shelby-gt-500-fastback-1967.jpg',
      'https://www.gallery-aaldering.com/wp-content/uploads/2025/06/ford-mustang-fastback-s-code-390-1967.jpg'
    ],
    characteristics: 'automóvil deportivo clásico que destaca por su diseño musculoso, sus líneas elegantes y su inconfundible estilo americano. Cuenta con una amplia parrilla frontal, capó alargado, faros característicos y las clásicas luces traseras triples. Estuvo disponible en versiones coupé, Fastback y convertible. Según su configuración, incorpora motores V8 de 4.7 o 6.4 litros, con potencias que pueden alcanzar los 320 caballos de fuerza. Su interior combina detalles clásicos con una distribución cómoda y un tablero de diseño vintage. Es una verdadera joya automotriz para quienes aprecian la potencia, la historia y el estilo de los deportivos clásicos.',
    rating: 5
  },
  {
    id: 4,
    name: 'BMW 218i Gran Coupé',
    description: 'Diseño moderno para recorrer la ciudad.',
    price: 119700000,
    discount: 10,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWFTP2S5yaZ2-gA-I5ht3adD8deptmQiYf2xXJlhZf8gZQABYBUHExraI&s=10',
    category: 'Urbanos',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWFTP2S5yaZ2-gA-I5ht3adD8deptmQiYf2xXJlhZf8gZQABYBUHExraI&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOoLn1_KdCoqAwyDjgTR6LoBHHDS-Lv9YZ1SSncMUoE3F_LIx2IkLraIF&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiVD2IvMB5lA6tjLJvvdYSHZnjClBzpHa_swm9Ao2HJc5h30njw12RDRtQ&s=10'
    ],
    characteristics: 'combina elegancia, tecnología y un diseño deportivo de líneas aerodinámicas. Cuenta con una carrocería de cuatro puertas, detalles exteriores sofisticados y una parrilla frontal característica de BMW. Está equipado con un motor TwinPower Turbo de 1.5 litros y tres cilindros, que desarrolla aproximadamente 140 a 156 caballos de fuerza, dependiendo del año y la versión. Su transmisión automática ofrece una conducción suave y dinámica, mientras que su interior incorpora asientos deportivos, pantalla multimedia, iluminación ambiental y acabados de alta calidad. Además, dispone de faros LED, sensores de estacionamiento y sistemas de asistencia al conductor.',
    rating: 4
  },
  {
    id: 5,
    name: 'Toyota Prado TX-L 2022',
    description: 'Listo para salir de la rutina y explorar.',
    price: 259700000,
    discount: 15,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtJP-DXc4vh2duF75wy5XOZFUVQw32RqpP_WFd-M5Xg3TUkhJ4LRES4a8&s=10',
    category: 'Todoterreno',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtJP-DXc4vh2duF75wy5XOZFUVQw32RqpP_WFd-M5Xg3TUkhJ4LRES4a8&s=10',
      'https://tradexauto.com/wp-content/uploads/2022/02/ToyotaLandCruiserPrado2021estacionado-1920w-1024x768.jpg.webp',
      'https://tradexauto.com/wp-content/uploads/2021/09/image.jpg'
    ],
    characteristics: 'camioneta SUV que combina elegancia, comodidad y potencia. Cuenta con un diseño robusto, capacidad para siete pasajeros y tracción 4x4, ideal para viajes y terrenos exigentes. Según su versión, incorpora un motor de gasolina de 4.0 litros o diésel de 2.8 litros, transmisión automática y un interior espacioso con acabados de calidad. Es una excelente opción para quienes buscan aventura, seguridad y confort en un solo vehículo.',
    rating: 5
  },
  {
    id: 6,
    name: 'Mercedes-Benz Clase S',
    description: 'Una combinación de confort y sofisticación.',
    price: 225000000,
    discount: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/34/0_Mercedes-Maybach_S_580_1.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original',
    category: 'Familiares',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/3/34/0_Mercedes-Maybach_S_580_1.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original',
      'https://hips.hearstapps.com/hmg-prod/images/mercedes-benz-clase-s-2025-01-67eed736d67ad.jpg?crop=0.7802666666666667xw:1xh;center,top&resize=1200:*',
      'https://media.revistagq.com/photos/698a022e4c8c59d77fd79703/16:9/w_2560%2Cc_limit/26c0017_041.jpg'
    ],
    characteristics: 'sedán de lujo que destaca por su diseño elegante, comodidad y tecnología avanzada. Cuenta con un amplio interior de acabados premium, asientos ergonómicos, iluminación ambiental y pantallas digitales. Según su versión, incorpora motores de seis u ocho cilindros, transmisión automática y sistemas de suspensión que ofrecen una conducción suave. Además, dispone de techo panorámico, conectividad multimedia y avanzados asistentes de seguridad. Es ideal para quienes buscan una combinación de exclusividad, sofisticación y confort en cada viaje.',
    rating: 5
  },
  {
    id: 7,
    name: 'Porsche 911 GT3 RS',
    description: 'Un deportivo legendario con carácter y precisión.',
    price: 2590000000,
    discount: 12,
    image: 'https://www.levorecollection.com/wp-content/uploads/2026/03/Porsche-911-GT3-RS-1024x683.jpg',
    images: [
      'https://www.levorecollection.com/wp-content/uploads/2026/03/Porsche-911-GT3-RS-1024x683.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm0YIOwfLKKrAB4RnWPH2j25fKShfJ43FFkcwL8suAaqrWaRNwv1go6ZJD&s=10',
      'https://newsroom.porsche.com/dam/jcr:83d3c489-9a28-4469-bd6b-219a15b899c2/b-titelShowroom2.jpeg'
    ],
    category: 'Deportivos',
    characteristics: 'automóvil deportivo de alto rendimiento que destaca por su diseño agresivo y aerodinámico, inspirado en los vehículos de competición. Cuenta con un motor bóxer de seis cilindros y 4.0 litros, capaz de generar 525 caballos de fuerza. Incorpora una transmisión automática PDK de siete velocidades, tracción trasera y un imponente alerón posterior que mejora su aerodinámica. Su interior combina acabados deportivos, materiales ligeros y tecnología avanzada. Es una auténtica expresión de ingeniería, elegancia y espíritu de competición.',
    rating: 5
  },
  {
    id: 8,
    name: 'Ford Mustang Dark Horse',
    description: 'Potencia y estilo clásico para cada trayecto.',
    price: 320000000,
    discount: 8,
    image: 'https://live.dealer-asset.co/images/br1166/news/ford-colombia-mustang-dark-horse-noticia.jpg?s=1024',
    images: [
      'https://live.dealer-asset.co/images/br1166/news/ford-colombia-mustang-dark-horse-noticia.jpg?s=1024',
      'https://www.popsci.com/wp-content/uploads/2023/02/13/Mustang-Dark-Horse-Carbon-Fiber-Wheels_01.jpg',
      'https://weupreviewimagesprd.blob.core.windows.net/br1166/siteassets/ford-colombia-mustang-dark-horse-lateral.jpg'
    ],
    category: 'Deportivos',
    characteristics: 'eportivo de alto rendimiento que destaca por su diseño agresivo, líneas aerodinámicas y detalles exclusivos. Cuenta con un potente motor Coyote V8 de 5.0 litros capaz de generar 500 caballos de fuerza. Incorpora transmisión manual de seis velocidades, tracción trasera, suspensión MagneRide y frenos Brembo. Su exterior luce un alerón deportivo y acabados distintivos, mientras que su interior combina tecnología, comodidad y detalles inspirados en la competición. Es una combinación de potencia, diseño y personalidad deportiva.',
    rating: 5
  },
  {
    id: 9,
    name: 'BMW Serie 3 Berlina',
    description: 'Confort ejecutivo y dinámica para la ciudad.',
    price: 115900000,
    discount: 0,
    image: 'https://www.bmwautomotor.com/wp-content/uploads/2018/09/serie3_3.webp',
    images: [
      'https://www.bmwautomotor.com/wp-content/uploads/2018/09/serie3_3.webp',
      'https://www.ceccatomotors.com/media/td0mjun0/p90462492_lowres_the-new-bmw-3-series.jpg?format=webp',
      'https://img.autotrader.co.za/27565062/Crop860x650'
    ],
    category: 'Urbanos',
    characteristics: 'Combina elegancia, comodidad y deportividad en un diseño moderno de cuatro puertas. Cuenta con una parrilla frontal característica, líneas aerodinámicas y un interior espacioso con acabados de alta calidad. Según su versión, incorpora motores TwinPower Turbo, transmisión automática de ocho velocidades y tracción trasera o integral. También ofrece pantalla multimedia, conectividad inteligente, iluminación LED y sistemas de asistencia al conductor.',
    rating: 4
  },
  {
    id: 10,
    name: 'Range Rover Evoque',
    description: 'Versatilidad y elegancia para la ciudad y la aventura.',
    price: 165000000,
    discount: 5,
    image: 'https://media.cdn-jaguarlandrover.com/api/v2/images/119854/w/1600/h/900.jpg',
    images: [
      'https://media.cdn-jaguarlandrover.com/api/v2/images/119854/w/1600/h/900.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCcGE0XpfkQqn6QACFxR2fMFEUSi557-c9J82u6NsHNDmcypc09yeuRiwN&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCy00gq823bLtEg2HlJc_u2O7L3_ulM1dSou_b0tY2UhoEv0XoZROax_Q&s=10'
    ],
    category: 'Todoterreno',
    characteristics: 'SUV de lujo que destaca por su diseño moderno, elegante y deportivo. Cuenta con una silueta tipo coupé, techo panorámico según versión, faros LED y manijas de puertas retráctiles. Su interior ofrece acabados premium, asientos cómodos y una pantalla táctil multimedia de gran tamaño. Además, incorpora tecnologías de asistencia al conductor y opciones de tracción en las cuatro ruedas para afrontar diferentes terrenos.',
    rating: 4
  }
])

const routeViewProps = computed(() => {
  if (route.name === 'account') return { profile, rewards, invoices }
  if (route.name === 'product-detail') return { products: products.value, commentsByProduct }
  if (['home', 'categories', 'promotions'].includes(route.name)) {
    return { products: products.value }
  }
  return {}
})

const cartItems = ref([])
const isCartOpen = ref(false)
const isCheckoutOpen = ref(false)
const isPromotionOpen = ref(false)
const promotionProductIndex = ref(-1)
const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimeout
const promotionProduct = computed(() => products.value[promotionProductIndex.value])
const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.cantidad, 0)
)
const cartItemsWithDiscounts = computed(() =>
  cartItems.value.map(item => ({
    ...item,
    unitPrice: Math.round(discountedValue(item.price, item.discount))
  }))
)

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
  const found = cartItems.value.find(item => item.id === product.id)

  if (found) {
    found.cantidad++
  } else {
    cartItems.value.push({
      ...product,
      cantidad: 1,
      seleccionado: true
    })
  }
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
  const item = cartItems.value.find(item => item.id === productId)
  if (!item) return
  item.cantidad += amount
  if (item.cantidad <= 0) removeFromCart(productId)
}

function removeFromCart(productId) {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
}

function updateSelection({ id, selected }) {
  const item = cartItems.value.find(item => item.id === id)
  if (item) item.seleccionado = selected
}

const selectedItems = computed(() =>
  cartItemsWithDiscounts.value.filter(item => item.seleccionado)
)
const selectedCount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.cantidad, 0)
)
const checkoutCouponDiscount = ref(0)
const selectedTotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.unitPrice * item.cantidad, 0)
)
const selectedProductDiscount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + (item.price - item.unitPrice) * item.cantidad, 0)
)
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
const selectedOriginalTotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.cantidad, 0)
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

  cartItems.value = cartItems.value.filter(item => !boughtIds.includes(item.id))
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
