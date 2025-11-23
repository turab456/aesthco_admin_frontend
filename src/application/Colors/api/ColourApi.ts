import apiClient from "../../../lib/apiClient";
import { ColorPayload, ColorResponse } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Color API error.");
  }
  return response.data;
};

const ColourApi = {
  async list(): Promise<ColorResponse[]> {
    const response = await apiClient.get<ApiResponse<ColorResponse[]>>(
      "/masters/colors"
    );
    return unwrap(response.data);
  },

  async create(payload: ColorPayload): Promise<ColorResponse> {
    const response = await apiClient.post<ApiResponse<ColorResponse>>(
      "/masters/colors",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: number | string,
    payload: Partial<ColorPayload>
  ): Promise<ColorResponse> {
    const response = await apiClient.put<ApiResponse<ColorResponse>>(
      `/masters/colors/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: number | string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/masters/colors/${id}`
    );
    unwrap(response.data);
  },
};

export default ColourApi;
