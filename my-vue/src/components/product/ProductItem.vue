<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image">
      <img :src="getImage(product.Image)" alt="sản phẩm" />
      <div v-if="product.Sale > 0" class="sale-badge">
        -{{ product.Sale }}%
      </div>
    </div>
    <div class="product-info">
      <h3>{{ product.ProductName }}</h3>
      <p class="desc">{{ product.Description }}</p>
      <div class="container-price">
        <div class="container-sale" >
          <p class="price-old" v-if="product.Sale > 0">{{ formatPrice(product.Price) }}</p>
          <!-- <p class="Sale">Sale: {{ product.Sale }}%</p> -->
          <strong >{{ formatPrice(product.Price * (100 - product.Sale) /100) }}</strong>
        </div>
        <div class="price-new" @click.stop v-if="product.Stock > 0">
          <button @click="handleAddToCart" v-if="!isAdmin"><i class="fa-solid fa-cart-shopping"></i> Thêm giỏ hàng</button>
        </div>
      </div>
      <p class="stock-out" v-if="product.Stock <= 0">Hết hàng</p>
      <div class="btn" v-if="isAdmin&& route.path=='/products'" @click.stop>
        <button class="edit-btn" @click="handleEdit">Sửa</button>
        <button v-if="!product.IsDeleted" class="delete-btn" @click="handleDelete">Xóa</button>
        <p class="deleted" v-if="product.IsDeleted">Đã bị xóa</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore, Product } from '@/stores/productStore'
import router from '@/router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const quantity = ref(1)
const isAdmin = localStorage.getItem('Role') === 'Admin'
const productStore = useProductStore()
const authStore = useAuthStore();
function goToDetail() {
  router.push(`/product/${props.product.ProductID}`);
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits(['edit', 'delete'])

const cartStore = useCartStore();

async function handleAddToCart() {
    if (!authStore.isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm giỏ hàng!');
        return;
    }
    try {
        await cartStore.addCart(props.product.ProductID, quantity.value);
        alert('Thêm vào giỏ thành công!');

    } catch (err) {
        alert('Lỗi thêm giỏ hàng')
        console.log(err);
    }
}

function handleEdit() {
  emit('edit', props.product)
}

function handleDelete() {
  emit('delete', props.product.ProductID)
}

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ'
}

function getImage(str: string): string {
  return /^https?:\/\//.test(str) ? str : 'http://localhost:3000/' + str
}

</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 320px;
  transition: 0.3s;
}
.sale-badge {
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: red;
  color: white;
  font-size: 14px;
  padding: 4px 4px;
  border-radius: 4px;
  font-weight: bold;
}
.product-card:hover {
  transform: scale(1.01);
}
.product-image{
  height: 60%;
  padding: 5px;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid rgb(255, 0, 30);
}
.product-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  /* justify-content: space-between; */
  /* background-color: #ffffff; */
  height: 40%;
}
.container-price{
  display: flex;
  gap: 6px;
  flex-direction: column;
}
.container-sale{
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
}
.container-sale strong{
  color: red;
}
.Sale{
  color: red;
}
.price-old{
  text-decoration: line-through;
}
.price-new{
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  margin-top: 5px;
  /* background-color: aliceblue; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
}
.price-new button{
  color: rgb(223, 135, 19);
  border: none;
  background-color: transparent;
  font-size: 17px;
}
.price-new button:hover{
  color: rgb(231, 96, 13);
}


h3{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.desc {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
  padding-right: 8px;
}
.btn {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}
.edit-btn,
.delete-btn {
  border-radius: 5px;
  border: none;
  background-color: rgb(78, 78, 219);
  color: white;
  cursor: pointer;
  width: 50px;
}
.delete-btn {
  background-color: red;
}
.stock-out {
  color: red;
  font-weight: bold;
  text-align: center;
}
/*
.deleted {
  color: red;
  text-align: center; */
/* } */
/* h3 {
  font-size: 16px;
  margin: 0;
}
strong {
  font-size: 16px;
  color: #d32f2f;
}
.stock {
  color: green;
}



.btn-user{
  display: flex;
  gap: 5px;
  justify-content: center;
}
.btn-quantity{
  border: 1px solid;
  border-radius: 5px;
  display: flex;
}

.btn-user button{
  border-radius: 5px;
  padding: 1px;
  background-color: transparent;
  border: none
}
.btn-user input{
  border-radius: 3px;
} */
</style>
