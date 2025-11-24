import apiClient from "../../../lib/apiClient";
import { CouponPayload, CouponResponse } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Coupon API error.");
  }
  return response.data;
};

const CouponApi = {
  async list(): Promise<CouponResponse[]> {
    const response = await apiClient.get<ApiResponse<CouponResponse[]>>(
      "/coupons/admin"
    );
    return unwrap(response.data);
  },

  async create(payload: CouponPayload): Promise<CouponResponse> {
    const response = await apiClient.post<ApiResponse<CouponResponse>>(
      "/coupons/admin",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: number | string,
    payload: Partial<CouponPayload>
  ): Promise<CouponResponse> {
    const response = await apiClient.patch<ApiResponse<CouponResponse>>(
      `/coupons/admin/${id}`,
      payload
    );
    return unwrap(response.data);
  },
};

export default CouponApi;
