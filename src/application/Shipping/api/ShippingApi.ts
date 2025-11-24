import apiClient from "../../../lib/apiClient";
import { ShippingSetting } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Shipping API error.");
  }
  return response.data;
};

const ShippingApi = {
  async getActiveSetting(): Promise<ShippingSetting | null> {
    const response = await apiClient.get<ApiResponse<ShippingSetting | null>>(
      "/orders/admin/shipping-settings"
    );
    return unwrap(response.data);
  },

  async saveSetting(
    payload: Partial<ShippingSetting>
  ): Promise<ShippingSetting> {
    const response = await apiClient.post<ApiResponse<ShippingSetting>>(
      "/orders/admin/shipping-settings",
      payload
    );
    return unwrap(response.data);
  },
};

export default ShippingApi;
