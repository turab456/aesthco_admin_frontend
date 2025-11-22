import apiClient from "../../../lib/apiClient";
import {
  ApiResponse,
  AuthUser,
  SuperAdminLoginResponse,
} from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginSuperAdmin = async (payload: LoginPayload) => {
  const response = await apiClient.post<ApiResponse<SuperAdminLoginResponse>>(
    "/auth/login/super-admin",
    payload
  );

  return response.data.data;
};

export const fetchSuperAdminProfile = async () => {
  const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
};

export const logoutSuperAdmin = async (refreshToken?: string) => {
  await apiClient.post("/auth/logout", {
    refreshToken,
  });
};
