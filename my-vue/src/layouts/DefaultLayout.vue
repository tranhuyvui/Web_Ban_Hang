<template>
  <div>
    <HeaderBar />
    <div class="main-content">
      <router-view />
    </div>
    <!-- <Footer/> -->
     <Footer></Footer>
  </div>
</template>
<script setup lang="ts">
import HeaderBar from '@/components/layout/HeaderBar.vue';
import Footer from '@/components/layout/Footer.vue';
</script>
<style>
.main-content {
  /* margin-top: 60px;  */
  padding: 20px;
  background-color: #fff;
}
</style>
