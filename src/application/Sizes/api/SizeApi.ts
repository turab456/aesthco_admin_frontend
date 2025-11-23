import apiClient from "../../../lib/apiClient";
import { SizePayload, SizeResponse } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Size API error.");
  }
  return response.data;
};

const SizeApi = {
  async list(): Promise<SizeResponse[]> {
    const response = await apiClient.get<ApiResponse<SizeResponse[]>>(
      "/masters/sizes"
    );
    return unwrap(response.data);
  },

  async create(payload: SizePayload): Promise<SizeResponse> {
    const response = await apiClient.post<ApiResponse<SizeResponse>>(
      "/masters/sizes",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: number | string,
    payload: Partial<SizePayload>
  ): Promise<SizeResponse> {
    const response = await apiClient.put<ApiResponse<SizeResponse>>(
      `/masters/sizes/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: number | string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/masters/sizes/${id}`
    );
    unwrap(response.data);
  },
};

export default SizeApi;
