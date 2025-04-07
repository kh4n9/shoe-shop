import axios from "axios";

interface Order {
  _id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export const getOrders = async () => {
  const response = await axios.get("/api/admin/orders");
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await axios.get(`/api/admin/orders/${id}`);
  return response.data;
};

export const updateOrder = async (id: string, order: Partial<Order>) => {
  const response = await axios.put(`/api/admin/orders/${id}`, order);
  return response.data;
};
