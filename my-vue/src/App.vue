<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
const auth = useAuthStore();

onMounted(() => {
  auth.initFromStorage();
});
</script>
 