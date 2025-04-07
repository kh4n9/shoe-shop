import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface OrderProduct {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  note?: string;
  paymentMethod: "momo" | "banking" | "cod";
  products: OrderProduct[];
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

class OrderService {
  // Get all orders for a user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await axios.get(
        `${API_URL}/public/orders?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  }

  // Get a single order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${API_URL}/public/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  // Create a new order
  async createOrder(order: Order): Promise<Order> {
    try {
      const response = await axios.post(`${API_URL}/public/orders`, { order });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Update an existing order
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
      const response = await axios.put(
        `${API_URL}/public/orders/${orderId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/public/orders/${orderId}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
