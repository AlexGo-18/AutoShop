# AutoShop - Vue 3

Tienda de autos desarrollada con Vue 3 + Vite.

## Ejecutar
1. Instala Node.js.
2. Abre esta carpeta en VS Code.
3. En la terminal ejecuta:
   ```bash
   npm install
   npm run dev
   ```
4. Abre la dirección local que indique Vite.

## Componentes
- `ProductCard.vue`: tarjeta individual; recibe `product` por props y emite `buy`.
- `ProductList.vue`: recorre el arreglo de productos y muestra las tarjetas.
- `CartIcon.vue`: muestra el contador y emite `open-cart`.
- `ShoppingCart.vue`: muestra los productos agregados, selección, cantidades y total; comunica acciones mediante emits.
- `CheckoutModal.vue`: formulario de compra; emite `confirm`.
- `ToastMessage.vue`: notificación de resultado.

## Estado y cálculos
`App.vue` administra los arreglos reactivos con `ref()`. El carrito guarda cada producto una sola vez y actualiza su propiedad `cantidad` si se vuelve a agregar. Los contadores y totales se calculan con `computed()`. El precio con descuento se calcula antes de agregar el producto.

Las imágenes usan URLs externas de Unsplash, por lo que se necesita conexión a internet para verlas.
