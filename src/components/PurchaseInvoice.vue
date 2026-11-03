<script setup>
import { formatCurrency as money } from '../utils/formatCurrency.js'

defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null }
})

const emit = defineEmits(['new-purchase'])

function formatInvoiceDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open && invoice" class="overlay checkout-overlay receipt-overlay">
      <section class="receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <div class="section-heading invoice-heading">
          <div>
            <p class="eyebrow">COMPRA REALIZADA</p>
            <h2 id="receipt-title">Factura {{ invoice.number }}</h2>
          </div>
          <span class="invoice-summary-total">{{ money(invoice.total) }}</span>
        </div>

        <p class="receipt-date">{{ formatInvoiceDate(invoice.createdAt) }}</p>
        <p class="invoice-customer">
          <strong>Cliente:</strong> {{ invoice.customer.nombre }} · {{ invoice.customer.correo }} · {{ invoice.customer.direccion }}
        </p>

        <div class="invoice-table-wrap">
          <table class="invoice-table">
            <thead>
              <tr>
                <th scope="col">Descripción</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Valor unitario (COP)</th>
                <th scope="col">Descuento</th>
                <th scope="col">Valor con descuento (COP)</th>
                <th scope="col">Subtotal (COP)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in invoice.items" :key="item.id">
                <th scope="row">{{ item.name }}</th>
                <td>{{ item.quantity }}</td>
                <td>{{ money(item.originalUnitPrice) }}</td>
                <td>{{ money(item.unitDiscount) }} ({{ item.discountRate }}%)</td>
                <td>{{ money(item.unitPriceAfterDiscount) }}</td>
                <td>{{ money(item.lineTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dl class="invoice-totals">
          <div><dt>Subtotal</dt><dd>{{ money(invoice.subtotal) }}</dd></div>
          <div>
            <dt>Total de descuentos<span v-if="invoice.couponCode"> (incluye {{ invoice.couponCode }})</span></dt>
            <dd>-{{ money(invoice.totalDiscounts) }}</dd>
          </div>
          <div><dt>Base gravable</dt><dd>{{ money(invoice.taxableBase) }}</dd></div>
          <div><dt>IVA ({{ invoice.taxRate }}%)</dt><dd>{{ money(invoice.tax) }}</dd></div>
          <div class="invoice-final-total"><dt>Total a pagar</dt><dd>{{ money(invoice.total) }}</dd></div>
        </dl>

        <button class="primary-button receipt-new-purchase" @click="emit('new-purchase')">
          Nueva compra
        </button>
      </section>
    </div>
  </Transition>
</template>
