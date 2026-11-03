<script setup>
import CartIcon from './CartIcon.vue'

defineProps({
  cartCount: { type: Number, default: 0 }
})

const emit = defineEmits(['open-cart'])
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <RouterLink class="brand-logo-link" to="/about" aria-label="Ir a Contáctanos">
        <img class="brand-logo" src="../assets/autoshop-logo.png" alt="Logo de AutoShop">
      </RouterLink>
      <RouterLink class="brand-name" to="/">AutoShop</RouterLink>
    </div>

    <nav class="main-nav" aria-label="Navegación principal">
      <RouterLink class="nav-link" active-class="active" exact-active-class="active" to="/">Inicio</RouterLink>
      <RouterLink class="nav-link" active-class="active" to="/categories">Catálogo</RouterLink>
      <RouterLink class="nav-link" active-class="active" to="/promotions">Promociones</RouterLink>
      <RouterLink class="nav-link" active-class="active" to="/account">Yo</RouterLink>
      <RouterLink class="nav-link" active-class="active" to="/about">Contáctanos</RouterLink>
    </nav>

    <CartIcon :count="cartCount" @open-cart="emit('open-cart')" />
  </header>
</template>
