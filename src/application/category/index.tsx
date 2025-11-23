import React, { useCallback, useEffect, useState } from "react";
import { CustomButton, ConfirmModal } from "../../components/custom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { CategoryFormTypes, CategoryResponse } from "./types";
import { useModal } from "../../hooks/useModal";
import CategoryList from "./components/CategoryList";
import AddCategoryModal from "./components/AddCategoryModal";
import CategoryApi from "./api/CategoryApi";

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const INITIAL_FORM: CategoryFormTypes = {
  name: "",
  slug: "",
};

const CategoryManagement = () => {
  const [form, setForm] = useState<CategoryFormTypes>(INITIAL_FORM);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedItem, setSelectedItem] = useState<CategoryResponse | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<CategoryResponse | null>(
    null
  );

  const fetchCategories = useCallback(async () => {
    const data = await CategoryApi.list();
    setCategories(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchCategories();
        setError(null);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchCategories]);

  const handleFormChange = (key: keyof CategoryFormTypes, value: any) => {
    if (key === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Category name is required.";
    }
    if (!form.slug.trim()) {
      errors.slug = "Slug is required.";
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
        slug: form.slug.trim(),
      };
      if (modalMode === "edit" && selectedItem) {
        await CategoryApi.update(selectedItem.id, payload);
      } else {
        await CategoryApi.create(payload);
      }
      await fetchCategories();
      closeModal();
    } catch (err: any) {
      console.error("Error saving category:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save category. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenView = (item: CategoryResponse) => {
    setModalMode("view");
    setSelectedItem(item);
    setForm({ name: item.name, slug: item.slug });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenEdit = (item: CategoryResponse) => {
    setModalMode("edit");
    setSelectedItem(item);
    setForm({ name: item.name, slug: item.slug });
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
      await CategoryApi.remove(pendingDelete.id);
      await fetchCategories();
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting category:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete category. Please try again.";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Category Management" description="Manage your categories" />
      <PageBreadcrumb pageTitle="Category Management" />

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
            <Loader label="Loading categories..." fullHeight />
          </div>
        ) : (
          <CategoryList
            data={categories}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={(item) => setPendingDelete(item)}
            customAction={
              <CustomButton size="sm" variant="outline" onClick={handleOpenCreate} fullWidth={false}>
                Add Category
              </CustomButton>
            }
          />
        )}
      </div>

      <AddCategoryModal
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
        title="Delete category?"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default CategoryManagement;
