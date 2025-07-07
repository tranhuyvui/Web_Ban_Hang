import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

import LoginPage from '../views/auth/LoginPage.vue';
import ProductPage from '@/views/product/ProductPage.vue';
import OrderPage from '../views/orders/OrderPage.vue';
import HomePage from '../views/home/HomePage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue';
import OtpPage from '@/views/auth/OtpPage.vue';
import ResetPasswordPage from '@/views/auth/ResetPasswordPage.vue';
import SendMailPage from '@/views/auth/SendMailPage.vue';
import ProfilePage from '@/views/auth/ProfilePage.vue';
import SeacrhProductPage from '@/views/product/SeacrhProductPage.vue';
import ProductDetail from '@/components/product/ProductDetail.vue';
import ShoppingCart from '@/views/carts/ShoppingCartPage.vue';


const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/register/verify', name: 'OTP', component: OtpPage },
  { path: '/forgot-password/sendOtp', name: 'SendMail', component: SendMailPage },
  { path: '/forgot-password/verify', name: 'VerifyOtpForgot', component: OtpPage },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordPage },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'products', name: 'Products', component: ProductPage },
      { path: 'orders', name: 'Orders', component: OrderPage },
      { path: 'home', name: 'Home', component: HomePage },
      { path: 'product/:id', name: 'ProductDetail', component: ProductDetail },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: 'search', name: 'Search', component: SeacrhProductPage },
      { path: 'shoppingcart', name: 'ShoppingCart', component: ShoppingCart, meta: {requireAuth: true} }
      // {}
      // {}
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
import { useAuthStore } from '@/stores/authStore'

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isLoggedIn) {
    alert('Vui lòng đăng nhập để tiếp tục.')
    next('/login')
  } else {
    next()
  }
})


export default router;
