import { defineStore } from 'pinia';
import { ref } from 'vue';
import { productService } from '@/services/productService';

export interface Product {
  ProductID: number;
  ProductName: string;
  Description: string;
  Price: number;
  Stock: number;
  Image: string;
  IsDeleted: boolean;
  Sale: number;
  CreatedAt?: Date;
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const editingProduct = ref<Product | null>(null);

  async function fetchProducts() {
    try {
      products.value = await productService.fetchProducts();
    } catch (err) {
      throw err;
    }
  }

  function setEditing(product: Product) {
    editingProduct.value = { ...product };
  }

  function clearEditing() {
    editingProduct.value = null;
  }

  async function addProduct(newProduct: Product) {
    try {
      const added = await productService.addProduct(newProduct);
      products.value.push(added);
    } catch (err) {
      throw err;
    }
  }

  async function updateProduct(updated: Product) {
    try {
      const updatedData = await productService.updateProduct(updated);
      const index = products.value.findIndex((p) => p.ProductID === updated.ProductID);
      if (index !== -1) products.value[index] = updatedData;
      clearEditing();
    } catch (err) {
      throw err;
    }
  }

  async function deleteProduct(id: number) {
    try {
      await productService.deleteProduct(id);
      const item = products.value.find((p) => p.ProductID === id);
      if (item) item.IsDeleted = true;
    } catch (err) {
      throw err;
    }
  }

  async function addToCartAndUpdateStock(productID: number, quantity: number) {
    try {
      await productService.addToCartAndUpdateStock(productID, quantity);
      const p = products.value.find((p) => p.ProductID === productID);
      if (p) p.Stock -= quantity;
    } catch (err) {
      throw err;
    }
  }

  async function getSellingProducts() {
    try {
      return await productService.getSellingProducts();
    } catch (err) {
      throw err;
    }
  }

  async function getNewProducts() {
    try {
      return await productService.getNewProducts();
    } catch (err) {
      throw err;
    }
  }

  return {
    products,
    editingProduct,
    fetchProducts,
    setEditing,
    clearEditing,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCartAndUpdateStock,
    getSellingProducts,
    getNewProducts
  };
});
