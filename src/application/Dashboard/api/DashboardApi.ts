import apiClient from "../../../lib/apiClient"
import type {
  ApiResponse,
  DashboardAdminPayload,
  DashboardPartnerPayload,
} from "../types"

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Dashboard API error.")
  }
  return response.data
}

const DashboardApi = {
  async fetchAdmin(): Promise<DashboardAdminPayload> {
    const response = await apiClient.get<ApiResponse<DashboardAdminPayload>>(
      "/dashboard/admin",
    )
    return unwrap(response.data)
  },

  async fetchPartner(partnerId?: string): Promise<DashboardPartnerPayload> {
    const url = partnerId ? `/dashboard/partner?partnerId=${partnerId}` : "/dashboard/partner"
    const response = await apiClient.get<ApiResponse<DashboardPartnerPayload>>(url)
    return unwrap(response.data)
  },
}

export default DashboardApi
