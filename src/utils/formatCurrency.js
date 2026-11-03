const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP'
})

export function formatCurrency(value) {
  return copFormatter.format(value)
}
