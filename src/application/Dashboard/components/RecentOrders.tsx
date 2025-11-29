import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import { useNavigate } from "react-router-dom"
import type { Order, OrderStatus } from "../../Orders/types"

type Props = {
  orders?: Order[]
  loading?: boolean
  maxRows?: number
}

// Strict Monochrome Badge Styles
const statusStyles: Record<OrderStatus, string> = {
  DELIVERED: "bg-black text-white border border-black",
  CONFIRMED: "bg-gray-800 text-white border border-gray-800",
  PACKED: "bg-gray-800 text-white border border-gray-800",
  OUT_FOR_DELIVERY: "bg-white text-gray-900 border border-gray-900 font-bold",
  PLACED: "bg-white text-gray-900 border border-gray-300",
  RETURN_REQUESTED: "bg-gray-100 text-gray-600 border border-gray-200",
  RETURNED: "bg-gray-200 text-gray-600 border border-gray-200",
  CANCELLED: "bg-white text-gray-400 border border-gray-200 line-through decoration-gray-400",
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  )

export default function RecentOrders({ orders = [], loading = false, maxRows = 6 }: Props) {
  const navigate = useNavigate()
  const visibleOrders = orders.slice(0, maxRows)
  const showEmpty = !loading && visibleOrders.length === 0

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 sm:px-6">
      <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest activity from your store.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View All Orders
        </button>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 pl-0 font-semibold text-gray-900 text-xs uppercase tracking-wide text-left">
                Order
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide text-left">
                Customer
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide text-left">
                Total
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide text-left">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading
              ? Array.from({ length: maxRows }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                    <TableCell className="py-4 pl-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 rounded bg-gray-100" />
                          <div className="h-2 w-16 rounded bg-gray-100" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-gray-100" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-16 rounded bg-gray-100" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-6 w-20 rounded-full bg-gray-100" />
                    </TableCell>
                  </TableRow>
                ))
              : null}

            {showEmpty ? (
              <TableRow>
                <TableCell className="py-10 text-center text-sm text-gray-400" colSpan={4}>
                  No orders found.
                </TableCell>
              </TableRow>
            ) : null}

            {!loading &&
              visibleOrders.map((order) => {
                const firstItem = order.items?.[0]
                const productName = firstItem?.productName || "Order"
                const productImage = firstItem?.imageUrl
                const itemCount = order.items?.length ?? 0
                const badgeStyle = statusStyles[order.status] || "bg-gray-50 text-gray-500 border border-gray-200"

                return (
                  <TableRow key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-4 pl-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                          {productImage ? (
                            <img
                              src={productImage}
                              className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                              alt={productName}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{productName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{productName}</p>
                          <span className="text-xs text-gray-500">
                            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "No items"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm font-medium text-gray-600 text-left">
                      {order.addressName || "—"}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-bold text-gray-900 text-left">
                      {formatCurrency(Number(order.total ?? 0))}
                    </TableCell>
                    <TableCell className="py-4 text-left">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${badgeStyle}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
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