import React from "react";
import { BadgePercent, Pencil, Power } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { CouponResponse } from "../types";

const formatDate = (value?: string | null) => {
  if (!value) return "No end date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString();
};

type Props = {
  data: CouponResponse[];
  onEdit: (coupon: CouponResponse) => void;
  onToggle: (coupon: CouponResponse) => void;
  actionComponent?: React.ReactNode;
};

const CouponList: React.FC<Props> = ({
  data,
  onEdit,
  onToggle,
  actionComponent,
}) => {
  const columns: Array<ColumnDef<any>> = [
    {
      key: "code",
      header: "Code",
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.code}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      searchable: true,
      render: (row) => (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {row.type}
        </span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      searchable: false,
      render: (row) => {
        const prefix = row.discountType === "PERCENT" ? "" : "Rs. ";
        const suffix = row.discountType === "PERCENT" ? "%" : "";
        return (
          <div className="text-sm text-gray-800 dark:text-gray-100">
            {prefix}
            {row.discountValue}
            {suffix}
          </div>
        );
      },
    },
    {
      key: "validity",
      header: "Validity",
      searchable: false,
      render: (row) => (
        <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400">
          <span>
            Starts: {row.startAt ? formatDate(row.startAt) : "Active now"}
          </span>
          <span>Ends: {formatDate(row.endAt)}</span>
        </div>
      ),
    },
    {
      key: "limits",
      header: "Limits",
      searchable: false,
      render: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-200">
          <div>Per user: {row.perUserLimit || 1}</div>
          <div>
            Global: {row.globalMaxRedemptions ?? "Unlimited"}{" "}
            {row.redemptionsCount !== undefined &&
              `(used ${row.redemptionsCount})`}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      searchable: false,
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            row.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-100"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Pencil
            className="h-4 w-4 cursor-pointer hover:text-blue-600"
            onClick={() => onEdit(row)}
          />
          <Power
            className={`h-4 w-4 cursor-pointer ${
              row.isActive ? "text-green-600" : "text-gray-500"
            } hover:text-black`}
            onClick={() => onToggle(row)}
            title={row.isActive ? "Deactivate" : "Activate"}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data as any}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row: any) => `${row.code} - ${row.type || ""}`}
      onSuggestionSelect={(row: any) => onEdit(row as CouponResponse)}
      actionComponent={actionComponent}
    />
  );
};

export default CouponList;
