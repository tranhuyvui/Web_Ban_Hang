<template>
  <div class="home-page">
    <div class="banner">
      <img :src="getImage(imageBaners[currentImage])" alt="Banner" />
    </div>
    <div class="slogan-banner">
      📦 Mua online – Giá cực fine – Nhận cực nhanh
    </div>

    <div class="top-content-container">
      <div class="flash-sale">
        <span class="title">⚡ Flash Sale</span>
      </div>

      <div class="top-content">
        <ProductItem
          v-for="item in productSale"
          :key="item.ProductID"
          :product="item"
          :width="'150px'"
          :height="'240px'"
        />
      </div>
    </div>

    <div class="highlight-section">
      <h2 class="main-title">Sản phẩm nổi bật</h2>
      <div class="highlight-groups">
        <div class="highlight-group">
          <h3 class="group-title">Mới ra mắt</h3>
          <div class="product-list">
            <ProductItem
              v-for="item in productNews.slice(0, 6)"
              :key="item.ProductID"
              :product="item"
            />
          </div>
        </div>
        <div class="kkk"></div>
        <div class="highlight-group">
          <h3 class="group-title">Bán chạy nhất</h3>
          <div class="product-list">
            <ProductItem
              v-for="item in productSellings.slice(0, 6)"
              :key="item.ProductID"
              :product="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Product, useProductStore } from '@/stores/productStore';
import ProductItem from '@/components/product/ProductItem.vue';
import { useCartStore } from '@/stores/cartStore';
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
// import 

const show = ref(false)
function hien() {
  show.value = true;
}
const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const productSellings = ref<Product[]>([]);
const productNews = ref<Product[]>([]);
const productSale = ref<Product[]>([]);

const imageBaners = [
  'uploads/images/banner.png',
  'uploads/images/banner1.png'
]
const currentImage = ref(0);
let intervalID: ReturnType<typeof setInterval>;
  
onMounted(async () => {
  if (authStore.isLoggedIn) {
    await cartStore.fetchCarts();
  }

  await productStore.fetchProducts();
  const res = await productStore.getSellingProducts();
  const data = await productStore.getNewProducts();
  productNews.value = data;
  productSellings.value = res;
  productSale.value = productStore.products
    .filter((p) => p.Sale > 0)
    .sort((a, b) => b.Sale - a.Sale)
    .slice(0, 6);
  intervalID = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % imageBaners.length;
  }, 3000)
});
onUnmounted(() => {
  clearInterval(intervalID);
})
function getImage(img : string) {
  // const img = 'uploads/images/banner1.png';
  return /^https?:\/\//.test(img) ? img : 'http://localhost:3000/' + img;
}
</script>

<style scoped>
.slogan-banner {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  border-radius: 10px;
  margin: 10px auto;
  width: fit-content;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.banner {
  width: 80%;
  height: 300px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
}
.banner img {
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  display: block;
  border-radius: 8px;
}


.top-content-container {
  background-color: #f2edda;
  padding: 15px 20px;
  margin: 40px auto;
  width: 92%;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  border: 2px solid rgb(128, 73, 0);
  flex-direction: column;
  gap: 15px;
}

.flash-sale {
  display: flex;
  align-items: center;
  background-color: transparent;
  padding: 10px 15px;
  font-weight: bold;
  /* background-color: rgb(236, 126, 36); */
  justify-content: center;
  /* font-size: 18px; */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.flash-sale span{
  font-size: 25px;
  color: tomato;
}

.flash-sale .countdown {
  background-color: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-family: monospace;
}

.top-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  background-color: none;
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
  justify-content: space-between;
}

.home-page {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.highlight-section {
  width: 90%;
  margin: 40px auto;
  background-color: rgb(239, 239, 182);
  border-radius: 12px;
  border: 2px solid;
  overflow: auto;
  /* height: 1000px; */
  /* height: 100vh; */
}
.highlight-section h3 {
  margin-bottom: 20px;
  color: red;
  border-bottom: 1px solid #333;
}
.main-title {
  text-align: center;
  font-size: 26px;
  margin-bottom: 30px;
  color: orange;
  font-weight: bold;
}
.kkk {
  margin-top: 35px;
  border: solid 2px red;
  height: 92vh;
}
.highlight-groups {
  display: flex;
  /* gap: 30px; */

  justify-content: space-between;

  text-align: center;
  /* height: 100%; */
  /* margin: 10px; */
}
.highlight-group {
  flex: 1;
  border-radius: 7px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 15px;
  /* display: flex; */
}
.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
</style>
