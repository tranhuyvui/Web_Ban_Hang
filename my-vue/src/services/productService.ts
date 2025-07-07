import axios from "axios"
import type { Product } from "@/stores/productStore"
import api from "./axios"

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const res = await api.get("/products")
      return res.data
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi lấy danh sách sản phẩm"
    }
  },

  async addProduct(newProduct: Product): Promise<Product> {
    try {
      const res = await api.post("/products", newProduct)
      return res.data.product
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi thêm sản phẩm"
    }
  },

  async updateProduct(updated: Product): Promise<Product> {
    try {
      const res = await api.put(`/products/${updated.ProductID}`, updated)
      return res.data.product
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi cập nhật sản phẩm"
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`)
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi xoá sản phẩm"
    }
  },

  async addToCartAndUpdateStock(productID: number, quantity: number): Promise<void> {
    try {
      await api.post("/orders", {
        ProductID: productID,
        Quantity: quantity
      })
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi đặt hàng sản phẩm"
    }
  },

  async getSellingProducts(): Promise<Product[]> {
    try {
      const res = await api.get("/products/top-selling")
      return res.data
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi lấy sản phẩm bán chạy"
    }
  },

  async getNewProducts(): Promise<Product[]> {
    try {
      const res = await api.get("/products/new")
      return res.data
    } catch (err: any) {
      throw err.response?.data?.message || "Lỗi lấy sản phẩm mới"
    }
  }
}
