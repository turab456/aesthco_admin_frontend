import apiClient from "../../../lib/apiClient";
import { CollectionPayload, CollectionResponse } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Collection API error.");
  }
  return response.data;
};

const CollectionApi = {
  async list(): Promise<CollectionResponse[]> {
    const response = await apiClient.get<ApiResponse<CollectionResponse[]>>(
      "/masters/collections"
    );
    return unwrap(response.data);
  },

  async create(payload: CollectionPayload): Promise<CollectionResponse> {
    const response = await apiClient.post<ApiResponse<CollectionResponse>>(
      "/masters/collections",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: number | string,
    payload: Partial<CollectionPayload>
  ): Promise<CollectionResponse> {
    const response = await apiClient.put<ApiResponse<CollectionResponse>>(
      `/masters/collections/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: number | string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/masters/collections/${id}`
    );
    unwrap(response.data);
  },
};

export default CollectionApi;
