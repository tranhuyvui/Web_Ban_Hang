<template>
    <div class="order-form">
      <input type="number" v-model="form.Quantity" placeholder="Số lượng" />
      <input type="text" v-model="form.Phone" placeholder="Số điện thoại" />
      <input type="text" v-model="form.ShippingAddress" placeholder="Địa chỉ" />
      <select v-model="form.Status">
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Shipped">Shipped</option>
        <option value="Confirmed">Confirmed</option>
      </select>
  
      <div class="actions">
        <button @click="orderStore.updateOrder(form)">Cập nhật</button>
        <button @click="orderStore.clearEditingOrder()">Hủy</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref } from 'vue'
  import { useOrderStore,  EditingOrder } from '@/stores/orderStore'
  
  const orderStore = useOrderStore()
  const form = ref<EditingOrder>({
    ProductID: 0,
    Quantity: 1,
    Phone: '',
    ShippingAddress: '',
    Status: 'Pending',
    Sale: 0
  })
  
  watch(() => orderStore.editingOrder,(val) => {
      form.value = val ? { ...val } : { ProductID: 0, Quantity: 1, Phone: '', ShippingAddress: '', Status: 'Pending', Sale: 0 }
    },
    { immediate: true }
  )
  </script>
  <style scoped>
  .order-form {
    margin-top: 20px;
  }
  input,
  select {
    display: block;
    margin: 8px auto;
    padding: 6px;
    width: 250px;
  }
  .actions {
    margin-top: 10px;
  }
  button {
    margin: 0 5px;
    padding: 6px 12px;
  }
  </style>
  