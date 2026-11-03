<script setup>
defineProps({})
defineEmits([])
</script>

<template>
  <footer class="footer">
    <div class="footer-section footer-store">
      <RouterLink class="footer-brand" to="/" aria-label="AutoShop, ir al inicio">
        <img src="../assets/autoshop-logo.png" alt="" class="footer-logo">
        <span>AutoShop</span>
      </RouterLink>
      <p>Tu próxima aventura comienza aquí.</p>
    </div>

    <div class="footer-section">
      <h2>Personal</h2>
      <ul class="footer-staff">
        <li><strong>Alex Gómez</strong><span>Asesor comercial</span></li>
        <li><strong>María Fernanda López</strong><span>Gerente general</span></li>
        <li><strong>José Armando Mercado</strong><span>Coordinador de inventario</span></li>
        <li><strong>Daniel Hoyos</strong><span>Director de marketing</span></li>
      </ul>
    </div>

    <div class="footer-section">
      <h2>Contacto</h2>
      <a href="tel:123456789">123 456 789</a>
      <a href="mailto:AutoShop@gmail.com">AutoShop@gmail.com</a>
    </div>

    <div class="footer-section">
      <h2>Síguenos</h2>
      <a href="https://www.instagram.com/aut_oshop01/" target="_blank" rel="noopener noreferrer">@aut_oshop01</a>
    </div>
  </footer>
</template>
