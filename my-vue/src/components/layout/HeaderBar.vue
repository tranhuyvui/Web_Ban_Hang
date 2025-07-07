<template>
    <header class="header-bar">
        <div class="brand">
            <!-- <img :src="getImage()" alt="logo"> -->
             <h2>Vui Store</h2>
        </div>
        <div class="search-container">
            <input type="text" v-model="findProduct" @keyup.prevent="handleFindProduct"  placeholder="Tìm kiếm sản phẩm...">
            <button @click="handleFindProduct" ><i class="fa-solid fa-search"></i></button>
            
        </div>
        <div class="actions">
            <button @click="goToShoppingCart" class="action-btn">
                <div  class="cart">
                    <div class="cart-quantity">
                        <i class="fa-solid fa-shopping-cart"></i>
                        <span class="badge-quantity">{{ cartCount }}</span>
                    </div>
                    <div>

                        <span >Giỏ hàng</span>
                    </div>

                </div>
            </button>
            <div class="account-wrapper" @click="toggleMenu">
                <button class="action-btn">
                    <div class="account">
                        <i class="fa-solid fa-user"></i>
                        <span>Tài khoản</span>

                    </div>
                </button>
                <div v-if="menuOpen" class="account-menu">
                    <ul>
                        <template v-if="!auth.isLoggedIn">
                            <li @click="goto('/login')"><i class="fa-solid fa-right-to-bracket"></i>Đăng nhập</li>
                            <li @click="goto('/register')"><i class="fa-solid fa-user-plus"></i>Đăng ký</li>

                        </template>
                        <template v-else>
                            <li><i class="fa-solid fa-user"></i>{{ fullname }}</li>
                            <li @click="goto('/profile')"><i class="fa-solid fa-id-card"></i>Thông tin tài khoản</li>
                            <li @click="goto('/orders')"><i class="fa-solid fa-box"></i>{{ isAdmin === 'Admin' ? 'Quản lý đơn hàng' : 'Đơn hàng của tôi'}}</li>
                            <li @click="logout"><i class="fa-solid fa-right-from-bracket"></i>Đăng xuất</li>
                        </template>
                    </ul>
                </div>

            </div>

        </div>
    </header>
    <nav class="main-navbar">
      <router-link
        v-for="item in menuItems"
        :key="item.label"
        :to="item.path"
        class="nav-item"
      >
        <span>{{ item.label }}</span>
        <i :class="item.icon"></i>
      </router-link>
    </nav>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

function goToShoppingCart() {
    router.push('/shoppingcart');
}
const menuItems = [
    { icon: 'fa-solid fa-house', label: 'Trang chủ', path: '/home' },
    { icon: 'fa-solid fa-box-open', label: 'Sản phẩm', path: '/products' }
    // { icon: 'fa-solid fa-info-circle', label: 'Giới thiệu', path: '/about' }
]
function getImage() {
    return 'http://localhost:3000/uploads/images/logo.png'
}
const findProduct = ref('');
const auth = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();
const menuOpen = ref(false);
const isLoggedIn = ref(false);
const isAdmin = ref(localStorage.getItem('Role'));

const fullname = ref(localStorage.getItem('fullname') || '');
const toggleMenu = () =>{
    menuOpen.value = !menuOpen.value;
}
const cartCount = computed(() => {
    return cartStore.carts.length;
})
const goto = (path : string) => {
    menuOpen.value = false;
    router.push(path);
}
onMounted(() => {
    fullname.value = localStorage.getItem('fullname') || '';
})
const logout = () => {
    auth.logout();
    isLoggedIn.value = false;
    menuOpen.value = false;
    localStorage.removeItem('token')
    localStorage.removeItem('Role')
    router.push('/home');
    alert('Đã đăng xuất');
}
async function handleFindProduct() {
    if (!findProduct.value.trim()) {
        return;
    }
    router.push({path: '/search', query: {name: findProduct.value}})
}

</script>

<style scoped>
.cart{
    display: flex;
    flex-direction: column;
    /* gap: 5px; */
    align-items: center;
}
.cart i{
    font-size: 20px;
}
.account{
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.account i{
    font-size: 20px;
}
.cart-quantity{
    display: flex;
    flex-direction: row;
}
.badge-quantity{
    /* background: red; */
    color: red;
    
    /* margin-bottom: px; */
    
}

.header-bar{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 5px 32px;
    border-bottom: 1px solid #ddd;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    /* border-bottom: ; */
    background-color: #fff8f0;
    border-bottom: 2px solid #eee;
}

.brand h2{
    font-family: 'Dancing Scrips', cursive;
}
.search-container{
    flex: 1;
    max-width: 500px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.search-container input{
    padding: 6px 10px;
    flex: 1;
    border-radius: 6px;
    border: 1px solid #ccc;
    outline: none;
}
.search-container button{
    padding: 8px 12px;
    background-color: #f59e0b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
.actions{
    display: flex;
    gap: 16px;
    margin-right: 50px;
    /* justify-content: center; */
    align-items: center;
}
.action-btn{
    display: flex;
    align-items: center;
    background-color: transparent;
    color: #333;
    border: none;
    font-size: 14px;
    cursor: pointer;
    padding: 6px 10px;
    /* position: relative; */
    transition: 0.2s ease;
}


.action-btn:hover{
    color: #f59e0b;
}
.account-wrapper{
    position: relative;
    margin-right: 10px;
}
.account-menu{
    position: absolute;
    top: 110%;
    right: -50px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    z-index: 100;
    min-width: 180px;
}
.account-menu ul{
    list-style: none;
    margin: 0;
    padding: 8px 0px;
}
.account-menu li{
    padding: 5px 10px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;

}
.account-menu li:hover{
    background-color: #f9f9f9;
    color: #f59e0b;
}

.main-navbar{
    margin-top: 75px;
    width: 100%;
    /* margin-bottom: 0;
    z-index: 999; */
    background-color: #f6f6f6;
    padding: 12px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    border-bottom: 1px solid #ddd;
}
.nav-item{
    display: flex;
    align-items: center;
    /* color: #f59e0b; */
    gap: 6px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: 0.2 ease;
    text-decoration: none;
}
.nav-item:hover{
    color: #f59e0b;
}
.nav-item i {
    font-size: 18px;
}
.router-link-active{
    color: #f59e0b;
    font-weight: bold;
    border-bottom: 2px solid #f59e0b;
}

</style>