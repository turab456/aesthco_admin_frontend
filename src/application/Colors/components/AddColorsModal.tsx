import React from "react";
import {
  CustomButton,
  CustomInput,
  CustomModal,
} from "../../../components/custom";
import { ColorFormTypes } from "../types";
import { ChromePicker, ColorResult } from "react-color";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  onSave: () => void;
  form: ColorFormTypes;
  onFormChange: (key: keyof ColorFormTypes, value: any) => void;
  isSaving?: boolean;
  fieldErrors?: Record<string, string>;
  error?: string | null;
};

const AddColorsModal: React.FC<Props> = ({
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

  const handleColorPick = (color: ColorResult) => {
    onFormChange("hexCode", color.hex);
    if (!form.code) {
      onFormChange("code", color.hex.replace("#", "").toUpperCase());
    }
  };

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
            {mode === "create" && "Create Color"}
            {mode === "edit" && "Edit Color"}
            {mode === "view" && "Color Details"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "view"
              ? "Viewing color details."
              : "Fill color details to create or update your color listing."}
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
                  label="Color Name"
                  required
                  type="text"
                  placeholder="Enter color name"
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
                  label="Color Code"
                  required
                  type="text"
                  placeholder="Enter color code"
                  value={form.code}
                  onChange={(e) => onFormChange("code", e.target.value)}
                  disabled={isReadOnly}
                />
                {fieldErrors.code && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.code}</p>
                )}
              </div>
              <div>
                <CustomInput
                  label="Hex Code"
                  required
                  type="text"
                  placeholder="#000000"
                  value={form.hexCode}
                  onChange={(e) => onFormChange("hexCode", e.target.value)}
                  disabled={isReadOnly}
                />
                {fieldErrors.hexCode && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.hexCode}</p>
                )}
                {!isReadOnly && (
                  <div className="mt-3 space-y-3 rounded-lg border border-gray-200 p-3">
                    <ChromePicker
                      color={form.hexCode || "#000000"}
                      onChange={handleColorPick}
                      disableAlpha
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span
                        className="h-6 w-6 rounded border"
                        style={{ background: form.hexCode || "#000000" }}
                        aria-label="Selected color swatch"
                      />
                      <span>
                        {(form.name || "Color").trim()}{" "}
                        {form.code ? `(${form.code})` : ""} –{" "}
                        {form.hexCode || "#000000"}
                      </span>
                    </div>
                  </div>
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

export default AddColorsModal;
