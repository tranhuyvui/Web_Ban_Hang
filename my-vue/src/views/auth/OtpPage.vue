<template>
    <div class="otp-page">
        <div class="otp-form">
            <h3>Xác nhận OTP</h3>
            <input type="text" v-model="OTP" placeholder="Mã OTP">
            <div class="btn">
                <button @click="handleRegisterVerify">Xác nhận</button>
            </div>
            <p>{{ errorMessages }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const OTP = ref('');
const errorMessages = ref('');
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

async function handleRegisterVerify() {
    if (!OTP.value) {
        errorMessages.value = 'Vui lòng nhập mã OTP!';
        return;
    }
    try {
        if (route.name === "VerifyOtpForgot") {
            const res = await authStore.verifyOtpFotgot(OTP.value);
            if (res.status === 200) {
                alert('Xác nhận Email thành công!');
                router.push('/reset-password');
                return;   

            }
        }
        else {
            const res = await authStore.verifyOtpRegister(OTP.value);
            if (res.status === 200) {
                alert('Đăng ký tài khoản thành công!');
                router.push('/login');
                return;   
    
            }
        }
        
    } catch (err : any) {
        errorMessages.value = err.response?.data?.message || 'Lỗi đăng ký tài khoản';
    }
}
</script>
<style scoped>
.otp-page{
    background-color: aliceblue;
    display: flex;
    justify-content: center;
    justify-items: center;
    height: 100vh;
    
}
.otp-form{
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    background-color: rgb(232, 232, 223);
    width: 400px;
    height: 200px;
    border-radius: 10px;
    border: 1px solid #333;
}
p{
    color: red;
}
h3{
    font-size: 25px;
}
input{
    font-size: 15px;
    border-radius: 6px;
}
button{
    padding: 5px;
    margin-top: 10px;
    width: 100px;
    border-radius: 5px;
    background-color: rgb(79, 120, 232);
    color: white;
    
}
</style>