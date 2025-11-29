import apiClient from "../../../lib/apiClient"
import type { ApiResponse, UserSummary } from "../types"

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "User API error.")
  }
  return response.data
}

const UserApi = {
  async list(): Promise<UserSummary[]> {
    const response = await apiClient.get<ApiResponse<UserSummary[]>>("/admin/users")
    return unwrap(response.data)
  },
}

export default UserApi
