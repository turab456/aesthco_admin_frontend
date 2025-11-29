import React, { useState } from "react"
import { Eye, Power, PowerOff } from "lucide-react"
import { ColumnDef, DataTable } from "../../../components/custom/CustomTable/CustomTable"
import CustomConfirmModal from "../../../components/custom/CustomConfirmModal"
import type { UserSummary } from "../types"

type Props = {
  data: UserSummary[]
  onView: (user: UserSummary) => void
  onToggleActive: (user: UserSummary) => void
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

const UserList: React.FC<Props> = ({ data, onView, onToggleActive, customAction }) => {
  const [confirmModal, setConfirmModal] = useState<{ user: UserSummary; action: 'activate' | 'deactivate' } | null>(null)

  const handleToggleClick = (user: UserSummary) => {
    setConfirmModal({ user, action: user.isActive ? 'deactivate' : 'activate' })
  }

  const handleConfirm = () => {
    if (confirmModal) {
      onToggleActive(confirmModal.user)
      setConfirmModal(null)
    }
  }
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
      key: "status",
      header: "Status",
      searchable: false,
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 cursor-pointer text-gray-600 hover:text-indigo-600" onClick={() => onView(row)} />
          {row.isActive ? (
            <div title="Deactivate user">
              <PowerOff className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-800" onClick={() => handleToggleClick(row)} />
            </div>
          ) : (
            <div title="Activate user">
              <Power className="h-4 w-4 cursor-pointer text-green-600 hover:text-green-800" onClick={() => handleToggleClick(row)} />
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        defaultPageSize={10}
        enableSearchDropdown
        buildSuggestionLabel={(row) => `${row.fullName ?? ""} ${row.email}`}
        onSuggestionSelect={(row) => onView(row)}
        actionComponent={customAction}
      />
      
      <CustomConfirmModal
        isOpen={!!confirmModal}
        title={confirmModal?.action === 'activate' ? 'Activate User' : 'Deactivate User'}
        message={`Are you sure you want to ${confirmModal?.action} ${confirmModal?.user.fullName || confirmModal?.user.email}?${confirmModal?.action === 'deactivate' ? ' This will prevent them from logging in.' : ''}`}
        confirmText={confirmModal?.action === 'activate' ? 'Activate' : 'Deactivate'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(null)}
      />
    </>
  )
}

export default UserList
