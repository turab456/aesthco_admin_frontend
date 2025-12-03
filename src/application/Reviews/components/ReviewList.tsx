import React, { useMemo } from "react";
import { Eye, Star, CheckCircle2, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { ReviewResponse } from "../types";

type Props = {
  data: ReviewResponse[];
  processingIds: Record<number, boolean>;
  onView: (review: ReviewResponse) => void;
  onToggleApproval: (review: ReviewResponse, next: boolean) => void;
  onToggleFeatured: (review: ReviewResponse, next: boolean) => void;
  onDelete: (review: ReviewResponse) => void;
};

const renderStars = (rating: number) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-4 w-4 ${
          idx < rating ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-1 text-sm text-gray-700">{rating.toFixed(1)}/5</span>
  </div>
);

const ReviewList: React.FC<Props> = ({
  data,
  processingIds,
  onView,
  onToggleApproval,
  onToggleFeatured,
  onDelete,
}) => {
  const columns: Array<ColumnDef<ReviewResponse>> = useMemo(
    () => [
      {
        key: "product",
        header: "Product",
        searchable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {row.product?.name || "Product removed"}
            </span>
            {row.product?.slug && (
              <span className="text-xs text-gray-500">{row.product.slug}</span>
            )}
          </div>
        ),
      },
      {
        key: "rating",
        header: "Rating",
        searchable: false,
        render: (row) => renderStars(row.rating),
      },

      {
        key: "user",
        header: "Customer",
        searchable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {row.user?.name || "Unknown user"}
            </span>
            {row.user?.email && (
              <span className="text-xs text-gray-500">{row.user.email}</span>
            )}
          </div>
        ),
      },
      {
        key: "isApproved",
        header: "Status",
        searchable: false,
        render: (row) => (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              row.isApproved
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                row.isApproved ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            {row.isApproved ? "Approved" : "Pending"}
          </span>
        ),
      },
      {
        key: "isFeatured",
        header: "Featured",
        searchable: false,
        render: (row) => (
          <div className="flex items-center gap-1">
            <Star
              className={`h-4 w-4 ${
                row.isFeatured
                  ? "text-yellow-500 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">
              {row.isFeatured ? "Featured" : "Normal"}
            </span>
          </div>
        ),
      },
      {
        key: "id",
        header: "Actions",
        searchable: false,
        render: (row) => {
          const isProcessing = Boolean(processingIds[row.id]);
          return (
            <div className="flex items-center gap-2">
              <Eye
                className="h-4 w-4 cursor-pointer hover:text-blue-600"
                onClick={() => onView(row)}
              />
              <CheckCircle2
                className={`h-4 w-4 cursor-pointer ${
                  row.isApproved
                    ? "text-green-600 hover:text-green-700"
                    : "text-gray-500 hover:text-green-600"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (isProcessing) return;
                  onToggleApproval(row, !row.isApproved);
                }}
              />
              <Star
                className={`h-4 w-4 cursor-pointer ${
                  row.isFeatured
                    ? "text-yellow-500 fill-yellow-400"
                    : "text-gray-400"
                } ${
                  !row.isApproved || isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-yellow-500"
                }`}
                onClick={() => {
                  if (!row.isApproved || isProcessing) return;
                  onToggleFeatured(row, !row.isFeatured);
                }}
              />
              <Trash2
                className={`h-4 w-4 cursor-pointer hover:text-red-600 ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (isProcessing) return;
                  onDelete(row);
                }}
              />
            </div>
          );
        },
      },
    ],
    [processingIds, onDelete, onToggleApproval, onToggleFeatured, onView]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row) =>
        `${row.product?.name || "Review"} - ${row.user?.name || ""}`
      }
      onSuggestionSelect={onView}
    />
  );
};

export default ReviewList;
