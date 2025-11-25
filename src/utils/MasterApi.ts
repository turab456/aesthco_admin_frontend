import apiClient from "../lib/apiClient";

export type MasterCategory = {
  id: number;
  name: string;
  slug: string;
};

export type MasterCollection = {
  id: number;
  name: string;
  slug: string;
};

export type MasterColor = {
  id: number;
  name: string;
  code: string;
  hexCode: string;
};

export type MasterSize = {
  id: number;
  code: string;
  label: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch master data.");
  }
  return response.data;
};

const MasterApi = {
  async getCategories(): Promise<MasterCategory[]> {
    const response = await apiClient.get<ApiResponse<MasterCategory[]>>(
      "/masters/categories"
    );
    return unwrap(response.data);
  },

  async getCollections(options?: { showOnHome?: boolean; limit?: number }): Promise<MasterCollection[]> {
    const params = new URLSearchParams();
    if (options?.showOnHome) params.set("showOnHome", "true");
    if (options?.limit) params.set("limit", String(options.limit));
    const query = params.toString();
    const response = await apiClient.get<ApiResponse<MasterCollection[]>>(
      `/masters/collections${query ? `?${query}` : ""}`
    );
    return unwrap(response.data);
  },

  async getColors(): Promise<MasterColor[]> {
    const response = await apiClient.get<ApiResponse<MasterColor[]>>(
      "/masters/colors"
    );
    return unwrap(response.data);
  },

  async getSizes(): Promise<MasterSize[]> {
    const response = await apiClient.get<ApiResponse<MasterSize[]>>(
      "/masters/sizes"
    );
    return unwrap(response.data);
  },
};

export default MasterApi;
