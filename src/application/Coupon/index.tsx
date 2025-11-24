import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { useModal } from "../../hooks/useModal";
import CouponApi from "./api/CouponApi";
import {
  CouponFormState,
  CouponPayload,
  CouponResponse,
  CouponType,
  DiscountType,
} from "./types";
import CouponList from "./components/CouponList";
import AddCouponModal from "./components/AddCouponModal";
import { CustomButton } from "../../components/custom";

const INITIAL_FORM: CouponFormState = {
  code: "",
  type: "WELCOME",
  discountType: "PERCENT",
  discountValue: "",
  startAt: "",
  endAt: "",
  globalMaxRedemptions: "",
  perUserLimit: "1",
  minOrderAmount: "",
  maxDiscountAmount: "",
  isActive: true,
};

const CouponManagement: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [form, setForm] = useState<CouponFormState>({ ...INITIAL_FORM });
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchCoupons = useCallback(async () => {
    const data = await CouponApi.list();
    setCoupons(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchCoupons();
      } catch (err) {
        console.error("Failed to load coupons:", err);
        setError("Failed to load coupons. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchCoupons]);

  const handleFormChange = (key: keyof CouponFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mapCouponToForm = useCallback(
    (coupon: CouponResponse | null): CouponFormState => {
      if (!coupon) return { ...INITIAL_FORM };
      const start = coupon.startAt
        ? new Date(coupon.startAt).toISOString().slice(0, 16)
        : "";
      const end = coupon.endAt
        ? new Date(coupon.endAt).toISOString().slice(0, 16)
        : "";
      return {
        code: coupon.code || "",
        type: (coupon.type as CouponType) || "OTHER",
        discountType: (coupon.discountType as DiscountType) || "PERCENT",
        discountValue: coupon.discountValue?.toString() || "",
        startAt: start,
        endAt: end,
        globalMaxRedemptions:
          coupon.globalMaxRedemptions !== undefined &&
          coupon.globalMaxRedemptions !== null
            ? coupon.globalMaxRedemptions.toString()
            : "",
        perUserLimit:
          coupon.perUserLimit !== undefined && coupon.perUserLimit !== null
            ? coupon.perUserLimit.toString()
            : "1",
        minOrderAmount:
          coupon.minOrderAmount !== undefined && coupon.minOrderAmount !== null
            ? coupon.minOrderAmount.toString()
            : "",
        maxDiscountAmount:
          coupon.maxDiscountAmount !== undefined &&
          coupon.maxDiscountAmount !== null
            ? coupon.maxDiscountAmount.toString()
            : "",
        isActive: Boolean(coupon.isActive),
      };
    },
    []
  );

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.code.trim()) errors.code = "Coupon code is required.";
    if (!form.discountType) errors.discountType = "Discount type is required.";
    const discountValue = Number(form.discountValue);
    if (Number.isNaN(discountValue) || discountValue <= 0) {
      errors.discountValue = "Discount value must be greater than zero.";
    }
    if (form.discountType === "PERCENT" && discountValue > 100) {
      errors.discountValue = "Percent discount cannot exceed 100.";
    }
    if (form.startAt && form.endAt) {
      const start = new Date(form.startAt);
      const end = new Date(form.endAt);
      if (start > end) {
        errors.date = "Start date must be before end date.";
      }
    }
    const perUser = Number(form.perUserLimit || "1");
    if (Number.isNaN(perUser) || perUser < 1) {
      errors.perUserLimit = "Per user limit must be at least 1.";
    }
    const globalLimit = form.globalMaxRedemptions
      ? Number(form.globalMaxRedemptions)
      : null;
    if (globalLimit !== null && (Number.isNaN(globalLimit) || globalLimit < 1)) {
      errors.globalMaxRedemptions =
        "Global redemption limit must be 1 or more.";
    }
    return errors;
  };

  const buildPayload = (): CouponPayload => ({
    code: form.code.trim().toUpperCase(),
    type: form.type,
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
    endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
    globalMaxRedemptions: form.globalMaxRedemptions
      ? Number(form.globalMaxRedemptions)
      : null,
    perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : 1,
    minOrderAmount: form.minOrderAmount
      ? Number(form.minOrderAmount)
      : null,
    maxDiscountAmount: form.maxDiscountAmount
      ? Number(form.maxDiscountAmount)
      : null,
    isActive: form.isActive,
  });

  const handleSave = async () => {
    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setFieldErrors(validation);
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setFieldErrors({});
      const payload = buildPayload();
      if (mode === "edit" && selectedCoupon) {
        await CouponApi.update(selectedCoupon.id, payload);
      } else {
        await CouponApi.create(payload);
      }
      await fetchCoupons();
      closeModal();
      setForm({ ...INITIAL_FORM });
      setSelectedCoupon(null);
    } catch (err: any) {
      console.error("Error saving coupon:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save coupon. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedCoupon(null);
    setForm({ ...INITIAL_FORM });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenEdit = (coupon: CouponResponse) => {
    setMode("edit");
    setSelectedCoupon(coupon);
    setForm(mapCouponToForm(coupon));
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleToggle = async (coupon: CouponResponse) => {
    try {
      await CouponApi.update(coupon.id, { isActive: !coupon.isActive });
      await fetchCoupons();
    } catch (err: any) {
      console.error("Failed to toggle coupon:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update coupon status.";
      alert(message);
    }
  };

  const stats = useMemo(() => {
    const active = coupons.filter((c) => c.isActive).length;
    const total = coupons.length;
    const welcome = coupons.filter((c) => c.type === "WELCOME").length;
    return { active, total, welcome };
  }, [coupons]);

  return (
    <>
      <PageMeta title="Coupon Management" description="Manage coupon rules" />
      <PageBreadcrumb pageTitle="Coupon Management" />

      {error && !isOpen && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error.includes(".") ? (
            <ul className="list-inside list-disc space-y-1">
              {error
                .split(". ")
                .filter((msg) => msg.trim())
                .map((msg, idx) => (
                  <li key={idx}>{msg.trim()}.</li>
                ))}
            </ul>
          ) : (
            error
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.active}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome coupons
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.welcome}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Loader label="Loading coupons..." fullHeight />
          </div>
        ) : (
          <CouponList
            data={coupons}
            onEdit={handleOpenEdit}
            onToggle={handleToggle}
            actionComponent={
              <CustomButton size="sm" variant="outline" onClick={handleOpenCreate}>
                Create Coupon
              </CustomButton>
            }
          />
        )}
      </div>

      <AddCouponModal
        isOpen={isOpen}
        onClose={closeModal}
        mode={mode}
        onSave={handleSave}
        form={form}
        onFormChange={handleFormChange}
        isSaving={isSaving}
        fieldErrors={fieldErrors}
        error={error}
      />
    </>
  );
};

export default CouponManagement;
