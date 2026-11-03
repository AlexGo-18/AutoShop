<script setup>
import { computed, ref } from 'vue'
import ListaProductos from '../components/ListaProductos.vue'

const props = defineProps({
  products: { type: Array, required: true }
})

const emit = defineEmits(['add-to-cart', 'view-product'])
const search = ref('')
const matchingProducts = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  if (!query) return props.products
  return props.products.filter(product =>
    `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase().includes(query)
  )
})
const promotedProducts = computed(() => matchingProducts.value.filter(product => product.discount > 0))
const otherProducts = computed(() => matchingProducts.value.filter(product => !product.discount))
</script>

<template>
  <div class="categories-page">
    <section>
    <div class="section-heading category-heading">
      <div>
        <p class="eyebrow">APROVECHA ESTAS OFERTAS</p>
        <h1>Promociones</h1>
      </div>
      <span class="product-counter">{{ promotedProducts.length }} autos en promoción</span>
    </div>

    <label class="search-field">
      <span aria-hidden="true">⌕</span>
      <input
        v-model="search"
        type="search"
        placeholder="Buscar por nombre, categoría o descripción…"
        aria-label="Buscar promociones y autos"
      >
    </label>

    <ListaProductos
      v-if="promotedProducts.length"
      :products="promotedProducts"
      @add-to-cart="emit('add-to-cart', $event)"
      @view-product="emit('view-product', $event)"
    />
    <div v-else-if="!search" class="no-results">
      <h2>Pronto habrá nuevas promociones</h2>
      <p>Vuelve a visitarnos para descubrir las próximas ofertas.</p>
    </div>
    </section>

    <section v-if="otherProducts.length" class="shop-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">SIGUE EXPLORANDO</p>
          <h2>Más autos y artículos</h2>
        </div>
        <span class="product-counter">{{ otherProducts.length }} productos disponibles</span>
      </div>
      <ListaProductos
        :products="otherProducts"
        @add-to-cart="emit('add-to-cart', $event)"
        @view-product="emit('view-product', $event)"
      />
    </section>
    <div v-if="search && !matchingProducts.length" class="no-results">
      <h2>No encontramos resultados</h2>
      <p>Prueba con otro nombre, categoría o descripción.</p>
    </div>
  </div>
</template>
