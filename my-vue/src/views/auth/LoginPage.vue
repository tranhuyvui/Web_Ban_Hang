<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Đăng nhập tài khoản</h2>
      <input type="text" v-model="username" placeholder="Tài khoản" />
      <input type="password" v-model="password" placeholder="Mật khẩu" />
      <button @click="handleLogin">Đăng nhập</button>
      <p v-if="errorMessages" class="error">{{ errorMessages }}</p>
      <a href="/register">Bạn chưa có tài khoản? Đăng ký</a>
      <a href="/forgot-password/sendOtp">Quên mật khẩu</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore();
const username = ref('')
const password = ref('')
const errorMessages = ref('')
const router = useRouter()

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessages.value = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'
    return
  }

  try {
    await authStore.login(username.value, password.value)
    alert('Đăng nhập thành công')
    errorMessages.value = ''
    router.push('/home')
  } catch (err: any) {
    errorMessages.value = err.message || 'Đăng nhập thất bại!';
  }
}
</script>

<style scoped>
h2 {
  margin: 20px auto;
}
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(84, 164, 165);
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.login-container h2 {
  color: #db2525;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 5px auto;
  width: 100%;
  max-width: 350px;
  gap: 7px;
  background: white;
  border-radius: 9px;
}

input {
  padding: 10px;
  margin: 7px auto;
  border-radius: 4px;
  border: solid 1px #333;
  width: 60%;
}



button {
  padding: 10px;
  width: 40%;
  color: white;
  background-color: rgb(49, 49, 230);
  margin: 20px auto;
  border-radius: 5px;
}

button:hover {
  background-color: rgb(32, 32, 171);
}

.error {
  color: red;
  margin: 5px auto;
  font-size: 14px;
}

a{
  text-align: center;
  color: rgb(41, 41, 196);
}
</style>
