import apiClient from "../../../lib/apiClient";
import { ReviewFilters, ReviewResponse, ReviewStatusPayload } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Review API error.");
  }
  return response.data;
};

const ReviewsApi = {
  async list(filters: ReviewFilters = {}): Promise<ReviewResponse[]> {
    const params: Record<string, any> = {};
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }
    if (filters.rating) {
      params.rating = filters.rating;
    }

    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>(
      "/reviews/admin/list",
      { params }
    );
    return unwrap(response.data);
  },

  async updateStatus(
    id: number,
    payload: ReviewStatusPayload
  ): Promise<ReviewResponse> {
    const response = await apiClient.patch<ApiResponse<ReviewResponse>>(
      `/reviews/admin/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/reviews/admin/${id}`
    );
    unwrap(response.data);
  },
};

export default ReviewsApi;
