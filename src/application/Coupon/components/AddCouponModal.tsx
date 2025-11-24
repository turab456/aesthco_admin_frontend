import React from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomDropdown,
  CustomInput,
  CustomModal,
} from "../../../components/custom";
import { CouponFormState } from "../types";

const COUPON_TYPE_OPTIONS = [
  { label: "Welcome (first order)", value: "WELCOME" },
  { label: "Seasonal / Limited", value: "SEASONAL" },
  { label: "Other", value: "OTHER" },
];

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percent", value: "PERCENT" },
  { label: "Fixed Amount", value: "FIXED" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  onSave: () => void;
  form: CouponFormState;
  onFormChange: (key: keyof CouponFormState, value: any) => void;
  isSaving?: boolean;
  fieldErrors?: Record<string, string>;
  error?: string | null;
};

const AddCouponModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  onSave,
  form,
  onFormChange,
  isSaving = false,
  fieldErrors = {},
  error = null,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="no-scrollbar p-4 lg:p-11"
    >
      <div className="relative w-full">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {mode === "create" ? "Create Coupon" : "Edit Coupon"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Configure coupon rules, limits, and validity. Leave limits empty for
            unlimited usage.
          </p>
        </div>

        {error && (
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

        <form className="flex flex-col gap-6 px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <CustomInput
                label="Coupon Code"
                required
                type="text"
                placeholder="WELCOME10"
                value={form.code}
                onChange={(e) => onFormChange("code", e.target.value.toUpperCase())}
              />
              {fieldErrors.code && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.code}</p>
              )}
            </div>
            <div>
              <CustomDropdown
                label="Coupon Type"
                required
                value={form.type}
                options={COUPON_TYPE_OPTIONS}
                onChange={(e) => onFormChange("type", e.target.value)}
              />
            </div>
            <div>
              <CustomDropdown
                label="Discount Type"
                required
                value={form.discountType}
                options={DISCOUNT_TYPE_OPTIONS}
                onChange={(e) => onFormChange("discountType", e.target.value)}
              />
            </div>
            <div>
              <CustomInput
                label="Discount Value"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="10"
                value={form.discountValue}
                onChange={(e) => onFormChange("discountValue", e.target.value)}
              />
              {fieldErrors.discountValue && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.discountValue}
                </p>
              )}
            </div>
            <div>
              <CustomInput
                label="Start At"
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => onFormChange("startAt", e.target.value)}
              />
            </div>
            <div>
              <CustomInput
                label="End At"
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => onFormChange("endAt", e.target.value)}
              />
              {fieldErrors.date && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.date}</p>
              )}
            </div>
            <div>
              <CustomInput
                label="Global Redemption Limit"
                type="number"
                min="1"
                placeholder="First 100 customers"
                value={form.globalMaxRedemptions}
                onChange={(e) =>
                  onFormChange("globalMaxRedemptions", e.target.value)
                }
                helperText="Empty = unlimited"
              />
              {fieldErrors.globalMaxRedemptions && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.globalMaxRedemptions}
                </p>
              )}
            </div>
            <div>
              <CustomInput
                label="Per User Limit"
                type="number"
                min="1"
                placeholder="1"
                value={form.perUserLimit}
                onChange={(e) => onFormChange("perUserLimit", e.target.value)}
              />
              {fieldErrors.perUserLimit && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.perUserLimit}
                </p>
              )}
            </div>
            <div>
              <CustomInput
                label="Minimum Order Amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional"
                value={form.minOrderAmount}
                onChange={(e) => onFormChange("minOrderAmount", e.target.value)}
                helperText="Leave empty for no minimum"
              />
            </div>
            <div>
              <CustomInput
                label="Maximum Discount Amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional cap"
                value={form.maxDiscountAmount}
                onChange={(e) =>
                  onFormChange("maxDiscountAmount", e.target.value)
                }
                helperText="Empty = no cap"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CustomCheckbox
              checked={form.isActive}
              onChange={(e) => onFormChange("isActive", e.target.checked)}
              label="Coupon is active"
              helperText="Turn off to pause this coupon without deleting it."
            />
          </div>

          <div className="flex items-center gap-3 lg:justify-end">
            <CustomButton
              fullWidth={false}
              onClick={onClose}
              variant="outline"
              size="md"
            >
              Close
            </CustomButton>
            <CustomButton
              fullWidth={false}
              onClick={onSave}
              size="md"
              isLoading={isSaving}
            >
              {mode === "create" ? "Create Coupon" : "Save Changes"}
            </CustomButton>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default AddCouponModal;
