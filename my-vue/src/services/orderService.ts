import axios from "axios";
import type { Order, EditingOrder } from "@/stores/orderStore";
import api from '../services/axios';

export const orderService = {
  async fetchOrders(): Promise<Order[]> {
    try {
      const res = await api.get('/orders') 
      return res.data
    } catch (err: any) {
      throw err.response?.data?.message
    }
  }
  ,
    async updateOrder(order: EditingOrder): Promise<void> {
        try {
            await api.put(`/orders/${order.OrderID}`, {
              Quantity: order.Quantity,
              ShippingAddress: order.ShippingAddress,
              Phone: order.Phone,
              Status: order.Status
            })
            
        } catch (err : any) {
            throw (err.response?.data?.message);
        }
    },
    async addOrder(CartID: number, ShippingAddress: string, Phone: string): Promise<void> {
        try {
            await api.post('/orders', {
              CartID, ShippingAddress, Phone
            })
            
        } catch (err : any) {
            throw (err.response?.data?.message);
        }
       
      }
}