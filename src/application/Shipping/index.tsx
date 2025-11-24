import React, { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { CustomButton, CustomCheckbox, CustomInput } from "../../components/custom";
import ShippingApi from "./api/ShippingApi";
import { ShippingFormState, ShippingSetting } from "./types";

const INITIAL_FORM: ShippingFormState = {
  freeShippingThreshold: "",
  shippingFee: "",
  isActive: true,
};

const ShippingSettings: React.FC = () => {
  const [form, setForm] = useState<ShippingFormState>({ ...INITIAL_FORM });
  const [currentSetting, setCurrentSetting] = useState<ShippingSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSetting = useCallback(async () => {
    const data = await ShippingApi.getActiveSetting();
    setCurrentSetting(data);
    if (data) {
      setForm({
        freeShippingThreshold: data.freeShippingThreshold?.toString() || "",
        shippingFee: data.shippingFee?.toString() || "",
        isActive: Boolean(data.isActive),
      });
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchSetting();
        setError(null);
      } catch (err) {
        console.error("Failed to load shipping settings:", err);
        setError("Failed to load shipping settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchSetting]);

  const handleFormChange = (key: keyof ShippingFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const threshold = Number(form.freeShippingThreshold || "0");
    const fee = Number(form.shippingFee || "0");
    if (Number.isNaN(threshold) || threshold < 0) {
      return "Free shipping threshold must be zero or more.";
    }
    if (Number.isNaN(fee) || fee < 0) {
      return "Shipping fee must be zero or more.";
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      await ShippingApi.saveSetting({
        freeShippingThreshold: Number(form.freeShippingThreshold || "0"),
        shippingFee: Number(form.shippingFee || "0"),
        isActive: form.isActive,
      });
      await fetchSetting();
      setSuccess("Shipping settings saved.");
    } catch (err: any) {
      console.error("Failed to save shipping settings:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Could not save shipping settings.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Shipping & Threshold"
        description="Manage shipping fee and free-shipping threshold"
      />
      <PageBreadcrumb pageTitle="Shipping & Threshold" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Loader label="Loading shipping settings..." fullHeight />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configure shipping charges
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set your free-shipping threshold and default shipping fee. Only one active setting is used for checkout.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomInput
              label="Free Shipping Threshold"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1999"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                handleFormChange("freeShippingThreshold", e.target.value)
              }
              helperText="Orders at or above this value get free shipping."
            />
            <CustomInput
              label="Shipping Fee"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 99"
              value={form.shippingFee}
              onChange={(e) => handleFormChange("shippingFee", e.target.value)}
              helperText="Applied when order total is below the threshold."
            />
          </div>

          <div className="mt-4">
            <CustomCheckbox
              checked={form.isActive}
              onChange={(e) => handleFormChange("isActive", e.target.checked)}
              label="Setting is active"
              helperText="Deactivate to temporarily ignore this setting."
            />
          </div>

          <div className="mt-6 flex flex-col gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-800/40 dark:text-gray-200">
            <div className="flex items-center justify-between">
              <span>Current active threshold</span>
              <span className="font-semibold">
                {currentSetting?.freeShippingThreshold ?? "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current shipping fee</span>
              <span className="font-semibold">
                {currentSetting?.shippingFee ?? "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-semibold">
                {currentSetting
                  ? currentSetting.isActive
                    ? "Active"
                    : "Inactive"
                  : "Not set"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 md:justify-end">
            <CustomButton
              fullWidth={false}
              variant="outline"
              onClick={() => setForm(mapToForm(currentSetting))}
            >
              Reset
            </CustomButton>
            <CustomButton
              fullWidth={false}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Save Settings
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
};

const mapToForm = (setting: ShippingSetting | null): ShippingFormState => {
  if (!setting) return { ...INITIAL_FORM };
  return {
    freeShippingThreshold: setting.freeShippingThreshold?.toString() || "",
    shippingFee: setting.shippingFee?.toString() || "",
    isActive: Boolean(setting.isActive),
  };
};

export default ShippingSettings;
