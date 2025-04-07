import axios from "axios";

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderData {
  order: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
    paymentMethod: "cod" | "bank" | "momo";
    products: OrderItem[];
    totalPrice: number;
    status: string;
  };
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axios.post("/api/public/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await axios.get(`/api/public/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axios.get("/api/public/orders/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
