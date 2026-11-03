<script setup>
import { ref } from 'vue'

defineProps({})
defineEmits([])

const isSuggestionOpen = ref(false)
const suggestion = ref('')
const suggestionReady = ref(false)
const staff = [
  { name: 'Alex Gómez', role: 'Asesor comercial' },
  { name: 'María Fernanda López', role: 'Gerente general' },
  { name: 'José Armando Mercado', role: 'Coordinador de inventario' },
  { name: 'Daniel Hoyos', role: 'Director de marketing' }
]

function openSuggestion() {
  suggestion.value = ''
  suggestionReady.value = false
  isSuggestionOpen.value = true
}

function sendSuggestion() {
  suggestionReady.value = true
}
</script>

<template>
  <section class="about-page">
    <div class="page-intro">
      <p class="eyebrow">ESTAMOS PARA AYUDARTE</p>
      <h1>Contáctanos</h1>
      <p>En AutoShop nos apasiona ayudarte a encontrar tu próximo auto.</p>
    </div>
    <div class="about-card">
      <div class="about-card-heading">
        <svg class="about-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
        </svg>
        <button class="primary-button suggestion-button" type="button" @click="openSuggestion">Enviar sugerencia</button>
      </div>
      <h2>AutoShop</h2>
      <p>Encuentra el auto ideal para cada estilo de vida y disfruta el camino.</p>
      <div class="contact-placeholder">
        <p><strong>Teléfono:</strong> <a href="tel:123456789">123 456 789</a></p>
        <p><strong>Correo electrónico:</strong> <a href="mailto:AutoShop@gmail.com">AutoShop@gmail.com</a></p>
        <p><strong>Ubicación:</strong> Montería, Córdoba, Colombia.</p>
        <p><strong>Horario de atención:</strong> Lunes a sábado, de 7:00 a. m. a 6:00 p. m.</p>
        <p><strong>Instagram:</strong> <a href="https://www.instagram.com/aut_oshop01/" target="_blank" rel="noopener noreferrer">@aut_oshop01</a></p>
      </div>
    </div>

    <section class="staff-section" aria-labelledby="staff-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">NUESTRO EQUIPO</p>
          <h2 id="staff-title">Personal</h2>
        </div>
      </div>
      <div class="staff-grid">
        <article v-for="member in staff" :key="member.name" class="staff-card">
          <span class="staff-avatar" aria-hidden="true">{{ member.name.charAt(0) }}</span>
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </article>
      </div>
    </section>

    <Transition name="fade">
      <div v-if="isSuggestionOpen" class="overlay suggestion-overlay" @click.self="isSuggestionOpen = false">
        <section class="suggestion-modal" role="dialog" aria-modal="true" aria-labelledby="suggestion-title">
          <div class="modal-heading">
            <div>
              <svg class="modal-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
              </svg>
              <h2 id="suggestion-title">Enviar sugerencia</h2>
            </div>
            <button class="icon-button" type="button" aria-label="Cerrar ventana" @click="isSuggestionOpen = false">×</button>
          </div>

          <template v-if="!suggestionReady">
            <p class="modal-description">Cuéntanos tu queja o sugerencia.</p>
            <form @submit.prevent="sendSuggestion">
              <label for="suggestion-message">Tu mensaje</label>
              <textarea
                id="suggestion-message"
                v-model="suggestion"
                rows="5"
                required
                maxlength="2000"
                placeholder="Escribe aquí tu queja o sugerencia"
              ></textarea>
              <button class="primary-button confirm-button" type="submit">Enviar</button>
            </form>
          </template>
          <div v-else class="suggestion-success" role="status">
            <p>Gracias por tu sugerencia, mensaje enviado.</p>
            <button class="primary-button confirm-button" type="button" @click="isSuggestionOpen = false">Cerrar</button>
          </div>
        </section>
      </div>
    </Transition>
  </section>
</template>
