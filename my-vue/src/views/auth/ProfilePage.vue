<template>
    <div class="profile-page">
        <h2>Đổi thông tin</h2>
        <form class="profile-form">
            <input type="text" v-model="FullName" placeholder="Tên người dùng...">
            <input type="text" v-model="Phone" placeholder="Số điện thoại">
            <input type="text" v-model="Address" placeholder="Địa chỉ">
            
            <div class="pass-current">
                <input type="Password" v-model="Password" placeholder="Nhập mật khẩu hiện tại">
                <a href="">Quên mật khẩu</a>
            </div>

            <button @click="handleUpdateProfile">Xác Nhận</button>
        </form>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const FullName = ref('');
const Phone = ref('');
const Address = ref('');
const Password = ref('');

async function handleUpdateProfile() {
    
    if (!FullName.value && !Phone.value && !Address.value) {
        alert('Không có thuộc tính để đổi!');
        return;
    }
    if (!Password.value) {
        alert('Vui lòng nhập mật khẩu!!');
        return;
    }
    try {
        const res = await axios.put('http://localhost:3000/api/users', {
            FullName: FullName.value,
            Phone: Phone.value,
            Address: Address.value,
            Password: Password.value
        }, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        if (FullName.value) {
            localStorage.setItem('fullname', FullName.value)
        }        
        alert('Đổi Thông tin thành công');
    } catch (err) {
        alert("Lỗi");
        console.log(err);
    }
    
}

</script>

<style scoped>
h2{
    color: red;
}
.profile-page{
    width: 30%;
    background-color: aliceblue;
    text-align: center;
    margin: 0 auto;
    padding: 20px;
}
.profile-form{
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 0 auto;
    padding: 10px;
}
.profile-form input{
    padding: 5px;
    border-radius: 6px;
    border: 1px solid #333;
}
.profile-form input:hover{
    transition: 0.2s ease;
}
.profile-form button {
    margin: 0 auto;
    margin-top: 20px;
    width: 30%;
    padding: 3px;
    border-radius: 6px;
    background-color: rgb(56, 56, 252);
    color: white;
}
.pass-current{
    display: flex;
    gap: 10px;
    margin: 0 auto;
}
</style>