import apiClient from "../../../lib/apiClient"
import type { ApiResponse } from "../../User/types"
import type { UserSummary } from "../../User/types"

const unwrap = <T,>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Partner API error.")
  }
  return response.data
}

const PartnerApi = {
  async list(): Promise<UserSummary[]> {
    const response = await apiClient.get<ApiResponse<UserSummary[]>>("/admin/users")
    const users = unwrap(response.data)
    return users.filter((u) => u.role === "partner")
  },

  async create(payload: { fullName?: string; email: string; password: string }) {
    const response = await apiClient.post<ApiResponse<{ userId: string; email: string }>>( 
      "/auth/register/partner",
      payload,
    )
    return unwrap(response.data)
  },

  async toggleActive(userId: string): Promise<{ id: string; email: string; isActive: boolean }> {
    const response = await apiClient.patch<ApiResponse<{ id: string; email: string; isActive: boolean }>>(
      `/admin/users/${userId}/toggle-active`,
    )
    return unwrap(response.data)
  },

  async getById(userId: string): Promise<UserSummary | null> {
    const list = await PartnerApi.list()
    return list.find((u) => u.id === userId) ?? null
  },
}

export default PartnerApi
