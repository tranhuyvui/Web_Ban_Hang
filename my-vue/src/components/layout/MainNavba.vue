<!-- <template>
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
  const menuItems = [
    { icon: 'fa-solid fa-house', label: 'Trang chủ', path: '/home' },
    { icon: 'fa-solid fa-box-open', label: 'Sản phẩm', path: '/products' },
    { icon: 'fa-solid fa-gift', label: 'Ưu đãi', path: '/offers' },
    { icon: 'fa-solid fa-phone', label: 'Liên hệ', path: '/contact' },
    { icon: 'fa-solid fa-info-circle', label: 'Giới thiệu', path: '/about' }
  ]
  </script>
<style>
.main-navbar {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
  padding: 12px 0;
  gap: 40px;
  border-bottom: 1px solid #ddd;
}

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: none;
}

.nav-item:hover {
  color: #f59e0b;
}

.nav-item i {
  font-size: 18px;
}

.router-link-active {
  color: #f59e0b;
  font-weight: bold;
  border-bottom: 2px solid #f59e0b;
}
</style> -->
