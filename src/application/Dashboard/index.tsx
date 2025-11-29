import { useEffect, useMemo, useState } from "react"
import EcommerceMetrics from "./components/EcommerceMetrics"
import MonthlySalesChart from "./components/MonthlySalesChart"
import RecentOrders from "./components/RecentOrders"
import DashboardApi from "./api/DashboardApi"
import OrderDetailApi from "../Orders/api/OrderDetailApi"
import type { DashboardAdminPayload } from "./types"
import type { Order } from "../Orders/types"
import { BoxCubeIcon, BoxIconLine, GroupIcon } from "../../icons"

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-IN").format(Number.isFinite(value ?? 0) ? (value as number) : 0)

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value ?? 0) ? (value as number) : 0,
  )

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardAdminPayload | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    DashboardApi.fetchAdmin()
      .then((data) => setDashboard(data))
      .catch((err) => setError(err?.message || "Failed to load dashboard"))
      .finally(() => setLoadingDashboard(false))

    OrderDetailApi.list()
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [])

  const metrics = useMemo(() => {
    if (!dashboard) return []
    return [
      {
        id: "users",
        label: "Total Users",
        value: formatNumber(dashboard.users.total),
        helperText: `${formatNumber(dashboard.users.customers)} customers, ${formatNumber(
          dashboard.users.partners,
        )} partners`,
        badgeText: `${formatNumber(dashboard.users.active)} active`,
        badgeColor: "success" as const,
        trendDirection: "up" as const,
        icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      },
      {
        id: "orders",
        label: "Total Orders",
        value: formatNumber(dashboard.orders.total),
        helperText: `${formatNumber(dashboard.orders.completed)} completed`,
        badgeText: `${formatNumber(dashboard.orders.pending)} pending`,
        badgeColor: "warning" as const,
        trendDirection: "down" as const,
        icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      },
      {
        id: "products",
        label: "Products",
        value: formatNumber(dashboard.products.totalProducts),
        helperText: `${formatNumber(dashboard.products.totalVariants)} variants`,
        badgeText: `${formatNumber(dashboard.products.outOfStockVariants)} out of stock`,
        badgeColor: "error" as const,
        trendDirection: "down" as const,
        icon: <BoxCubeIcon className="text-gray-800 size-6 dark:text-white/90" />,
      },
      {
        id: "revenue",
        label: "Expected Revenue",
        value: formatCurrency(dashboard.revenue.expected),
        helperText: `${formatCurrency(dashboard.revenue.paid)} received`,
        badgeText: `${formatCurrency(dashboard.revenue.pending)} pending`,
        badgeColor: "primary" as const,
        trendDirection: "up" as const,
        icon: (
          <span className="text-lg font-semibold text-gray-800 dark:text-white/90" aria-hidden>
            ₹
          </span>
        ),
      },
    ]
  }, [dashboard])

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <EcommerceMetrics metrics={metrics} />

      <MonthlySalesChart revenue={dashboard?.revenue} loading={loadingDashboard} />

      <RecentOrders orders={orders} loading={loadingOrders} />
    </div>
  )
}

export default Dashboard
