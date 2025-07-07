<template>
    <div class="content">

        <div class="ProductDetail-page">
            <h2>Thông tin chi tiết sản phẩm</h2>
            <div v-if="product" class="ProductDetail-form">
                <div class="ProductDetail-image">
                    <img :src="getImage(product.Image)" alt="Ảnh sản phẩm">
                </div>
                <div class="ProductDetail-info">
                    <h3>{{ product.ProductName }}</h3>
                    <div class="flash-sale">
                        <div class="flash-name">
                            <h3>FLASH SALE</h3>
                            <strong>{{ product.Sale }}%</strong>
                        </div>
                        <div class="flash-price">
                            <strong class="price-new">{{ formatPrice(product.Price * ((100 - product.Sale)/100)) }} </strong>
                            <p class="price-old">{{ formatPrice(product.Price) }}</p>
    
                        </div>
                    </div>
                    <div class="main-content">
    
                        <p>{{ product.Description }}</p>
                        <div v-if="product.Stock <= 0" class="hethang">
                            <p>Hết hàng</p>
                        </div >
                        <div v-else class="btn">
                            <div class="btn-detail">
                                <div class="btn-quantity">
                                    <button @click="quantity = Math.max(1, quantity - 1)"><i class="fa-solid fa-minus"></i></button>
                                    <strong>{{ quantity }}</strong>
                                    <button @click="quantity = Math.min(product.Stock, quantity + 1)"><i class="fa-solid fa-plus"></i></button>
                                    
                                </div>
                                <button class="btn-add" @click="handleAddToCart"><i class="fa-solid fa-cart-arrow-down"></i>Thêm vào giỏ hàng</button>
                                
                            </div>
                            <p class="quantity">Số lượng còn {{ product.Stock }}</p>

                        </div>
                    </div>
                </div>
            </div>
    
        </div>
        <div class="right-content-main" >
            <h3>Sản phẩm nổi bật</h3>
            <div v-for="item in ListProductSale.slice(0, 4)"
            :key="item.ProductID"
            :product="item"
            >
                <div class="right-content" @click="goToDetail(item)">
                    <div class="right-image">
                        <img :src="getImage(item.Image)" alt="Ảnh sản phẩm">
                    </div>
                    <div class="right-content-small">
                        <p>{{ item.Sale }}%</p>
                        <h5>{{ item.ProductName }}</h5>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { useProductStore, Product } from '@/stores/productStore';
import axios from 'axios';
import router from '@/router';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const ProductStore = useProductStore();
const authStore = useAuthStore();
const product = ref<Product>();
function getImage(img: string) {
    return /^https?:\/\//.test(img) ? img : 'http://localhost:3000/' + img
}
const ListProductSale = ref<Product[]>([]);
function formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ';
}
function goToDetail(productDetail: Product) {
    quantity.value = 1;
    router.push(`/product/${productDetail.ProductID}`);
}
onMounted( async() => {
    const id = Number(route.params.id);
    await fetchProductDetail(id);
})
async function fetchProductDetail(id: number) {
  const res = await axios.get(`http://localhost:3000/api/products/${id}`);
  product.value = res.data;
    await ProductStore.fetchProducts();
    ListProductSale.value = ProductStore.products
        .sort((a, b) => b.Sale - a.Sale);
}
watch(() => route.params.id, (newId) => {
  fetchProductDetail(Number(newId))
})

const cartStore = useCartStore();
const quantity = ref(1);
async function handleAddToCart() {
    if (!authStore.isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm giỏ hàng!');
        return;
    }
    try {
        await cartStore.addCart(product.value?.ProductID || 1, quantity.value);
        fetchProductDetail(product.value?.ProductID || 1);
        alert('Thêm vào giỏ thành công!');

    } catch (err) {
        alert('Lỗi thêm giỏ hàng')
        console.log(err);
    }
}
</script>
<style scoped>
.content{
    display: flex;
    flex-direction: row;
    width: 90%;
    justify-content: space-between;
}
.right-content-main{
    width: 20%;
    background-color: rgb(205, 212, 212);
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    
}
.hethang{
    color: red;
}
.right-content{
    display: flex;
    flex-direction: row;
    background-color: rgb(245, 240, 240);
    margin: 5px;
    border-radius: 10px;
    height: 100px;
    width: 100%;
    text-align: center;
    padding: 5px;

}
.right-image{
    width: 40%;
    /* width: 100px; */
    background-color: rgb(234, 134, 12);
    /* height: 60px; */
    border-radius: 8px;
    margin: 2px;
}
.right-image img{
    width: 100%;
    height: 100%;
    /* width: 100%;
    

    padding: 3px;
    height: 100%; */
}
.right-content-small{
    width: 60%;
    text-align: center;
    /* align-items: center;
    justify-content: center; */
    /* height: 60px; */
    background-color: rgb(217, 217, 224);
    padding: 7px;
    border-radius: 6px;
}
.right-content-small p{
    color: red;
    /* margin-bottom: 20px; */
    /* text-align: center; */
    /* align-self: center;/ */
    /* align-items: center;
    justify-items: center; */

    width: 100%;
}
/* .right-main-content{
    display: flex;
    flex-direction: row;
} */

.ProductDetail-page{
    display: flex;
    flex-direction: column;
    /* background-color: rgb(206, 230, 230); */
    /* justify-content: center; */
    /* justify-items: center; */
    padding: 10px;
    align-items: center;
    width: 70%;
    margin-left: 30px;
    /* height: 400px */
}
.ProductDetail-page h2{
    margin-top: 30px;
}
.ProductDetail-form{
    display: flex;
    flex-direction: row;
    background-color: rgb(249, 242, 233);
    margin: 10px;
    padding: 10px;
    border-radius: 15px;
    /* border: solid 1px #333; */
    width: 80%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.ProductDetail-image{
    /* background-color: aqua; */
    /* padding: 2px; */
    margin: 10px;
    width: 50%;
}
.ProductDetail-image img{
    width: 100%;
    height: 100%;
    border: solid 1px rgb(63, 44, 30);
    border-radius: 8px;
}
.ProductDetail-info{
    padding: 20px;
    margin: 10px;
    display: flex;
    gap: 5px;
    /* border-radius: 1px s; */
    flex-direction: column;
    border: 1px solid #c06f6f;
    border-radius: 8px;
    width: 50%;

}
.ProductDetail-info h3{
    margin-bottom: 10px;
}
.price-old{
    
    text-decoration: line-through;
    font-size: 10px;
}
.price-new{
    color: red;
}
.btn-detail{
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 15px;
}
.btn-detail input{
    text-align: center;
    width: 20px;
}
.flash-sale{
    display: flex;
    flex-direction: column;
    /* border-radius: 14px; */
}
.flash-name{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 70px;
    padding: 6px;
    /* border-radius: 10px; */
    background-color: rgb(239, 148, 69);
}
.flash-name strong{
    color: red;
    font-size: 20px;
}
.flash-price{
    background-color: rgb(245, 221, 177);
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    gap: 15px;
    padding: 10px;
    /* margin-bottom: 20px; */
}
.main-content{
    align-items: center;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* justify-content: space-between; */
    /* justify-content: center;
    justify-items: cente
    r; */
}
.btn{
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.quantity{
    margin-top: 10px;
    color: red;
}
.btn-quantity{
    display: flex;
    flex-direction: row;
    background-color: azure;
    gap: 4px;
    padding: 1px;
    justify-items: center;
    align-items: center;
    border: solid 1px #333;
    border-radius: 4px;
    background-color: transparent;
    font-size: 16px;
}

.btn-quantity button{
    background-color: transparent;
    border: none;
    /* display: flex;
    flex-direction: row; */
    border-radius: 5px;
}
.btn-add:hover{
    color: rgb(5, 124, 15);
}

</style>