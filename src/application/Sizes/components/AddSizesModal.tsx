import React from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import FileInput from "../../../components/form/input/FileInput";
import { CustomButton, CustomInput } from "../../../components/custom";
import { SizeFormTypes } from "../types";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  onSave: () => void;
  form: SizeFormTypes;
  onFormChange: (key: keyof SizeFormTypes, value: any) => void;
  
};

const AddSizesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  onSave,
  form,
  onFormChange,

}) => {
  const isReadOnly = mode === "view";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] h-full ">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {mode === "create" && "Create Size"}
            {mode === "edit" && "Edit Size"}
            {mode === "view" && "Size Details"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "view"
              ? "Viewing Size details."
              : "Fill Size details to create or update your Size listing."}
          </p>
        </div>

        <form className="flex flex-col">
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <CustomInput
                  label="Size Code *"
                  type="text"
                  placeholder="Enter code name"
                  value={form.code}
                  onChange={(e) => onFormChange("code", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <CustomInput
                  label="Size Label *"
                  type="text"
                  placeholder="size label"
                  value={form.label}
                  onChange={(e) => onFormChange("label", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
             
             

             

            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <CustomButton
              fullWidth={false}
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                color: "#111827",
                border: "1px solid #d1d5db",
              }}
            >
              Close
            </CustomButton>
            {mode !== "view" && (
              <CustomButton fullWidth={false} onClick={onSave}>
                Save Changes
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSizesModal;
