import axios from "axios";

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderData {
  items: OrderItem[];
  shippingAddress: string;
  phone: string;
  note?: string;
  paymentMethod: "cod" | "bank" | "momo";
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axios.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axios.get("/api/orders/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
