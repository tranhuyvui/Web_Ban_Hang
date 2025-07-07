<template>
    <div class="reset-password-page">
        <div class="reset-password-form">
            <h3>Đặt lại mật khẩu</h3>
            <input type="password" v-model="Password"  placeholder="Nhập mật khẩu mới">
            <input type="password" v-model="Password1" placeholder="Xác nhận mật khẩu">
            <button @click="handleResetPassword">Xác nhận</button>
            <p>{{ errorMessages }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const Password =  ref('');
const Password1 = ref('');
const errorMessages = ref('');
async function handleResetPassword() {
    if (Password.value !== Password1.value) {
        errorMessages.value = 'Mật khẩu không trùng khớp'
        return;
    }
    try {
        // const res =await axios.post('http://localhost:3000/api/auth/reset-password', {
        //     Password: Password.value
        // })
        await authStore.resetPassword(Password.value);
        alert("Đặt lại mật khẩu thành công");
        
    } catch (err : any) {
        errorMessages.value = err.response?.data?.message || 'lỗi';
        console.log(err.response?.data?.message );
    }
}
</script>
<style scoped>

h3 {
  margin: 20px auto;
}
.reset-password-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(204, 224, 224);
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.reset-password-form {
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