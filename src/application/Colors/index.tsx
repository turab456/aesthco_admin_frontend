import { useCallback, useEffect, useState } from "react";
import { CustomButton, ConfirmModal } from "../../components/custom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { useModal } from "../../hooks/useModal";
import { ColorFormTypes, ColorResponse } from "./types";
import ColorsLists from "./components/ColorsList";
import AddColorsModal from "./components/AddColorsModal";
import ColourApi from "./api/ColourApi";

const INITIAL_FORM: ColorFormTypes = {
  name: "",
  code: "",
  hexCode: "",
};

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const ColorsManagement = () => {
  const [form, setForm] = useState<ColorFormTypes>(INITIAL_FORM);
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedItem, setSelectedItem] = useState<ColorResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<ColorResponse | null>(
    null
  );

  const fetchColors = useCallback(async () => {
    const data = await ColourApi.list();
    setColors(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchColors();
        setError(null);
      } catch (err) {
        console.error("Failed to load colors:", err);
        setError("Failed to load colors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchColors]);

  const handleFormChange = (key: keyof ColorFormTypes, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Color name is required.";
    }
    if (!form.code.trim()) {
      errors.code = "Color code is required.";
    }
    if (!form.hexCode.trim()) {
      errors.hexCode = "Hex code is required.";
    } else if (!HEX_REGEX.test(form.hexCode.trim())) {
      errors.hexCode = "Enter a valid hex code (e.g., #000000).";
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
        name: form.name.trim(),
        code: form.code.trim(),
        hexCode: form.hexCode.trim(),
      };
      if (modalMode === "edit" && selectedItem) {
        await ColourApi.update(selectedItem.id, payload);
      } else {
        await ColourApi.create(payload);
      }
      await fetchColors();
      closeModal();
    } catch (err: any) {
      console.error("Error saving color:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save color. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenView = (item: ColorResponse) => {
    setModalMode("view");
    setSelectedItem(item);
    setForm({
      name: item.name,
      code: item.code,
      hexCode: item.hexCode,
    });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenEdit = (item: ColorResponse) => {
    setModalMode("edit");
    setSelectedItem(item);
    setForm({
      name: item.name,
      code: item.code,
      hexCode: item.hexCode,
    });
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
      await ColourApi.remove(pendingDelete.id);
      await fetchColors();
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting color:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete color. Please try again.";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Colors Management" description="Manage your colors" />
      <PageBreadcrumb pageTitle="Colors Management" />

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
            <Loader label="Loading colors..." fullHeight />
          </div>
        ) : (
          <ColorsLists
            data={colors}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={(item) => setPendingDelete(item)}
            customAction={
              <CustomButton size="sm" variant="outline" fullWidth={false} onClick={handleOpenCreate}>
                Add Color
              </CustomButton>
            }
          />
        )}
      </div>

      <AddColorsModal
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
        title="Delete color?"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ColorsManagement;
