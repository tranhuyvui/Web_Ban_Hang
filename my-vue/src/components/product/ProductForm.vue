<template>
  <div class="overlay" v-if="isAdmin">
    <div class="popup-form">
      <form @submit.prevent="handleSubmit">
        <h3>{{ isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h3>
        <input type="text" v-model="form.ProductName" placeholder="Tên sản phẩm" />
        <input type="text" v-model="form.Description" placeholder="Mô tả" />
        <input type="number" v-model="form.Price" placeholder="Đơn giá" />
        <input type="number" v-model="form.Stock" placeholder="Số lượng" />
        <input type="number" v-model="form.Sale" placeholder="Sale" />
        <input type="number" v-model="form.SaleFromHour" placeholder="Giờ bắt đầu sale" />
        <input type="number" v-model="form.SaleToHour" placeholder="Giờ kết thúc sale" />
        <input type="file" @change="handleImageUpload" accept="image/*" />
        <p v-if="form.Image">
          Ảnh đã chọn: <a :href="form.Image" target="_blank">Xem ảnh</a>
        </p>

        <div v-if="isEditing" class="restore-checkbox">
          <label>Hiện sản phẩm:</label>
          <input
            type="checkbox"
            :checked="!form.IsDeleted"
            @change="handleToggleDeleted"
          />
        </div>

        <div class="btn">
          <button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
          <button type="button" class="btn-delete" @click="$emit('close')">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useProductStore, type Product } from '@/stores/productStore'

const props = defineProps<{ editingProduct: Product | null }>()
const emit = defineEmits(['close'])

const productStore = useProductStore()
const isAdmin = localStorage.getItem('Role') === 'Admin'

const form = ref<Product | any>({
  ProductID: 0,
  ProductName: '',
  Description: '',
  Price: '',
  Stock: '',
  Image: '',
  Sale: '',
  SaleFromHour: '',
  SaleToHour: '',
  IsDeleted: false
})

const isEditing = computed(() => !!props.editingProduct)

watch(() => props.editingProduct, (val) => {
  form.value = val
    ? { ...val }
    : {
        ProductID: 0,
        ProductName: '',
        Description: '',
        Price: '',
        Stock: '',
        Image: '',
        Sale: '',
        SaleFromHour: '',
        SaleToHour: '',
        IsDeleted: false
      }
}, { immediate: true })

function handleToggleDeleted(e: Event) {
  const checkbox = e.target as HTMLInputElement
  form.value.IsDeleted = !checkbox.checked
}

async function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await axios.post('http://localhost:3000/api/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.Image = res.data.imageUrl
  } catch (err: any) {
    alert('Lỗi khi upload ảnh: ' + (err.response?.data?.message || err.message))
  }
}

function handleSubmit() {
  if (
    !form.value.ProductName ||
    !form.value.Description ||
    !form.value.Price ||
    !form.value.Stock ||
    !form.value.Sale ||
    !form.value.SaleFromHour ||
    !form.value.SaleToHour
  ) {
    alert('Thiếu dữ liệu, vui lòng nhập đầy đủ thông tin')
    return
  }

  if (isEditing.value) productStore.updateProduct(form.value)
  else productStore.addProduct(form.value)

  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; 
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  /* z-index: 999; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-form {
  background-color: beige;
  padding: 20px;
  width: 500px;
  border-radius: 10px;
  /* z-index: 1000; */
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
}

input {
  padding: 7px;
  margin: 5px auto;
  border-radius: 6px;
  border: solid 1px #333;
  width: 100%;
  display: block;
}

h3 {
  color: red;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
}

.btn {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

button {
  padding: 10px 15px;
  margin: 0 10px;
  border-radius: 8px;
  background-color: rgb(23, 95, 228);
  color: white;
  border: none;
  cursor: pointer;
}
.btn-delete {
  background-color: rgb(221, 46, 46);
}

.restore-checkbox {
  margin: 10px 0;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 16px;
  background-color: #eef;
  padding: 10px;
  border-radius: 6px;
}
</style>
