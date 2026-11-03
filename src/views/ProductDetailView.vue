<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ListaProductos from '../components/ListaProductos.vue'
import { discountedValue } from '../utils/pricing.js'
import { formatCurrency as money } from '../utils/formatCurrency.js'

const props = defineProps({
  products: { type: Array, required: true },
  commentsByProduct: { type: Object, required: true }
})
const emit = defineEmits(['add-to-cart', 'view-product', 'add-review'])
const route = useRoute()
const selectedImage = ref('')
const reviewerName = ref('')
const reviewText = ref('')
const reviewRating = ref(5)

const product = computed(() =>
  props.products.find(item => item.id === Number(route.params.id))
)
const photos = computed(() =>
  product.value ? (product.value.images || [product.value.image]) : []
)
const comments = computed(() => product.value ? (props.commentsByProduct[product.value.id] || []) : [])
const relatedProducts = computed(() =>
  props.products.filter(item => item.id !== product.value?.id)
)
const averageRating = computed(() => {
  if (!comments.value.length) return product.value?.rating || 0
  return comments.value.reduce((sum, comment) => sum + comment.rating, 0) / comments.value.length
})
const finalPrice = computed(() => product.value
  ? discountedValue(product.value.price, product.value.discount)
  : 0
)
watch(product, value => {
  selectedImage.value = value ? (value.images?.[0] || value.image) : ''
  reviewerName.value = ''
  reviewText.value = ''
  reviewRating.value = 5
}, { immediate: true })

function addReview() {
  const text = reviewText.value.trim()
  if (!text || !product.value) return
  emit('add-review', {
    productId: product.value.id,
    comment: {
      id: `${Date.now()}-${Math.random()}`,
      name: reviewerName.value.trim() || 'Visitante',
      text,
      rating: reviewRating.value
    }
  })
  reviewText.value = ''
}
</script>

<template>
  <section v-if="product" class="product-detail-page">
    <RouterLink class="back-link" to="/categories">← Volver al catálogo</RouterLink>

    <div class="product-detail">
      <div class="product-gallery">
        <img class="detail-main-image" :src="selectedImage" :alt="product.name">
        <div v-if="photos.length > 1" class="detail-thumbnails" aria-label="Fotografías del producto">
          <button
            v-for="(photo, index) in photos"
            :key="`${index}-${photo}`"
            :class="{ selected: selectedImage === photo }"
            :aria-label="`Ver fotografía ${index + 1} de ${product.name}`"
            :aria-pressed="selectedImage === photo"
            @click="selectedImage = photo"
          >
            <img :src="photo" :alt="`${product.name}, fotografía ${index + 1}`">
          </button>
        </div>
      </div>

      <div class="product-detail-info">
        <span class="category-pill detail-category">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>
        <p class="detail-rating">
          <svg class="rating-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1z" /></svg>
          {{ averageRating.toFixed(1) }} <span>({{ comments.length }} comentarios)</span>
        </p>
        <p class="detail-description">{{ product.description }} Una experiencia pensada para acompañarte en cada camino.</p>
        <div class="price-area detail-price">
          <span v-if="product.discount" class="old-price">{{ money(product.price) }}</span>
          <span class="current-price">{{ money(finalPrice) }}</span>
        </div>
        <button class="primary-button detail-buy-button" @click="emit('add-to-cart', product)">
          <svg class="button-cart-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M3 5h4l3.1 15.1a2 2 0 0 0 2 1.6h12.8a2 2 0 0 0 1.9-1.4L30 10H9" />
            <circle cx="13" cy="27" r="1.7" />
            <circle cx="24" cy="27" r="1.7" />
          </svg>
          Comprar
        </button>
        <div class="characteristics-block">
          <h2>Características</h2>
          <p>{{ product.characteristics }}</p>
        </div>
      </div>
    </div>

    <section class="reviews-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">OPINIONES DE LA COMUNIDAD</p>
          <h2>Comentarios y calificaciones</h2>
        </div>
        <span class="product-counter">
          <svg class="rating-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1z" /></svg>
          {{ averageRating.toFixed(1) }} / 5
        </span>
      </div>
      <form class="review-form" @submit.prevent="addReview">
        <label>
          Tu nombre <span>(opcional)</span>
          <input v-model="reviewerName" type="text" placeholder="Visitante">
        </label>
        <fieldset class="rating-picker">
          <legend>Tu calificación</legend>
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            :class="{ selected: star <= reviewRating }"
            :aria-label="`Calificar con ${star} estrellas`"
            :aria-pressed="reviewRating === star"
            @click="reviewRating = star"
          >
            <svg class="rating-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1z" /></svg>
          </button>
        </fieldset>
        <label class="review-text-label">
          Tu comentario
          <textarea v-model="reviewText" rows="3" placeholder="¿Qué te parece este modelo?" required></textarea>
        </label>
        <button class="primary-button submit-review" type="submit">Publicar opinión</button>
      </form>

      <div v-if="comments.length" class="review-list">
        <article v-for="comment in comments" :key="comment.id" class="review-card">
          <div class="review-card-heading">
            <strong>{{ comment.name }}</strong>
            <span class="review-stars" :aria-label="`${comment.rating} de 5 estrellas`">
              <svg
                v-for="star in 5"
                :key="star"
                class="rating-star"
                :class="{ selected: star <= comment.rating }"
                viewBox="0 0 24 24"
                aria-hidden="true"
              ><path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1z" /></svg>
            </span>
          </div>
          <p>{{ comment.text }}</p>
        </article>
      </div>
      <p v-else class="empty-reviews">Todavía no hay opiniones. ¡Sé la primera persona en compartir la tuya!</p>
    </section>

    <section v-if="relatedProducts.length" class="shop-section related-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">SIGUE EXPLORANDO</p>
          <h2>Productos relacionados</h2>
        </div>
      </div>
      <ListaProductos
        :products="relatedProducts"
        @add-to-cart="emit('add-to-cart', $event)"
        @view-product="emit('view-product', $event)"
      />
    </section>
  </section>

  <section v-else class="not-found-page">
    <h1>Este modelo no está disponible</h1>
    <p>Puede que el producto haya cambiado o que el enlace no sea válido.</p>
    <RouterLink class="primary-button welcome-cta" to="/categories">Ver catálogo</RouterLink>
  </section>
</template>
