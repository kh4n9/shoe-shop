import axios from "axios";

interface Order {
  id: string;
  total: number;
  status: string;
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

export const updateOrder = async (id: string, order: Order) => {
  const response = await axios.put(`/api/admin/orders/${id}`, order);
  return response.data;
};
