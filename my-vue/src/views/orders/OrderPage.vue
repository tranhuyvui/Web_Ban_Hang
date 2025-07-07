<template>
    <div class="order-page">
      <h2>Quản lý đơn hàng</h2>
      <div class="order" v-for="order in orderStore.orders"
      :key="order.OrderID"
      :Order="order"
      >
        <div class="order-form">
            <div class="order-info" @click="gotoDetail(order.Product.ProductID)">
                <div class="order-info-img">
                    <img :src="getImage(order.Product.Image)" alt="">
                </div>
                <div class="order-info-name">
                    <p>{{ order.Product.ProductName }}</p>
                    <div v-if="getSaleOld(order.TotalPrice, order.Product.Price, order.Product.Quantity) > 0" >
                      <strong >
                        Sale: {{  getSaleOld(order.TotalPrice, order.Product.Price, order.Product.Quantity)  }}%
                      </strong>
                      <p class="sale-old" v-if="getSaleOld(order.TotalPrice, order.Product.Price, order.Product.Quantity) > 0" >
                          {{ getPrice(order.Product.Price) }}
                      </p>
                      <strong>{{ getPrice(order.Product.Price * (100 - order.Product.Sale) / 100) }}</strong>

                    </div>
                    <div v-else>
                      <strong>{{ getPrice(order.Product.Price) }}</strong>
                        
                    </div>
                    <p>x{{ order.Product.Quantity }}</p>
                </div>
            </div>
            <div class="order-address">
              <p v-if="isAdmin">Người dùng: {{ order.user.FullName }}</p>
              <p>Địa chỉ: {{ order.user.ShippingAddress }}</p>
              <p>SĐT: {{ order.user.Phone }}</p>
            </div>
            <div class="order-price">
              <div class="order-sale" >

                <p v-if="getSaleOld(order.TotalPrice, order.Product.Price, order.Product.Quantity) > 0" >
                  Tiết kiệm: {{ getPrice( (order.Product.Quantity * order.Product.Price) - (100 - getSaleOld(order.TotalPrice, order.Product.Price, order.Product.Quantity) )/100 * order.Product.Quantity * order.Product.Price) }}
                </p>                <!-- <p v-if="order.Product.Sale > 0" >{{ getPrice(order.Product.Price) }}</p>
                <strong>{{ getPrice(order.Product.Price * (100 - order.Product.Sale) / 100) }}</strong> -->
                <p v-else>Tiết kiệm: 0đ </p>
              
              </div>
              <div class="order-total-price">
                <p>Tổng tiền: </p>
                <strong> {{ getPrice(order.TotalPrice) }}</strong>

              </div>
          
            </div>
        </div>
        <div class="line"></div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore';
import router from '@/router';

const isAdmin = ref(localStorage.getItem('Role') === 'Admin');
const orderStore = useOrderStore();

onMounted(async () => {
  const res = await orderStore.fetchOrders();
})
function getImage(img : string) {
  return /^https?:\/\//.test(img) ? img : 'http://localhost:3000/' + img
}
function getPrice(price: number) {
  return price.toLocaleString('vi-VN') + ' VND'
}
function getSaleOld(totalPrice: number, price: number, quantity: number) {
  return 100 - ((totalPrice / quantity) / price ) * 100
}
function gotoDetail(id: number) {
  router.push(`product/${id}`);
}

</script>

<style scoped>
.order-price{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  /* background-color: aqua; */
  border: solid 1px #333;
  border-radius: 10px;
  padding: 20px;
  /* margin: 5px; */
}
.line{
  width: 100%;
  background-color: rgb(239, 65, 7);
  height: 4px;
  margin-top: 30px;
}
h2{
  text-align: center;
}
.order-page{
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 70%;
  margin: 0 auto;
  padding: 40px;
}
.order{
  background-color: rgb(240, 238, 236);
  padding: 10px;
  width: 100%;
}
.order-form{
  /* background-color: rgb(86, 68, 68); */
  display: flex;
  justify-content: space-between;
  /* gap: 100px; */
  height: 100px;
  width: 100%;
  /* background-color: red; */

}


.order-info{
  display: flex;
  gap: 5px;
  width: 40%;
  border-radius: 7px;
  border: solid 1px #333;
  
}

.order-info-name{
  /* justify-items: center; */
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin: 5px;
  /* border: solid 1px #333; */
  width: 60%;
  /* border-radius: 6px; */
  /* padding-top: 20px; */
}
.sale-old{
  font-size: 10px;
  text-decoration: line-through;
}
.order-info-name strong{
  color: red;
  font-size: 13px;
}
.order-info-img{
  width: 40%;

}
.order-info-img img{
  width: 100%;
  padding: 5px;
  border-radius: 10px;
  height: 100%;
}
.order-total-price{
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.order-total-price p{
  font-weight: bold;
}
.order-total-price strong{
  color: red;
  font-size: 18px;
}
.order-sale{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.order-sale p{
  font-size: 15px;
}

.order-total{
  display: flex;
  border-bottom: 2px solid #333;
}
.order-address{
  display: flex;
  width: 30%;
  flex-direction: column;
  /* gap: 5px; */
  /* margin-top: 15px; */
  padding: 10px;
  border:solid 1px #333;
  border-radius: 6px;
  margin-left: 5px;
  margin-right: 5px;
  justify-content: space-between;
}
</style>
