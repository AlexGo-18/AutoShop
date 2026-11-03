<script setup>
import { computed, ref } from 'vue'
import ListaProductos from '../components/ListaProductos.vue'

const props = defineProps({
  products: { type: Array, required: true }
})
const emit = defineEmits(['add-to-cart', 'view-product'])
const search = ref('')
const selectedCategory = ref('Todas')

const categories = [
  'Todas',
  'Deportivos',
  'Familiares',
  'Todoterreno',
  'Urbanos'
]
const filteredProducts = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return props.products.filter(product => {
    const matchesCategory = selectedCategory.value === 'Todas' || product.category === selectedCategory.value
    const matchesSearch = !query ||
      `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <section class="categories-page">
    <div class="section-heading category-heading">
      <div>
        <p class="eyebrow">ENCUENTRA TU MODELO</p>
        <h1>Explora las categorías</h1>
      </div>
      <span class="product-counter">{{ filteredProducts.length }} modelos encontrados</span>
    </div>

    <label class="search-field">
      <span aria-hidden="true">⌕</span>
      <input v-model="search" type="search" placeholder="Buscar por nombre, categoría o descripción…" aria-label="Buscar productos">
    </label>

    <div class="category-layout">
      <aside class="category-sidebar" aria-label="Filtrar por categoría">
        <h2>Catálogo</h2>
        <button
          v-for="category in categories"
          :key="category"
          class="category-filter"
          :class="{ selected: selectedCategory === category }"
          :aria-pressed="selectedCategory === category"
          @click="selectedCategory = category"
        >
          {{ category }}
          <span>{{ category === 'Todas' ? products.length : products.filter(product => product.category === category).length }}</span>
        </button>
      </aside>

      <div class="category-results">
        <ListaProductos
          v-if="filteredProducts.length"
          :products="filteredProducts"
          @add-to-cart="emit('add-to-cart', $event)"
          @view-product="emit('view-product', $event)"
        />
        <div v-else class="no-results">
          <h2>No encontramos modelos</h2>
          <p>Prueba con otra búsqueda o selecciona una categoría diferente.</p>
        </div>
      </div>
    </div>
  </section>
</template>
