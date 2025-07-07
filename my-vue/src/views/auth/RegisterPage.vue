<template>
    <div class="register-page">
        <div class="register-form">
            <h3>Đăng ký tài khoản</h3>
            <input type="text" v-model="FullName" placeholder="Họ và tên">
            <input type="text" v-model="Username" placeholder="Tài khoản">
            <input type="password" v-model="Password" placeholder="Mật khẩu">
            <input type="text" v-model="Email" placeholder="Email">
            <button @click="handleRegister">Đăng ký</button>
            <p>{{ errorMessages }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const FullName = ref('');
const Username = ref('')
const Password = ref('');
const Email = ref('');
const errorMessages = ref('');
const router = useRouter();

const authStore = useAuthStore();
async function handleRegister() {
    if (!FullName.value || !Username.value || !Password.value || !Email.value) {
        errorMessages.value = 'Vui lòng nhập đủ thông tin!';
        return;
    }
    try {
        const res = await authStore.registerAccount(FullName.value, Username.value, Password.value, Email.value);
            alert('Đã gửi OTP đến Email của bạn!');
            
            router.push('/register/verify');
        
        // errorMessages.value = res.data.message;
        
        
    } catch (err : any) {
        errorMessages.value = err.response?.data?.message || 'Lỗi đăng ký tài khoản';
    }

    
}
</script>

<style scoped>
h3 {
  margin: 20px auto;
  font-size: 25px;
  color: red;
}
p{
    text-align: center;
    color: red;

}
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #8e8e8e;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}
.register-form {
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
  margin: 20px auto 0 auto;
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