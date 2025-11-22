import React from "react";
import {
  CustomButton,
  CustomInput,
  CustomModal,
} from "../../../components/custom";
import { CategoryFormTypes } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  onSave: () => void;
  form: CategoryFormTypes;
  onFormChange: (key: keyof CategoryFormTypes, value: any) => void;
  isSaving?: boolean;
  fieldErrors?: Record<string, string>;
  error?: string | null;
};

const AddCategoryModal: React.FC<Props> = ({
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
  const isReadOnly = mode === "view";

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
            {mode === "create" && "Create Category"}
            {mode === "edit" && "Edit Category"}
            {mode === "view" && "Category Details"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "view"
              ? "Viewing category details."
              : "Fill category details to create or update your category listing."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form className="flex flex-col">
          <div className="px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <CustomInput
                  label="Name"
                  required
                  type="text"
                  placeholder="Enter category name"
                  value={form.categoryName}
                  onChange={(e) => onFormChange("categoryName", e.target.value)}
                  disabled={isReadOnly}
                />
                {fieldErrors.categoryName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.categoryName}</p>
                )}
              </div>
              <div>
                <CustomInput
                  label="Slug"
                  required
                  type="text"
                  placeholder="category-name-url"
                  value={form.slug}
                  onChange={(e) => onFormChange("slug", e.target.value)}
                  disabled
                />
              </div>

            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <CustomButton
              fullWidth={false}
              onClick={onClose}
              variant="outline"
              size="md"
            >
              Close
            </CustomButton>
            {mode !== "view" && (
              <CustomButton
                fullWidth={false}
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default AddCategoryModal;
