import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { CollectionResponse } from "../types";

type Props = {
  data: CollectionResponse[];
  onView: (collection: CollectionResponse) => void;
  onEdit: (collection: CollectionResponse) => void;
  onDelete?: (collection: CollectionResponse) => void;
  customAction?: React.ReactNode;
};

const CollectionList: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onDelete,
  customAction,
}) => {
  const columns: Array<ColumnDef<CollectionResponse>> = [
    {
      key: "name",
      header: "Collection Name",
      searchable: true,
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      searchable: true,
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.slug}</span>
      ),
    },
    {
      key: "showOnHome",
      header: "Home",
      searchable: false,
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${
            row.showOnHome
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {row.showOnHome ? "Shown" : "Hidden"}
        </span>
      ),
    },
    {
      key: "homeOrder",
      header: "Home Order",
      searchable: false,
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">
          {row.homeOrder ?? "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Eye
            className="h-4 w-4 cursor-pointer hover:text-blue-600"
            onClick={() => onView(row)}
          />
          <Pencil
            className="h-4 w-4 cursor-pointer hover:text-green-600"
            onClick={() => onEdit(row)}
          />
          {onDelete && (
            <Trash2
              className="h-4 w-4 cursor-pointer hover:text-red-600"
              onClick={() => onDelete(row)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row) => `${row.name} - ${row.slug || "Uncategorised"}`}
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default CollectionList;
