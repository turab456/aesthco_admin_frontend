import React from "react"
import { Eye } from "lucide-react"
import { ColumnDef, DataTable } from "../../../components/custom/CustomTable/CustomTable"
import type { UserSummary } from "../types"

type Props = {
  data: UserSummary[]
  onView: (user: UserSummary) => void
  customAction?: React.ReactNode
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  )

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-IN", { dateStyle: "medium" })
}

const UserList: React.FC<Props> = ({ data, onView, customAction }) => {
  const columns: Array<ColumnDef<UserSummary>> = [
    {
      key: "fullName",
      header: "Name",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">{row.fullName || "—"}</span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      searchable: true,
      render: (row) => (
        <span className="rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {row.role}
        </span>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      searchable: false,
      render: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{row.orders.orderCount}</span> total
          <div className="text-xs text-gray-500">
            {row.orders.deliveredCount} delivered / {row.orders.cancelledCount} cancelled
          </div>
        </div>
      ),
    },
    {
      key: "ordersValue",
      header: "Value",
      searchable: false,
      render: (row) => (
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.orders.totalValue)}
          <div className="text-xs text-gray-500">Delivered: {formatCurrency(row.orders.deliveredValue)}</div>
        </div>
      ),
    },
    {
      key: "lastOrderAt",
      header: "Last Order",
      searchable: false,
      render: (row) => <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(row.orders.lastOrderAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 cursor-pointer text-gray-600 hover:text-indigo-600" onClick={() => onView(row)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row) => `${row.fullName ?? ""} ${row.email}`}
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  )
}

export default UserList
