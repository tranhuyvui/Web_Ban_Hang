import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { cartService } from '@/services/cartService';

export interface Cart {
  CartID: number;
  CartDate: string;
  user: {
    FullName: string;
    Email?: string;
    UserID?: string;
  };
  Product: {
    ProductID: number;
    ProductName: string;
    Quantity: number;
    Price: number;
    Image: string;
    Sale: number;
  };
}
export const useCartStore = defineStore('Cart', () => {
  const carts = ref<Cart[]>([]);
  async function fetchCarts() {
    try {
      const res = await cartService.fetchCart();
      // console.log('hhhhhhhhhhhhhhhh', res);
      carts.value = res;
      // console.log("ressssssssss", res);
    } catch (err) {
      carts.value = [];
      throw err;
    }
  }
  async function addCart(ProductID: number, Quantity: number) {
    try {
      await cartService.addCart(ProductID, Quantity);
      await fetchCarts();
    } catch (err) {
      throw err;
    }
  }
  async function deleteCartById(id: number) {
    try {
      await cartService.deleteCartById(id);
      fetchCarts();
    } catch (err) {
      throw err;
    }
  }
  async function updateCartById(id: number, quantity: number) {
    try {
      await cartService.updateCartById(id, quantity);
      // fetchCarts();
    } catch (err) {
      throw err;
    }
  }
  async function deleteAllCart() {
    try {
      await cartService.deleteAllCart();
      fetchCarts();
    } catch (err) {
      throw err;
    }
  }
  return {
    carts,
    fetchCarts,
    deleteAllCart,
    deleteCartById,
    addCart,
    updateCartById
  };
});
