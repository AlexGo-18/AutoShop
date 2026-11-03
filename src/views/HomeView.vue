<script setup>
import { computed, ref } from 'vue'
import ListaProductos from '../components/ListaProductos.vue'

const props = defineProps({
  products: { type: Array, required: true }
})

const emit = defineEmits(['add-to-cart', 'view-product'])
const search = ref('')
const searchResults = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  if (!query) return []
  return props.products.filter(product =>
    `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase().includes(query)
  )
})
</script>

<template>
  <div>
    <label class="search-field home-search">
      <span aria-hidden="true">⌕</span>
      <input v-model="search" type="search" placeholder="¿Qué modelo estás buscando?" aria-label="Buscar productos">
    </label>

    <section v-if="search" class="shop-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">RESULTADOS DE BÚSQUEDA</p>
          <h2>Modelos que coinciden</h2>
        </div>
        <span class="product-counter">{{ searchResults.length }} resultados</span>
      </div>
      <ListaProductos
        v-if="searchResults.length"
        :products="searchResults"
        @add-to-cart="emit('add-to-cart', $event)"
        @view-product="emit('view-product', $event)"
      />
      <p v-else class="empty-reviews">No encontramos modelos con ese término.</p>
    </section>

    <section class="shop-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">OFERTAS PARA TI</p>
          <h2>Promociones destacadas</h2>
        </div>
        <RouterLink class="text-link" to="/categories">Ver todo el catálogo →</RouterLink>
      </div>
      <ListaProductos
        :products="products.filter(product => product.discount)"
        @add-to-cart="emit('add-to-cart', $event)"
        @view-product="emit('view-product', $event)"
      />
    </section>

    <section class="shop-section featured-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">NUESTRA COLECCIÓN</p>
          <h2>Productos destacados</h2>
        </div>
        <span class="product-counter">{{ products.length }} modelos disponibles</span>
      </div>
      <ListaProductos
        :products="products.slice(0, 3)"
        @add-to-cart="emit('add-to-cart', $event)"
        @view-product="emit('view-product', $event)"
      />
    </section>
  </div>
</template>
