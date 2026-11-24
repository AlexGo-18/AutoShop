
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCarritoStore } from './carrito'

export const usePedidosStore = defineStore('pedidos', () => {
  const pedidos = ref([])
  const carritoStore = useCarritoStore()

  
  const totalPedidos = computed(() => pedidos.value.length)


  function agregarPedido(pedido) {
  pedidos.value.push(pedido)

  const productosComprados = pedido.items.map(item => item.id)
  carritoStore.removePurchasedItems(productosComprados)
}

  function buscarPedido(id) {
    return pedidos.value.find(pedido => pedido.id === id)
  }

  return {
    pedidos,
    totalPedidos,
    agregarPedido,
    buscarPedido
  }
})
