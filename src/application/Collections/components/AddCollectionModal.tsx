import React from "react";
import {
  CustomButton,
  CustomInput,
  CustomModal,
  ToggleSwitch,
} from "../../../components/custom";
import { CollectionsFormTypes } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  onSave: () => void;
  form: CollectionsFormTypes;
  onFormChange: (key: keyof CollectionsFormTypes, value: any) => void;
  isSaving?: boolean;
  fieldErrors?: Record<string, string>;
  error?: string | null;
};

const AddCollectionModal: React.FC<Props> = ({
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
  const showOrderInput = form.showOnHome;

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
            {mode === "create" && "Create Collection"}
            {mode === "edit" && "Edit Collection"}
            {mode === "view" && "Collection Details"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "view"
              ? "Viewing collection details."
              : "Fill collection details to create or update your collection listing."}
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

        <form className="flex flex-col">
          <div className="px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <CustomInput
                  label="Name"
                  required
                  type="text"
                  placeholder="Enter collection name"
                  value={form.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  disabled={isReadOnly}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <CustomInput
                  label="Slug"
                  required
                  type="text"
                  placeholder="collection-name-url"
                  value={form.slug}
                  onChange={(e) => onFormChange("slug", e.target.value)}
                  disabled
                />
                {fieldErrors.slug && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.slug}</p>
                )}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <ToggleSwitch
                label="Show on Home"
                checked={form.showOnHome}
                onChange={(value) => onFormChange("showOnHome", value)}
                disabled={isReadOnly}
                description="Enable to feature this collection on the home page."
              />
              <div>
                <CustomInput
                  label="Home Order (optional)"
                  type="number"
                  placeholder="e.g., 1 for top slot"
                  value={form.homeOrder?.toString() ?? ""}
                  onChange={(e) => onFormChange("homeOrder", Number(e.target.value) || null)}
                  disabled={isReadOnly || !showOrderInput}
                />
                {fieldErrors.homeOrder && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.homeOrder}</p>
                )}
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

export default AddCollectionModal;
