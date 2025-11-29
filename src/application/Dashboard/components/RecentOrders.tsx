import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import Badge from "../../../components/ui/badge/Badge"
import type { Order, OrderStatus } from "../../Orders/types"

type Props = {
  orders?: Order[]
  loading?: boolean
  maxRows?: number
}

const statusColorMap: Record<OrderStatus, "success" | "warning" | "error" | "info" | "primary"> = {
  DELIVERED: "success",
  CONFIRMED: "primary",
  PACKED: "primary",
  OUT_FOR_DELIVERY: "warning",
  PLACED: "warning",
  RETURN_REQUESTED: "warning",
  RETURNED: "warning",
  CANCELLED: "error",
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  )

export default function RecentOrders({ orders = [], loading = false, maxRows = 6 }: Props) {
  const visibleOrders = orders.slice(0, maxRows)
  const showEmpty = !loading && visibleOrders.length === 0

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest orders placed across the store.</p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Order
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading
              ? Array.from({ length: maxRows }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-[42px] w-[42px] rounded-md bg-gray-100 dark:bg-gray-800" />
                        <div>
                          <div className="h-3 w-28 rounded bg-gray-100 dark:bg-gray-800" />
                          <div className="mt-2 h-2 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
                    </TableCell>
                  </TableRow>
                ))
              : null}

            {showEmpty ? (
              <TableRow>
                <TableCell className="py-6 text-sm text-gray-500 dark:text-gray-400" colSpan={4}>
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : null}

            {!loading &&
              visibleOrders.map((order) => {
                const firstItem = order.items?.[0]
                const productName = firstItem?.productName || "Order"
                const productImage = firstItem?.imageUrl
                const itemCount = order.items?.length ?? 0
                const badgeColor = statusColorMap[order.status] ?? "primary"

                return (
                  <TableRow key={order.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-md bg-gray-50 text-sm font-semibold text-gray-600 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                          {productImage ? (
                            <img
                              src={productImage}
                              className="h-[44px] w-[44px] object-cover"
                              alt={productName}
                              loading="lazy"
                            />
                          ) : (
                            productName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{productName}</p>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "No items"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.addressName || "—"}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatCurrency(Number(order.total ?? 0))}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={badgeColor}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
