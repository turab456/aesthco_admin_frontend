import React, { useCallback, useEffect, useState } from "react";
import { Star, Trash2, RefreshCcw } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import {
  ConfirmModal,
  CustomButton,
  CustomModal,
  ToggleSwitch,
} from "../../components/custom";
import ReviewsApi from "./api/ReviewsApi";
import { ReviewFilters, ReviewResponse } from "./types";
import ReviewList from "./components/ReviewList";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const renderStars = (rating: number) => {
  return (
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
};

const ReviewsPage: React.FC = () => {
  const [filters, setFilters] = useState<ReviewFilters>({
    status: "pending",
    rating: null,
  });
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Record<number, boolean>>(
    {}
  );
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ReviewResponse | null>(
    null
  );
  const [statusUpdating, setStatusUpdating] = useState(false);

  const refreshReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReviewsApi.list(filters);
      setReviews(data);
    } catch (err: any) {
      console.error("Failed to load reviews:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load reviews. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refreshReviews();
  }, [refreshReviews]);

  const updateReviewInState = (updated: ReviewResponse) => {
    setReviews((prev) =>
      prev.map((rev) => (rev.id === updated.id ? updated : rev))
    );
    setSelectedReview((prev) =>
      prev && prev.id === updated.id ? updated : prev
    );
  };

  const handleToggleApproval = async (
    review: ReviewResponse,
    nextApproval: boolean
  ) => {
    setProcessingIds((prev) => ({ ...prev, [review.id]: true }));
    try {
      const updated = await ReviewsApi.updateStatus(review.id, {
        isApproved: nextApproval,
        ...(nextApproval ? {} : { isFeatured: false }),
      });
      updateReviewInState(updated);
    } catch (err: any) {
      console.error("Failed to update approval:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update review status.";
      setError(message);
    } finally {
      setProcessingIds((prev) => {
        const next = { ...prev };
        delete next[review.id];
        return next;
      });
    }
  };

  const handleToggleFeatured = async (
    review: ReviewResponse,
    nextFeatured: boolean
  ) => {
    if (!review.isApproved) return;
    setProcessingIds((prev) => ({ ...prev, [review.id]: true }));
    try {
      const updated = await ReviewsApi.updateStatus(review.id, {
        isFeatured: nextFeatured,
      });
      updateReviewInState(updated);
    } catch (err: any) {
      console.error("Failed to update featured state:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update featured state.";
      setError(message);
    } finally {
      setProcessingIds((prev) => {
        const next = { ...prev };
        delete next[review.id];
        return next;
      });
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setProcessingIds((prev) => ({ ...prev, [pendingDelete.id]: true }));
    try {
      await ReviewsApi.remove(pendingDelete.id);
      setReviews((prev) =>
        prev.filter((review) => review.id !== pendingDelete.id)
      );
      if (selectedReview?.id === pendingDelete.id) {
        setSelectedReview(null);
        setIsDetailOpen(false);
      }
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Failed to delete review:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete review.";
      setError(message);
    } finally {
      setProcessingIds((prev) => {
        const next = { ...prev };
        delete next[pendingDelete.id];
        return next;
      });
    }
  };

  const handleModalStatusChange = async (payload: {
    isApproved?: boolean;
    isFeatured?: boolean;
  }) => {
    if (!selectedReview) return;
    setStatusUpdating(true);
    try {
      const updated = await ReviewsApi.updateStatus(selectedReview.id, payload);
      updateReviewInState(updated);
    } catch (err: any) {
      console.error("Failed to update review from modal:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update review.";
      setError(message);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <>
      <PageMeta title="Product Reviews" description="Manage customer reviews" />
      <PageBreadcrumb pageTitle="Product Reviews" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">Status</label>
          <select
            value={filters.status || "all"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value as ReviewFilters["status"],
              }))
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>

          <label className="text-sm text-gray-600">Rating</label>
          <div className="flex gap-1">
            <button
              className={`rounded-lg px-3 py-2 text-sm ${
                !filters.rating
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white"
              }`}
              onClick={() => setFilters((prev) => ({ ...prev, rating: null }))}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`rounded-lg px-3 py-2 text-sm ${
                  filters.rating === rating
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, rating: rating }))
                }
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>

        <CustomButton
          size="sm"
          variant="outline"
          fullWidth={false}
          onClick={() => void refreshReviews()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </CustomButton>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <Loader label="Loading reviews..." fullHeight />
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No reviews found for the selected filters.
          </div>
        ) : (
          <ReviewList
            data={reviews}
            processingIds={processingIds}
            onView={(review) => {
              setSelectedReview(review);
              setIsDetailOpen(true);
            }}
            onToggleApproval={(review, next) =>
              handleToggleApproval(review, next)
            }
            onToggleFeatured={(review, next) =>
              handleToggleFeatured(review, next)
            }
            onDelete={(review) => setPendingDelete(review)}
          />
        )}
      </div>

      <CustomModal
        isOpen={isDetailOpen && Boolean(selectedReview)}
        onClose={() => setIsDetailOpen(false)}
        size="xl"
        contentClassName="p-6"
      >
        {selectedReview && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {selectedReview.product?.name || "Product removed"}
                </h4>
                <p className="text-sm text-gray-500">
                  Order #{selectedReview.order?.id || "N/A"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedReview.isApproved
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedReview.isApproved ? "Approved" : "Pending"}
                </span>
                {selectedReview.isFeatured && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-600" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Customer
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedReview.user?.name || "Unknown"}
                </p>
                {selectedReview.user?.email && (
                  <p className="text-xs text-gray-500">
                    {selectedReview.user.email}
                  </p>
                )}
                {selectedReview.user?.phoneNumber && (
                  <p className="text-xs text-gray-500">
                    {selectedReview.user.phoneNumber}
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Order
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  #{selectedReview.order?.id || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Status: {selectedReview.order?.status || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  Placed: {formatDate(selectedReview.order?.placedAt)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Created
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedReview.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                  Updated: {formatDate(selectedReview.updatedAt)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                {renderStars(selectedReview.rating)}
                <span className="text-sm text-gray-500">
                  {formatDate(selectedReview.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-gray-800 dark:text-gray-100">
                {selectedReview.comment || "No comment provided."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ToggleSwitch
                label="Approved"
                checked={selectedReview.isApproved}
                onChange={(value) =>
                  handleModalStatusChange({
                    isApproved: value,
                    ...(value ? {} : { isFeatured: false }),
                  })
                }
                disabled={statusUpdating}
                description="Approved reviews are visible on the storefront."
              />
              <ToggleSwitch
                label="Featured"
                checked={selectedReview.isFeatured}
                onChange={(value) =>
                  handleModalStatusChange({ isFeatured: value })
                }
                disabled={!selectedReview.isApproved || statusUpdating}
                description="Featured reviews are highlighted to customers."
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <CustomButton
                variant="outline"
                fullWidth={false}
                onClick={() => setPendingDelete(selectedReview)}
                disabled={statusUpdating}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Review
              </CustomButton>
              <CustomButton
                fullWidth={false}
                onClick={() => setIsDetailOpen(false)}
                disabled={statusUpdating}
              >
                Close
              </CustomButton>
            </div>
          </div>
        )}
      </CustomModal>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onCancel={() => {
          if (pendingDelete && processingIds[pendingDelete.id]) return;
          setPendingDelete(null);
        }}
        onConfirm={handleDelete}
        isProcessing={
          pendingDelete ? Boolean(processingIds[pendingDelete.id]) : false
        }
        title="Delete review?"
        message="This review will be permanently removed from the system."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ReviewsPage;
