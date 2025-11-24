import React from "react";
import { Eye } from "lucide-react";
import {
  DataTable,
  type ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import type { Order } from "../types";

type Props = {
  data: Order[];
  onView: (orderId: string) => void;
  actionComponent?: React.ReactNode;
};

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PLACED: "bg-gray-100 text-gray-800",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PACKED: "bg-indigo-100 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURN_REQUESTED: "bg-yellow-100 text-yellow-700",
    RETURNED: "bg-amber-100 text-amber-700",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

const OrdersList: React.FC<Props> = ({ data, onView, actionComponent }) => {
  const columns: Array<ColumnDef<any>> = [
    {
      key: "id",
      header: "Order",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.id.slice(0, 8)}...
          </span>
          <span className="text-xs text-gray-500">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}
          </span>
        </div>
      ),
    },
    {
      key: "addressName",
      header: "Customer",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.addressName}
          </span>
          <span className="text-xs text-gray-500">{row.city}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      searchable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(
            row.status
          )}`}
        >
          {row.status.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "assignedPartner",
      header: "Accepted By",
      searchable: true,
      render: (row) => {
        const hasPartner = Boolean(row.assignedPartnerId);
        const label =
          row.assignedPartner?.fullName ||
          row.assignedPartner?.email ||
          (hasPartner ? "Partner" : "Unassigned");
        const badgeClass = hasPartner
          ? "bg-green-100 text-green-700"
          : "bg-amber-50 text-amber-700";
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "paymentStatus",
      header: "Payment",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.paymentMethod}
          </span>
          <span className="text-xs text-gray-500">{row.paymentStatus}</span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      searchable: false,
      render: (row) => (
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatter.format(row.total)}
        </div>
      ),
    },
    {
      key: "id",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => onView(row.id)}
          className="p-2 text-gray-700 transition hover:text-gray-900"
          title="View order"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={data as any}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row: any) => `${row.addressName} - ${row.id}`}
      onSuggestionSelect={(row: any) => onView(row.id)}
      actionComponent={actionComponent}
    />
  );
};

export default OrdersList;
