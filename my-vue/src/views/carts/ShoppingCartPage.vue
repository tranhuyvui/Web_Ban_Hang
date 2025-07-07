<template>
    <div class="shopping-cart">
        <h2>Giỏ hàng của bạn</h2>
        <div v-if="cartStore.carts.length === 0">
            <h2>Bạn chưa thêm sản phẩm nào vào giỏ hàng</h2>

        </div>
        <div v-else>
            <div class="checkboxAll">
                <div class="selectAll">
                    <input type="checkbox" :checked="isAllChecked" @change="changeCheckboxAll">
                    <p>Tất cả sản phẩm: </p>
    
                </div>
                <div class="deleteAll">
                    <button @click="handleDeleteAll"><i class="fa-solid fa-trash"></i></button>
                    <p>Xóa tất cả: </p>
                </div>
            </div>
            <div class="info-shopping-cart"
            v-for="item in cartStore.carts"
            :key="item.CartID"
            :Cart="item"
            >
            <div class="checkbox-product">
                <input type="checkbox"
                :value="item.CartID"
                v-model="selectedCarts"
                >
            </div>
                <div class="info-product" @click="handleDetail(item.Product.ProductID)">
                    <div class="image-product">
                        <img :src="getImage(item.Product.Image || '')" alt="Ảnh sản phẩm">
                    </div>
                    <div class="info-product-name">
                        <strong>Sản phẩm: {{ item.Product.ProductName }}</strong>
                        <div class="container-quantity">
                            <p>Số lượng: </p>
                            <div class="quantity" @click.stop>
                                <button @click="item.Product.Quantity = Math.max(1, item.Product.Quantity - 1)"><i class="fa-solid fa-minus"></i></button>
                                <input type="number" v-model="item.Product.Quantity" readonly>
                                <button @click="increaseQuantity(item)">
                                <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
    
                        </div>
                    </div>
    
                </div>
                <div class="price-product">
                    <p v-if="item.Product.Sale > 0" class="old-price">Giá cũ: <s>{{ formatPrice(item.Product.Price) }}</s></p>
                    <p v-if="item.Product.Sale > 0" class="sale-tag">Giảm giá: -{{ item.Product.Sale }}%</p>
                    <p class="new-price">Giá mới: {{ formatPrice(item.Product.Price * (100 - item.Product.Sale) / 100) }}</p>
                    <strong>Tổng tiền: {{ formatPrice((item.Product.Price * (100 - item.Product.Sale) / 100)* item.Product.Quantity)  }}</strong>
                </div>
                <div class="btn-product">
                    <button @click="handleDeleteById(item.CartID)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="container-total-price">
                <div class="address-container">
                    <div class="info-user">
                        <p>Họ tên: </p>
                        <p>Huy Vui</p>
                    </div>
                    <div class="address">
                        <p><i class="fa-solid fa-location-dot"></i>  Địa chỉ: </p>
                        <input type="text" v-model="ShippingAddress" placeholder="Nhập địa chỉ...">
    
                    </div>
                    <div class="address">
                        <p class="SDT"><i class="fa-solid fa-phone"></i>SDT:</p>
                        <input type="text" v-model="Phone"  placeholder="Nhập số điện thoại...">
                
                    </div>
                </div>
                <div class="orders">   
                    <p>Tổng tiền:{{ totalPriceOrder }} </p>
                    <button @click="submitOrders">Đặt hàng</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from 'vue'

const selectedCarts = ref<number[]>([]);

import { useProductStore } from '@/stores/productStore';
import { useCartStore, Cart } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import router from '@/router';
const orderStore = useOrderStore();
const productStore = useProductStore();
const cartStore = useCartStore();

function handleDetail(id: number) {
    router.push(`/product/${id}`);
}


const totalPriceOrder = computed(() => {
    const totalPriceOrderTmp =  cartStore.carts
        .filter(item => selectedCarts.value.includes(item.CartID))
        .reduce((total, item) => {
            const countPrice = item.Product.Price * (100 - item.Product.Sale) / 100;
            return total + countPrice * item.Product.Quantity;
        }, 0)
    return totalPriceOrderTmp.toLocaleString('vi-VN') + 'đ'
})

const ShippingAddress = ref(localStorage.getItem('address') || '');
const Phone = ref(localStorage.getItem('phone') || '');

const isAllChecked = computed(() => {
  return cartStore.carts.length > 0 &&
         selectedCarts.value.length === cartStore.carts.length
})

function formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ'
}
function changeCheckboxAll() {
    if (!isAllChecked.value) {
        selectedCarts.value = cartStore.carts.map(item => item.CartID);
    }
    else {
        selectedCarts.value = [];
    }
}

async function handleDeleteAll() {
    try {
        await cartStore.deleteAllCart();
    } catch (err) {
        console.log("Lỗi khi xóa tất cả giỏ hàng", err);
        
    }
}
async function handleDeleteById(id: number) {
    try {
        await cartStore.deleteCartById(id);
        await fetchCarts();
    } catch (err) {
        console.log("Lỗi khi xóa tất cả giỏ hàng", err);
        
    }
}
async function submitOrders() {
    try {
        if (selectedCarts.value.length === 0) {
            return;
        }
        if (!Phone.value || !ShippingAddress.value) {
            alert('Vui lòng nhập địa chỉ');
            return;
        }
        for (let i = 0; i < selectedCarts.value.length; i++) {
            console.log(cartStore.carts);
            const index = cartStore.carts.findIndex(p => p.CartID === selectedCarts.value[i]);
            if (index != -1) {
                await cartStore.updateCartById(selectedCarts.value[i], cartStore.carts[index].Product.Quantity);
            }
            await orderStore.addOrder(selectedCarts.value[i], ShippingAddress.value, Phone.value)
        }
        if (localStorage.getItem('address') === '') {
            localStorage.setItem('address', ShippingAddress.value)
            localStorage.setItem('phone', Phone.value);
        }
        alert("Đặt hàng thành công!");
        await fetchCarts();
    } catch (err : any) {
        console.log(err);
        
    }
}
function increaseQuantity(item: Cart) {
  const productInStore = productStore.products.find(p => p.ProductID === item.Product.ProductID);
  const stock = productInStore?.Stock ?? 1;
  item.Product.Quantity = Math.min(item.Product.Quantity + 1, stock);
}

onMounted(async () => {
    await productStore.fetchProducts();
    await fetchCarts();
});
async function fetchCarts() {
    try {
        await cartStore.fetchCarts();
            
    } catch (err: any) {
        console.log(err.response?.data?.message);
    }
}
function getImage(str: string) {
    if (str) {
        return /^https?:\/\//.test(str) ? str : 'http://localhost:3000/' + str
    }
    else {
        // reutrn '';
    }
}
</script>

<style scoped>
.sale-tag{
    color: red;
    font-size: 19px;
}
.new-price{
    font-size: 18px;
    color: red;
}
.checkboxAll{
    display: flex;
    flex-direction: row;
    margin-left: 130px;
    margin-right: 55px;
    /* gap: 10px; */
    justify-content: space-between;
    /* padding: 50px; */
    
    align-items: center;
}
.checkboxAll p{
    font-size: 20px;
}
.checkboxAll input{
    width: 20px;
    height: 20px;   
}
.selectAll{
    display: flex;
    flex-direction: row;
    gap: 5px;
}
.deleteAll{
    display: flex;
    flex-direction: row;
    gap: 5px;
}
.deleteAll button{
    border: none;
    font-size: 20px;
}

.shopping-cart{
    display: flex;
    flex-direction: column;
    background-color: rgb(224, 241, 241);
    width: 70%;
    margin: 0 auto;
    
}
h2{
    color: brown;
    text-align: center;
    margin: 50px auto;
}
.info-shopping-cart{
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* align-items: sp; */
    gap: 50px;
    justify-content: center;
    background-color: #f4efe8;
    padding: 30px;
    /* gap: 10px; */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 14px;
    height: 200px;
}

.info-product{
    border: solid 1px #333;
    border-radius: 11px;
    display: flex;
    flex-direction: row;
    gap: 30px;
    width: 50%;
    justify-items: center;
    justify-content: center;
}
.price-product{
    border: solid 1px #333;
    border-radius: 7px;
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    justify-content: space-between;
    /* padding: 30px; */
}
.btn-product{
    width: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn-product button{
    font-size: 19px;
    border: none;
}
.checkbox-product{
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.checkbox-product input{
    width: 20px;
    height: 20px;
}
.info-product-name{
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    padding: 20px;
}
.info-product-name strong{
    font-size: 20px;
}
.info-product-name p{
    font-size: 20px;
}
.container-quantity input{
    padding: 3px;
    width: auto;
    text-align: center;
    max-width: 50px;
    min-width: 10px;
}
.container-quantity{
    display: flex;
    flex-direction: row;
    gap: 5px;
    width: auto;
    /* justify-content: ; */
    align-items: center;
    /* border-radius: 10px; */
}
.quantity{
    border: solid 1px #333;
    padding: 1px;
    width: auto;
    border-radius: 3px;
}
.quantity button{
    width: 20px;
    background-color: transparent;
    border: none;
}
.image-product {
    padding: 5px;
}
.image-product img{
    height: 100%;
    border-radius: 3px;
}
.container-total-price {
  /* 
  bottom: 0;
  left: -50%;
  transform: translateX(-50%);
  */
  bottom: 0px;
  position: fixed;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1); 
  height: 120px;
  padding: 20px 50px;
  border: solid 3px #333;
  border-radius: 10px;
  width: 68%;
  display: flex;
  justify-content: space-between;
  background-color: #f1f1f1;
  margin: 0 auto;
  align-items: center;
}

.address-container{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 60%;
}
.address-container p{
    font-size: 20px;
    /* border: ; */

}
.address{
    display: flex;
    flex-direction: row;
}
.address input{
    border-radius: 5px;
    width: 50%;
    padding: 5px;
    border: solid 1px #333;
}
.orders{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.orders p{
    font-size: 20px;
}

.orders button{
    font-size: 15px;
    padding: 3px;
    border-radius: 4px;
    background-color: crimson;
    color: white;
}
.SDT{
    margin-right: 20px;
}
.info-user{
    display: flex;
    flex-direction: row;
    /* justify-content: center; */
    gap: 20px;
    margin-left: 25px;
}
.change-address input{
    width: 20px;
    height: 20px;
}

</style>