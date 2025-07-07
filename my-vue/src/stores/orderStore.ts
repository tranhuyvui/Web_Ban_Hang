import { defineStore } from 'pinia';
import { ref } from 'vue';
import { orderService } from '@/services/orderService';

export interface Order {
  OrderID: number;
  OrderDate: string;
  Status: string;
  TotalPrice: number
  user: {
    FullName: string;
    Phone: string;
    ShippingAddress: string;
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
export interface EditingOrder {
  OrderID?: number;
  ProductID: number;
  Quantity: number;
  Phone: string;
  ShippingAddress: string;
  Status: string;
  Sale: number;
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const editingOrder = ref<EditingOrder | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await orderService.fetchOrders();
      orders.value = data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', err);
      throw err;
    }
  };

  const addOrder = async (CartID: number, ShippingAddress: string, Phone: string) => {
    try {
      await orderService.addOrder(CartID, ShippingAddress, Phone);
    } catch (err: any) {
      console.error('Lỗi khi tạo đơn hàng:', err);
      throw err.response?.data?.message || err;
    }
  };

  const updateOrder = async (order: EditingOrder) => {
    try {
      await orderService.updateOrder(order);
      await fetchOrders();
      clearEditingOrder();
    } catch (err) {
      console.error(' Lỗi khi cập nhật đơn hàng:', err);
      throw err;
    }
  };

  const setEditingOrder = (order: Order) => {
    editingOrder.value = {
      OrderID: order.OrderID,
      ProductID: order.Product.ProductID,
      Quantity: order.Product.Quantity,
      Phone: order.user.Phone,
      ShippingAddress: order.user.ShippingAddress,
      Status: order.Status,
      Sale: order.Product.Sale
    };
  };

  const clearEditingOrder = () => {
    editingOrder.value = null;
  };

  return {
    orders,
    editingOrder,
    fetchOrders,
    addOrder,
    updateOrder,
    setEditingOrder,
    clearEditingOrder
  };
});
