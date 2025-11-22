import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { ProductResponse } from "../api/ProductsApi";

type Props = {
  data: ProductResponse[];
  onView: (product: ProductResponse) => void;
  onEdit: (product: ProductResponse) => void;
  onDelete?: (product: ProductResponse) => void;
  customAction?: React.ReactNode;
};

const ProductList: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onDelete,
  customAction,
}) => {
  const columns: Array<ColumnDef<ProductResponse>> = [
    {
      key: "productName",
      header: "Product",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.name}
          </span>
          <span className="text-xs text-gray-500">Slug: {row.slug}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      searchable: true,
      render: (row) => row.category?.name ?? "—",
    },
    {
      key: "collection",
      header: "Collection",
      searchable: true,
      render: (row) => row.collection?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      searchable: true,
      render: (row) =>
        row.isActive ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-500">Inactive</span>
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
      buildSuggestionLabel={(row) =>
        `${row.name} – ${row.category?.name ?? "Uncategorised"}`
      }
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default ProductList;
