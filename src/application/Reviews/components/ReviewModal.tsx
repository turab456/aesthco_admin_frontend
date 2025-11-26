import React from "react";
import { Star } from "lucide-react";
import { CustomButton, CustomModal, ToggleSwitch } from "../../../components/custom";
import { ReviewResponse } from "../types";

type Props = {
  isOpen: boolean;
  review: ReviewResponse | null;
  onClose: () => void;
  onStatusChange: (payload: { isApproved?: boolean; isFeatured?: boolean }) => void;
  isUpdating?: boolean;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
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

const ReviewModal: React.FC<Props> = ({
  isOpen,
  review,
  onClose,
  onStatusChange,
  isUpdating = false,
}) => {
  if (!isOpen || !review) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="p-6"
      overlayClassName="z-[9999]"
      className="z-[10000]"
      showCloseButton
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between pr-12 md:pr-16">
          <div>
            <p className="text-xs text-gray-500">Product</p>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {review.product?.name || "Product removed"}
            </h4>
            <p className="text-sm text-gray-500">Order #{review.order?.id || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                review.isApproved
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {review.isApproved ? "Approved" : "Pending"}
            </span>
            {review.isFeatured && (
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-600" />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
            <p className="text-xs uppercase tracking-wide text-gray-500">Customer</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {review.user?.name || "Unknown"}
            </p>
            {review.user?.email && (
              <p className="text-xs text-gray-500">{review.user.email}</p>
            )}
            {review.user?.phoneNumber && (
              <p className="text-xs text-gray-500">{review.user.phoneNumber}</p>
            )}
          </div>
          <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
            <p className="text-xs uppercase tracking-wide text-gray-500">Order</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              #{review.order?.id || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              Status: {review.order?.status || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              Placed: {formatDate(review.order?.placedAt)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
            <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(review.createdAt)}
            </p>
            <p className="text-xs text-gray-500">
              Updated: {formatDate(review.updatedAt)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <p className="mt-3 text-gray-800 dark:text-gray-100">
            {review.comment || "No comment provided."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ToggleSwitch
            label="Approved"
            checked={review.isApproved}
            onChange={(value) =>
              onStatusChange({
                isApproved: value,
                ...(value ? {} : { isFeatured: false }),
              })
            }
            disabled={isUpdating}
            description="Approved reviews are visible on the storefront."
          />
          <ToggleSwitch
            label="Featured"
            checked={review.isFeatured}
            onChange={(value) => onStatusChange({ isFeatured: value })}
            disabled={!review.isApproved || isUpdating}
            description="Featured reviews are highlighted to customers."
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <CustomButton variant="outline" fullWidth={false} onClick={onClose} disabled={isUpdating}>
            Close
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ReviewModal;
