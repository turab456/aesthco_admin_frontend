import { useCallback, useEffect, useState } from "react";
import { CustomButton, ConfirmModal } from "../../components/custom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { CollectionsFormTypes, CollectionResponse } from "./types";
import { useModal } from "../../hooks/useModal";
import CollectionList from "./components/CollectionList";
import AddCollectionModal from "./components/AddCollectionModal";
import CollectionApi from "./api/CollectionApi";

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const INITIAL_FORM: CollectionsFormTypes = {
  name: "",
  slug: "",
};

const CollectionManagement = () => {
  const [form, setForm] = useState<CollectionsFormTypes>(INITIAL_FORM);
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedItem, setSelectedItem] = useState<CollectionResponse | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<CollectionResponse | null>(
    null
  );

  const fetchCollections = useCallback(async () => {
    const data = await CollectionApi.list();
    setCollections(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchCollections();
        setError(null);
      } catch (err) {
        console.error("Failed to load collections:", err);
        setError("Failed to load collections. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchCollections]);

  const handleFormChange = (key: keyof CollectionsFormTypes, value: any) => {
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
      errors.name = "Collection name is required.";
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
        await CollectionApi.update(selectedItem.id, payload);
      } else {
        await CollectionApi.create(payload);
      }
      await fetchCollections();
      closeModal();
    } catch (err: any) {
      console.error("Error saving collection:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save collection. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenView = (item: CollectionResponse) => {
    setModalMode("view");
    setSelectedItem(item);
    setForm({ name: item.name, slug: item.slug });
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenEdit = (item: CollectionResponse) => {
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
      await CollectionApi.remove(pendingDelete.id);
      await fetchCollections();
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting collection:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete collection. Please try again.";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Collection Management" description="Manage your collections" />
      <PageBreadcrumb pageTitle="Collection Management" />

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
            <Loader label="Loading collections..." fullHeight />
          </div>
        ) : (
          <CollectionList
            data={collections}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={(item) => setPendingDelete(item)}
            customAction={
              <CustomButton size="sm" variant="outline" fullWidth={false} onClick={handleOpenCreate}>
                Add Collection
              </CustomButton>
            }
          />
        )}
      </div>

      <AddCollectionModal
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
        title="Delete collection?"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default CollectionManagement;
