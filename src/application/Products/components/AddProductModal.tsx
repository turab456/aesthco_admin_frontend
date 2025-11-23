import React from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomDropdown,
  CustomFileInput,
  CustomInput,
  CustomInputLabel,
  CustomModal,
  CustomTextarea,
} from "../../../components/custom";
import {
  ProductFormState,
  VariantState,
  ImageState,
  SelectOption,
  MasterData,
} from "../types";
import ImagePreview from "./ImagePreview";

const GENDER_OPTIONS: SelectOption[] = [
  { value: "", label: "Select" },
  { value: "MEN", label: "MEN" },
  { value: "WOMEN", label: "WOMEN" },
  { value: "UNISEX", label: "UNISEX" },
];

const BOOLEAN_OPTIONS: SelectOption[] = [
  { value: "", label: "Select" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  onSave: () => void;
  form: ProductFormState;
  onFormChange: (key: keyof ProductFormState, value: any) => void;
  variants: VariantState[];
  setVariants: (value: VariantState[]) => void;
  images: ImageState[];
  setImages: (value: ImageState[]) => void;
  masterData: MasterData;
  isSaving?: boolean;
  fieldErrors?: Record<string, string>;
  error?: string | null;
};

const AddProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  onSave,
  form,
  onFormChange,
  variants,
  setVariants,
  images,
  setImages,
  masterData,
  isSaving = false,
  fieldErrors = {},
  error = null,
}) => {
  const isReadOnly = mode === "view";
  
  // Parse variant errors from error message
  const getVariantErrors = (errorMsg: string | null) => {
    const variantErrors: Record<number, Record<string, string>> = {};
    if (!errorMsg) return variantErrors;
    
    // Match patterns like "Variant 1: Color is required."
    const variantErrorRegex = /Variant (\d+): (.+?)(?=Variant \d+:|$)/g;
    let match;
    
    while ((match = variantErrorRegex.exec(errorMsg)) !== null) {
      const variantNum = parseInt(match[1]) - 1; // Convert to 0-indexed
      const errorText = match[2].trim();
      
      if (!variantErrors[variantNum]) {
        variantErrors[variantNum] = {};
      }
      
      // Parse field-specific errors
      if (errorText.includes('Color is required')) {
        variantErrors[variantNum].color = 'Color is required.';
      }
      if (errorText.includes('Size is required')) {
        variantErrors[variantNum].size = 'Size is required.';
      }
      if (errorText.includes('SKU is required')) {
        variantErrors[variantNum].sku = 'SKU is required.';
      }
      if (errorText.includes('Stock quantity is required')) {
        variantErrors[variantNum].stock = 'Stock quantity is required.';
      }
      if (errorText.includes('Base price is required')) {
        variantErrors[variantNum].base_price = 'Base price is required.';
      }
    }
    
    return variantErrors;
  };
  
  const variantErrors = getVariantErrors(error);

  const withFallback = (options: SelectOption[], emptyLabel: string) => {
    if (options.length === 0) {
      return [{ value: "", label: emptyLabel }];
    }
    // Always prepend "Select" option if not already present
    const hasSelectOption = options.some((opt) => opt.value === "");
    return hasSelectOption ? options : [{ value: "", label: "Select" }, ...options];
  };

  const variantColorOptions = React.useMemo(() => {
    const usedColors = Array.from(
      new Set(variants.map((v) => v.color).filter(Boolean))
    );
    return masterData.colors.filter((c) => usedColors.includes(c.value));
  }, [variants, masterData.colors]);

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
            {mode === "create" && "Create Product"}
            {mode === "edit" && "Edit Product"}
            {mode === "view" && "Product Details"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "view"
              ? "Viewing product details."
              : "Fill product details to create or update your product listing."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error.includes('.') ? (
              <ul className="list-inside list-disc space-y-1">
                {error.split('. ').filter(msg => msg.trim()).map((msg, idx) => (
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
                  placeholder="Enter product name"
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
                  placeholder="product-name-url"
                  value={form.slug}
                  onChange={(e) => onFormChange("slug", e.target.value)}
                  disabled
                />
              </div>
              <div className="lg:col-span-2">
                <CustomInput
                  label="Short Description"
                  required
                  type="text"
                  placeholder="One or two sentences about the product"
                  value={form.short_description}
                  onChange={(e) =>
                    onFormChange("short_description", e.target.value)
                  }
                  disabled={isReadOnly}
                />
                {fieldErrors.short_description && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.short_description}</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <CustomTextarea
                  label="Description"
                  required
                  rows={4}
                  placeholder="Detailed product description"
                  value={form.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                  disabled={isReadOnly}
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
                )}
              </div>
              <div>
                <CustomDropdown
                  label="Gender"
                  required
                  value={form.gender}
                  onChange={(e) => onFormChange("gender", e.target.value)}
                  disabled={isReadOnly}
                  options={GENDER_OPTIONS}
                />
                {fieldErrors.gender && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>
                )}
              </div>
              <div>
                <CustomDropdown
                  label="Category"
                  required
                  value={form.category_id}
                  onChange={(e) => onFormChange("category_id", e.target.value)}
                  disabled={isReadOnly}
                  options={withFallback(masterData.categories, "No categories")}
                />
                {fieldErrors.category_id && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.category_id}</p>
                )}
              </div>
              <div>
                <CustomDropdown
                  label="Collection"
                  value={form.collection_id}
                  onChange={(e) =>
                    onFormChange("collection_id", e.target.value)
                  }
                  disabled={isReadOnly}
                  options={withFallback(
                    masterData.collections,
                    "No collections"
                  )}
                />
              </div>
              <div>
                <CustomDropdown
                  label="Is Active"
                  required
                  value={form.is_active}
                  onChange={(e) => onFormChange("is_active", e.target.value)}
                  disabled={isReadOnly}
                  options={BOOLEAN_OPTIONS}
                />
                {fieldErrors.is_active && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.is_active}</p>
                )}
              </div>

              <div className="lg:col-span-2 pt-4">
                <h3 className="text-lg font-semibold">Variants</h3>
              </div>

              {variants.map((v, i) => (
                <div
                  key={`${v.id ?? i}`}
                  className={`lg:col-span-2 rounded-2xl border border-gray-200 bg-white/90 p-4 dark:border-gray-800 dark:bg-gray-900/40 ${
                    i > 0 ? "mt-4" : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Variant {i + 1}
                    </p>
                    {variants.length > 1 && !isReadOnly && (
                      <CustomButton
                        fullWidth={false}
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() =>
                          setVariants(
                            variants.filter((_, index) => index !== i)
                          )
                        }
                      >
                        Remove
                      </CustomButton>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                      <CustomDropdown
                        label="Color"
                        required
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].color = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                        options={withFallback(masterData.colors, "No colors")}
                      />
                      {variantErrors[i]?.color && (
                        <p className="mt-1 text-xs text-red-600">{variantErrors[i].color}</p>
                      )}
                    </div>
                    <div>
                      <CustomDropdown
                        label="Size"
                        required
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].size = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                        options={withFallback(masterData.sizes, "No sizes")}
                      />
                      {variantErrors[i]?.size && (
                        <p className="mt-1 text-xs text-red-600">{variantErrors[i].size}</p>
                      )}
                    </div>
                    <div>
                      <CustomInput
                        label="SKU"
                        required
                        type="text"
                        placeholder="SKU"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].sku = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                      />
                      {variantErrors[i]?.sku && (
                        <p className="mt-1 text-xs text-red-600">{variantErrors[i].sku}</p>
                      )}
                    </div>
                    <div>
                      <CustomInput
                        label="Stock Quantity"
                        required
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].stock = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                      />
                      {variantErrors[i]?.stock && (
                        <p className="mt-1 text-xs text-red-600">{variantErrors[i].stock}</p>
                      )}
                    </div>
                    <div>
                      <CustomInput
                        label="Base Price"
                        required
                        type="number"
                        placeholder="Base price"
                        value={v.base_price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].base_price = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                      />
                      {variantErrors[i]?.base_price && (
                        <p className="mt-1 text-xs text-red-600">{variantErrors[i].base_price}</p>
                      )}
                    </div>
                    <div>
                      <CustomInput
                        label="Sale Price"
                        type="number"
                        placeholder="Sale price"
                        value={v.sale_price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].sale_price = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div>
                      <CustomDropdown
                        label="Is Available"
                        required
                        value={v.is_available}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].is_available = e.target.value;
                          setVariants(updated);
                        }}
                        disabled={isReadOnly}
                        options={BOOLEAN_OPTIONS}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="lg:col-span-2">
                {!isReadOnly && (
                  <CustomButton
                    fullWidth={false}
                    type="button"
                    onClick={() =>
                      setVariants([
                        ...variants,
                        {
                          color: "",
                          size: "",
                          sku: "",
                          stock: "",
                          base_price: "",
                          sale_price: "",
                          is_available: "true",
                        },
                      ])
                    }
                  >
                    + Add Variant
                  </CustomButton>
                )}
              </div>

              <div className="lg:col-span-2 pt-6">
                <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                <ImagePreview
                  images={images}
                  isReadOnly={isReadOnly}
                  onRemove={(index) =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                />
              </div>

              <div className="lg:col-span-2 pt-6">
                <h3 className="text-lg font-semibold">Upload/Edit Images</h3>
              </div>

              {images.map((img, i) => (
                <div
                  key={`${img.id ?? i}`}
                  className={`lg:col-span-2 rounded-2xl border border-gray-200 bg-white/90 p-4 dark:border-gray-800 dark:bg-gray-900/40 ${
                    i > 0 ? "mt-4" : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Image {i + 1}
                    </p>
                    {images.length > 1 && !isReadOnly && (
                      <CustomButton
                        fullWidth={false}
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, index) => index !== i))
                        }
                      >
                        Remove
                      </CustomButton>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {variantColorOptions.length > 0 && (
                      <div>
                        <CustomDropdown
                          label="Associated Color (optional)"
                          value={img.color ?? ""}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[i].color = e.target.value;
                            setImages(updated);
                          }}
                          disabled={isReadOnly}
                          options={[{ value: "", label: "Select" }, ...variantColorOptions]}
                        />
                      </div>
                    )}
                    {!isReadOnly && (
                      <div className="lg:col-span-2">
                        <CustomInputLabel label="Upload File" required />
                        <CustomFileInput
                          helperText="PNG, JPG or GIF up to 10MB"
                          selectedFileName={
                            img.file
                              ? img.file.name
                              : img.imageUrl
                              ? img.imageUrl.split("/").pop()
                              : undefined
                          }
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            const updated = [...images];
                            updated[i].file = file;
                            setImages(updated);
                          }}
                          disabled={isReadOnly}
                        />
                      </div>
                    )}
                    <div className="lg:col-span-2">
                      <CustomCheckbox
                        label="Set as primary image"
                        checked={Boolean(img.is_primary)}
                        onChange={(e) => {
                          const updated = [...images];
                          if (e.target.checked) {
                            // Unselect all other images when selecting this one as primary
                            updated.forEach((image, index) => {
                              image.is_primary = index === i;
                            });
                          } else {
                            updated[i].is_primary = false;
                          }
                          setImages(updated);
                        }}
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="lg:col-span-2">
                {!isReadOnly && (
                  <CustomButton
                    fullWidth={false}
                    type="button"
                    onClick={() =>
                      setImages([
                        ...images,
                        {
                          is_primary: false,
                          file: null,
                        },
                      ])
                    }
                  >
                    + Add Image
                  </CustomButton>
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

export default AddProductModal;
