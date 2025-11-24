import apiClient from "../../../lib/apiClient";
import type { ApiResponse, Order } from "../types";

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Order API error.");
  }
  return response.data;
};

const OrderDetailApi = {
  async list(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      "/orders/admin/list"
    );
    return unwrap(response.data);
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/orders/admin/${id}`
    );
    return unwrap(response.data);
  },
};

export default OrderDetailApi;
