import apiClient from "../../../lib/apiClient";
import { CategoryPayload, CategoryResponse } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Category API error.");
  }
  return response.data;
};

const CategoryApi = {
  async list(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<ApiResponse<CategoryResponse[]>>(
      "/masters/categories"
    );
    return unwrap(response.data);
  },

  async create(payload: CategoryPayload): Promise<CategoryResponse> {
    const response = await apiClient.post<ApiResponse<CategoryResponse>>(
      "/masters/categories",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: number | string,
    payload: Partial<CategoryPayload>
  ): Promise<CategoryResponse> {
    const response = await apiClient.put<ApiResponse<CategoryResponse>>(
      `/masters/categories/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: number | string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/masters/categories/${id}`
    );
    unwrap(response.data);
  },
};

export default CategoryApi;
