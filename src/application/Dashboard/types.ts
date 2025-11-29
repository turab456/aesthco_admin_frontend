export type DashboardUsers = {
  total: number
  customers: number
  partners: number
  superAdmins: number
  active: number
  inactive: number
}

export type DashboardProducts = {
  totalProducts: number
  activeProducts: number
  totalVariants: number
  outOfStockVariants: number
  lowStockVariants: number
  stockOnHand: number
}

export type DashboardOrders = {
  total: number
  completed: number
  pending: number
  cancelled: number
  returnRequested: number
  assigned?: number
}

export type DashboardRevenue = {
  paid: number
  pending: number
  expected: number
  cancelled: number
  assignedValue?: number
  completedValue?: number
  inProgressValue?: number
  outstandingCod?: number
}

export type DashboardAdminPayload = {
  users: DashboardUsers
  products: DashboardProducts
  orders: DashboardOrders
  revenue: DashboardRevenue
}

export type DashboardPartnerPayload = {
  orders: DashboardOrders
  revenue: DashboardRevenue
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}
