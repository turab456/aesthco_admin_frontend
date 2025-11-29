export type UserRole = "super-admin" | "partner" | "customer"

export type UserOrderStats = {
  orderCount: number
  deliveredCount: number
  cancelledCount: number
  totalValue: number
  deliveredValue: number
  lastOrderAt: string | null
}

export type UserSummary = {
  id: string
  fullName: string | null
  email: string
  phoneNumber?: string | null
  role: UserRole
  isActive: boolean
  isVerified: boolean
  createdAt?: string
  orders: UserOrderStats
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}
