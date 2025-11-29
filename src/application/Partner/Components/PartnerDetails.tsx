import React from "react"
import { CustomModal } from "../../../components/custom"
import type { UserSummary } from "../../User/types"

type Props = {
  isOpen: boolean
  onClose: () => void
  user: UserSummary | null
}

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
}

const badgeClass = (isActive: boolean) =>
  isActive
    ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
    : "inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"

const PartnerDetails: React.FC<Props> = ({ isOpen, onClose, user }) => {
  if (!user) return null

  const { orders } = user

  const stats = [
    { label: "Total orders", value: orders.orderCount },
    { label: "Delivered", value: orders.deliveredCount },
    { label: "Cancelled", value: orders.cancelledCount },
    { label: "Last order", value: formatDate(orders.lastOrderAt) },
  ]

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} size="lg" contentClassName="p-5 lg:p-8">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Partner Details</h3>
            <p className="text-sm text-gray-500">Account overview and order stats for partner.</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Full name</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.fullName || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.phoneNumber || "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">Role</span>
              <span className="rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">{user.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">Status</span>
              <span className={badgeClass(user.isActive)}>{user.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">Verified</span>
              <span className={badgeClass(user.isVerified)}>{user.isVerified ? "Yes" : "No"}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Joined</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Order performance</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Shipment / Last order</h4>
          <p className="text-sm text-gray-600">The UI shows last order date and aggregated delivery counts. If you need per-order shipment details, add a backend endpoint to return orders for a partner and we can display shipment status per order here.</p>
        </div>
      </div>
    </CustomModal>
  )
}

export default PartnerDetails
