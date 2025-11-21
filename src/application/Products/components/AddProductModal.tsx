import React from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import FileInput from "../../../components/form/input/FileInput";

export type ProductFormState = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  gender: string;
  category_id: string;
  collection_id: string;
  is_active: string;
};

export type VariantState = {
  color: string;
  size: string;
  sku: string;
  stock: string;
  base_price: string;
  sale_price: string;
  is_available: string;
};

export type ImageState = {
  image_url: string;
  alt_text: string;
  is_primary: string;
  file: File | null;
};

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
}) => {
  const isReadOnly = mode === "view";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] h-full ">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
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

        <form className="flex flex-col">
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Name *</Label>
                <Input
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  type="text"
                  placeholder="product-name-url"
                  value={form.slug}
                  onChange={(e) => onFormChange("slug", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Short Description *</Label>
                <Input
                  type="text"
                  placeholder="One or two sentences about the product"
                  value={form.short_description}
                  onChange={(e) =>
                    onFormChange("short_description", e.target.value)
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Description *</Label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  rows={4}
                  placeholder="Detailed product description"
                  value={form.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                  disabled={isReadOnly}
                ></textarea>
              </div>
              <div>
                <Label>Gender *</Label>
                <select
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  value={form.gender}
                  onChange={(e) => onFormChange("gender", e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="UNISEX">UNISEX</option>
                </select>
              </div>
              <div>
                <Label>Category ID *</Label>
                <select
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  value={form.category_id}
                  onChange={(e) => onFormChange("category_id", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="tshirt">T-Shirts</option>
                  <option value="sweatshirt">Sweatshirts</option>
                </select>
              </div>
              <div>
                <Label>Collection ID</Label>
                <select
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  value={form.collection_id}
                  onChange={(e) =>
                    onFormChange("collection_id", e.target.value)
                  }
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  <option value="new-arrival">New Arrival</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
              <div>
                <Label>Is Active *</Label>
                <select
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  value={form.is_active}
                  onChange={(e) => onFormChange("is_active", e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="lg:col-span-2 pt-4">
                <h3 className="text-lg font-semibold">Variants</h3>
              </div>

              {variants.map((v, i) => (
                <React.Fragment key={i}>
                  <div>
                    <Label>Color *</Label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                      value={v.color}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].color = e.target.value;
                      setVariants(updated);
                    }}
                    disabled={isReadOnly}
                  >
                      <option value="">Select Color</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                    </select>
                  </div>

                  <div>
                    <Label>Size *</Label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                      value={v.size}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].size = e.target.value;
                      setVariants(updated);
                    }}
                    disabled={isReadOnly}
                  >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <div>
                    <Label>SKU *</Label>
                    <Input
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
                  </div>

                  <div>
                    <Label>Stock Quantity *</Label>
                    <Input
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
                  </div>

                  <div>
                    <Label>Base Price *</Label>
                    <Input
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
                  </div>

                  <div>
                    <Label>Sale Price</Label>
                    <Input
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
                    <Label>Is Available *</Label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                      value={v.is_available}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].is_available = e.target.value;
                      setVariants(updated);
                    }}
                    disabled={isReadOnly}
                  >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div className="flex items-center mt-6">
                    {variants.length > 1 && !isReadOnly && (
                      <Button
                        size="sm"
                        type={"button"}
                        variant="outline"
                        onClick={() =>
                          setVariants(variants.filter((_, index) => index !== i))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </React.Fragment>
              ))}

              <div className="lg:col-span-2">
                {!isReadOnly && (
                  <Button
                    size="sm"
                    type={"button"}
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
                          is_available: "",
                        },
                      ])
                    }
                  >
                    + Add Variant
                  </Button>
                )}
              </div>

              <div className="lg:col-span-2 pt-6">
                <h3 className="text-lg font-semibold">Product Images</h3>
              </div>

              {images.map((img, i) => (
                <React.Fragment key={i}>
                  <div className="lg:col-span-2">
                    <Label>Image URL *</Label>
                    <Input
                      type="text"
                      placeholder="Image URL"
                      value={img.image_url}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[i].image_url = e.target.value;
                      setImages(updated);
                    }}
                    disabled={isReadOnly}
                  />
                  </div>

                  <div className="lg:col-span-2">
                    <Label>Alt Text</Label>
                    <Input
                      type="text"
                      placeholder="Optional alt text"
                      value={img.alt_text}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[i].alt_text = e.target.value;
                      setImages(updated);
                    }}
                    disabled={isReadOnly}
                  />
                  </div>

                  <div>
                    <Label>Is Primary *</Label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                      value={img.is_primary}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[i].is_primary = e.target.value;
                      setImages(updated);
                    }}
                    disabled={isReadOnly}
                  >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {!isReadOnly && (
                    <div className="lg:col-span-2">
                      <Label>Upload File</Label>
                      <FileInput
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          const updated = [...images];
                          updated[i].file = file;
                          setImages(updated);
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center mt-6">
                    {images.length > 1 && !isReadOnly && (
                      <Button
                        type={"button"}
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setImages(images.filter((_, index) => index !== i))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </React.Fragment>
              ))}

              <div className="lg:col-span-2">
                {!isReadOnly && (
                  <Button
                    size="sm"
                    type={"button"}
                    onClick={() =>
                      setImages([
                        ...images,
                        {
                          image_url: "",
                          alt_text: "",
                          is_primary: "",
                          file: null,
                        },
                      ])
                    }
                  >
                    + Add Image
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            {mode !== "view" && (
              <Button size="sm" onClick={onSave}>
                Save Changes
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProductModal;
