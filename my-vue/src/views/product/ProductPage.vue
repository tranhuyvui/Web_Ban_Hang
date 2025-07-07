<template>
  <div class="product-page">
    <div class="product-list">
      <div class="add-product" v-if="isAdmin" @click="handleForm">
        <div class="image"> 
          <img :src="getImage()" alt="">
        </div>
        <div class="info">
          <strong>Thêm sản phẩm</strong>
        </div>
      </div>
      <ProductItem
        v-for="item in productStore.products"
        :key="item.ProductID"
        :product="item"
        :width="'200px'"
        :height="'300px'"
        @delete="handleDelete"
        @edit="handleEdit"
      />
      <div ref="bottonElement"></div>
      <ProductForm
        v-if="showForm"
        :editing-product="editingProduct"
        @close="closeForm"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, } from 'vue';
import { useProductStore } from '@/stores/productStore';
import ProductItem from '@/components/product/ProductItem.vue';
import ProductForm from '@/components/product/ProductForm.vue';
import type { Product } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();
const productStore = useProductStore();
const isAdmin = ref(localStorage.getItem('Role') === 'Admin');
onMounted(async () => {
  await productStore.fetchProducts();
  if (isAdmin.value) {
    await cartStore.fetchCarts();
  }
});


function handleDelete(id: number) {
  productStore.deleteProduct(id);
}
function getImage() {
  const img = 'uploads/images/plusAdmin.png';
  return /^https?:\/\//.test(img) ? img : 'http://localhost:3000/' + img;
}

const showForm = ref(false)
const editingProduct = ref<Product | null>(null)

function handleForm() {
  editingProduct.value = null
  showForm.value = true
}

function handleEdit(product: Product) {
  editingProduct.value = product
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
}


</script>

<style scoped>
.add-product{
  width: 200px;
  height: 320px;
  background-color: rgb(90, 179, 114);
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.image{
  width: 100%;
  height: 70%;
}
.image img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.info {
  width: 100%;
  height: 30%;
  margin-top: 20px;
  /* display: flex;
  justify-content: center;
  justify-items: center;
  align-items: center;
   */
}
.info strong{
  width: 100%;
  height: 100%;
  color: red;
}


.product-page {
  padding-top: 30px;
  text-align: center;
  /* background-color: #dfe7be; */
  margin: 10px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
}

</style>
