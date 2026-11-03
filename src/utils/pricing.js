export function discountedValue(value, discount = 0) {
  return value * (1 - discount / 100)
}
