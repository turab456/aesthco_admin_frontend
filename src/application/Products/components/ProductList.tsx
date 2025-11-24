import React, { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { ProductResponse } from "../api/ProductsApi";
import { ConfirmModal } from "../../../components/custom";

type Props = {
  data: ProductResponse[];
  onView: (product: ProductResponse) => void;
  onEdit: (product: ProductResponse) => void;
  onToggleActive?: (
    product: ProductResponse,
    nextStatus: boolean
  ) => Promise<void> | void;
  customAction?: React.ReactNode;
};

const ProductList: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onToggleActive,
  customAction,
}) => {
  const [pendingToggle, setPendingToggle] = useState<{
    product: ProductResponse;
    nextStatus: boolean;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleRequest = (product: ProductResponse) => {
    setPendingToggle({ product, nextStatus: !product.isActive });
  };

  const handleConfirmToggle = async () => {
    if (!pendingToggle) return;
    if (!onToggleActive) {
      setPendingToggle(null);
      return;
    }
    try {
      setIsProcessing(true);
      await onToggleActive(pendingToggle.product, pendingToggle.nextStatus);
      setPendingToggle(null);
    } catch (error) {
      console.error("Failed to update product status:", error);
      alert("Failed to update product status. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: Array<ColumnDef<ProductResponse>> = [
    {
      key: "name",
      header: "Product",
      searchable: true,
      render: (row) => (
        <span className="text-gray-900 font-semibold dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      searchable: true,
      render: (row) => row.category?.name ?? "-",
    },
    {
      key: "collection",
      header: "Collection",
      searchable: true,
      render: (row) => row.collection?.name ?? "-",
    },
    {
      key: "isActive",
      header: "Status",
      searchable: true,
      render: (row) => (
        onToggleActive && (
          <button
            type="button"
            onClick={() => handleToggleRequest(row)}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition ${
              row.isActive ? "bg-green-500" : "bg-gray-300"
            }`}
            title={row.isActive ? "Deactivate product" : "Activate product"}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition ${
                row.isActive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        )
      ),
    },
    {
      key: "id",
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
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data as any}
        columns={columns as any}
        defaultPageSize={10}
        enableSearchDropdown
        buildSuggestionLabel={(row: any) =>
          `${row.name} - ${row.category?.name ?? "Uncategorised"}`
        }
        onSuggestionSelect={(row: any) => onView(row as ProductResponse)}
        actionComponent={customAction}
      />

      <ConfirmModal
        isOpen={Boolean(pendingToggle)}
        onCancel={() => {
          if (isProcessing) return;
          setPendingToggle(null);
        }}
        onConfirm={handleConfirmToggle}
        isProcessing={isProcessing}
        title={
          pendingToggle?.nextStatus ? "Activate product?" : "Deactivate product?"
        }
        message={
          pendingToggle
            ? `Are you sure you want to ${
                pendingToggle.nextStatus ? "activate" : "deactivate"
              } "${pendingToggle.product.name}"?`
            : ""
        }
        confirmText={pendingToggle?.nextStatus ? "Activate" : "Deactivate"}
        cancelText="Cancel"
      />
    </>
  );
};

export default ProductList;
