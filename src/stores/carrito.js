
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { discountedValue } from '../utils/pricing.js'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref([])

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.cantidad, 0)
  )

  const cartItemsWithDiscounts = computed(() =>
    items.value.map(item => ({
      ...item,
      unitPrice: Math.round(discountedValue(item.price, item.discount))
    }))
  )

  const selectedItems = computed(() =>
    cartItemsWithDiscounts.value.filter(item => item.seleccionado)
  )

  const selectedCount = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.cantidad, 0)
  )

  const selectedTotal = computed(() =>
    selectedItems.value.reduce(
      (sum, item) => sum + item.unitPrice * item.cantidad, 0
    )
  )

  const selectedProductDiscount = computed(() =>
    selectedItems.value.reduce(
      (sum, item) => sum + (item.price - item.unitPrice) * item.cantidad, 0
    )
  )

  const selectedOriginalTotal = computed(() =>
    selectedItems.value.reduce(
      (sum, item) => sum + item.price * item.cantidad, 0
    )
  )

  function addToCart(product) {
    const found = items.value.find(item => item.id === product.id)

    if (found) {
      found.cantidad++
    } else {
      items.value.push({
        ...product,
        cantidad: 1,
        seleccionado: true
      })
    }
  }

  function changeQuantity(productId, amount) {
    const item = items.value.find(item => item.id === productId)
    if (!item) return

    item.cantidad += amount

    if (item.cantidad <= 0) {
      removeFromCart(productId)
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
  }

  function updateSelection({ id, selected }) {
    const item = items.value.find(item => item.id === id)
    if (item) item.seleccionado = selected
  }

  function removePurchasedItems(productIds) {
    items.value = items.value.filter(item => !productIds.includes(item.id))
  }

  return {
    items,
    cartCount,
    cartItemsWithDiscounts,
    selectedItems,
    selectedCount,
    selectedTotal,
    selectedProductDiscount,
    selectedOriginalTotal,
    addToCart,
    changeQuantity,
    removeFromCart,
    updateSelection,
    removePurchasedItems
  }
})
