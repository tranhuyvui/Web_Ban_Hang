<template>
  <div class="find-page">
    <div class="not-found" v-if="listSeach.length === 0">
      <h3>Không tìm thấy sản phẩm</h3>
    </div>
    <div v-else class="form-product">
      <ProductItem v-for="product in listSeach" :key="product.ProductID" :product="product" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProductItem from '@/components/product/ProductItem.vue';
import { Product } from '@/stores/productStore';
const listSeach = ref<Product[]>([]);

const route = useRoute();
const checkList = ref(false);
async function fetchSearch() {
  try {
    const keyword = route.query.name || '';
    const res = await axios.get('http://localhost:3000/api/products/find-product', {
      params: { name: keyword }
    });
    checkList.value = listSeach.value.length > 0;
    listSeach.value = res.data;
  } catch (err) {
    console.log('Lỗi khi tìm kiếm sản phẩm', err);
    checkList.value = false;
    listSeach.value = [];
  }
}

watch(() => route.query.name, fetchSearch);
onMounted(fetchSearch);
</script>
<style scoped>
.find-page {
  width: 100%;
  height: auto;
}
.form-product {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  justify-content: center;
  gap: 10px;
}
.not-found {
  height: 60vh;
  text-align: center;
  color: red;
  margin-top: 50px;
}
</style>
