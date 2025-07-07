<template>
    <div class="sendOtp-page">
        <div class="sendOtp-form" >
            <h3>Quên mật khẩu</h3>
            <input type="text" v-model="Email" placeholder="Nhập Email của bạn" >
            <button @click="handleSendOtp">Gửi OTP</button>
            <p>{{ errorMessages }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';

const Email = ref('');
const errorMessages = ref('')
const authStore = useAuthStore();
async function handleSendOtp() {
    if (!Email.value) {
        errorMessages.value = 'Vui lòng nhập Email';
        return;
    }
    try {
      await authStore.sendOtpForgot(Email.value);
        alert('Đã gửi mã OTP đến Email của bạn');
        router.push('/forgot-password/verify')
    } catch (err : any) {
        errorMessages.value = err.message
        console.log(err.response?.data?.message || 'Lỗi gửi Email reset mật khẩu');
    }
}

</script>

<style scoped>

h3 {
  margin: 20px auto;
}
.sendOtp-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(204, 224, 224);
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.sendOtp-form {
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
p {
  color: red;
  margin: 5px auto;
  font-size: 14px;
}

</style>