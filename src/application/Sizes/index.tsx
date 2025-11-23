import React, { useCallback, useEffect, useState } from "react";
import { CustomButton, ConfirmModal } from "../../components/custom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { useModal } from "../../hooks/useModal";
import SizeLists from "./components/SizeLists";
import AddSizesModal from "./components/AddSizesModal";
import { SizeFormTypes, SizeResponse } from "./types";
import SizeApi from "./api/SizeApi";

const INITIAL_FORM: SizeFormTypes = {
  code: "",
  label: "",
};

const SizeManagement = () => {
  const [form, setForm] = useState<SizeFormTypes>(INITIAL_FORM);
  const [sizes, setSizes] = useState<SizeResponse[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedItem, setSelectedItem] = useState<SizeResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<SizeResponse | null>(
    null
  );

  const fetchSizes = useCallback(async () => {
    const data = await SizeApi.list();
    setSizes(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchSizes();
        setError(null);
      } catch (err) {
        console.error("Failed to load sizes:", err);
        setError("Failed to load sizes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchSizes]);

  const handleFormChange = (key: keyof SizeFormTypes, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.code.trim()) {
      errors.code = "Size code is required.";
    }
    if (!form.label.trim()) {
      errors.label = "Size label is required.";
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix validation errors.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setFieldErrors({});
      const payload = {
        code: form.code.trim(),
        label: form.label.trim(),
      };
      if (modalMode === "edit" && selectedItem) {
        await SizeApi.update(selectedItem.id, payload);
      } else {
        await SizeApi.create(payload);
      }
      await fetchSizes();
      closeModal();
    } catch (err: any) {
      console.error("Error saving size:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save size. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenView = (item: SizeResponse) => {
    setModalMode("view");
    setSelectedItem(item);
    setForm({ code: item.code, label: item.label });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenEdit = (item: SizeResponse) => {
    setModalMode("edit");
    setSelectedItem(item);
    setForm({ code: item.code, label: item.label });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      setIsDeleting(true);
      await SizeApi.remove(pendingDelete.id);
      await fetchSizes();
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting size:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete size. Please try again.";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Size Management" description="Manage your sizes" />
      <PageBreadcrumb pageTitle="Size Management" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Loader label="Loading sizes..." fullHeight />
          </div>
        ) : (
          <SizeLists
            data={sizes}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={(item) => setPendingDelete(item)}
            customAction={
              <CustomButton size="sm" variant="outline" fullWidth={false} onClick={handleOpenCreate}>
                Add Size
              </CustomButton>
            }
          />
        )}
      </div>

      <AddSizesModal
        isOpen={isOpen}
        onClose={closeModal}
        mode={modalMode}
        onSave={handleSave}
        form={form}
        onFormChange={handleFormChange}
        isSaving={isSaving}
        fieldErrors={fieldErrors}
        error={error}
      />

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onCancel={() => {
          if (isDeleting) return;
          setPendingDelete(null);
        }}
        onConfirm={handleDelete}
        isProcessing={isDeleting}
        title="Delete size?"
        message={`Are you sure you want to delete "${pendingDelete?.label}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default SizeManagement;
