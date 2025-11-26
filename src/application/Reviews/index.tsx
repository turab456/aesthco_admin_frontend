import React, { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { ConfirmModal, } from "../../components/custom";
import ReviewsApi from "./api/ReviewsApi";
import { ReviewFilters, ReviewResponse } from "./types";
import ReviewList from "./components/ReviewList";
import ReviewModal from "./components/ReviewModal";




const ReviewsPage: React.FC = () => {
  const [filters, setFilters] = useState<ReviewFilters>({
    status: "all",
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


      </div>

      <div className="">
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

      <ReviewModal
        isOpen={isDetailOpen && Boolean(selectedReview)}
        review={selectedReview}
        onClose={() => setIsDetailOpen(false)}
        onStatusChange={handleModalStatusChange}
        isUpdating={statusUpdating}
      />

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
