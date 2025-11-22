export interface AuthUser {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  phoneNumber?: string | null;
  lastLogin?: string | null;
}

export interface SuperAdminLoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  admin_auth_token?: string;
  admin_refresh_token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
