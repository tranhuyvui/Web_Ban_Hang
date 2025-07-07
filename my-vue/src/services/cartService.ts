import { Cart } from "@/stores/cartStore";
import api from '../services/axios'

export const cartService = {
    async fetchCart(): Promise<Cart[]>{
        try {
            const res = await api.get('/carts')
            return res.data            
        } catch (err: any) {
            console.log('eeeeeeeeeee', err);
            throw(err.response?.data?.message)
        }
    },
    async addCart(ProductID: number, Quantity: number) {
        try {
            await api.post('/carts', {
                ProductID: ProductID,
                Quantity: Quantity
            })
            
        } catch (err : any) {
            throw(err.response?.data?.message)
        }
    },
    async deleteCartById(id : number) {
        try {
            const res = await api.delete(`/carts/${id}`)
        } catch (err : any) {
            throw (err.response?.data?.message);
        }
    },
    async updateCartById(id : number, quantity: number) {
        try {
            const res = await api.put(`/carts/${id}`, {
                Quantity: quantity
            })
        } catch (err : any) {
            throw (err.response?.data?.message);
        }
    },
    async deleteAllCart() {
        try {
            await api.delete('/carts/all')
        } catch (err : any) {
            throw (err.response?.data?.message);            
        }
    }
    
}