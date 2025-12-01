import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import { useModal } from "../../hooks/useModal";
import ProductList from "./components/ProductList";
import AddProductModal from "./components/AddProductModal";
import {
  ProductFormState,
  VariantState,
  ImageState,
} from "./types";
import { CustomButton } from "../../components/custom";
import MasterApi, {
  MasterCategory,
  MasterCollection,
  MasterColor,
  MasterSize,
} from "../../utils/MasterApi";
import ProductsApi, {
  ProductPayload,
  ProductResponse,
} from "./api/ProductsApi";

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const INITIAL_FORM: ProductFormState = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  gender: "",
  category_id: "",
  collection_id: "",
  is_active: "true",
};

const INITIAL_VARIANT: VariantState = {
  color: "",
  size: "",
  sku: "",
  stock: "",
  base_price: "",
  sale_price: "",
  is_available: "true",
  show_in_listing: "true",
};

const INITIAL_IMAGE: ImageState = {
  is_primary: false,
  file: null,
};

type SelectOption = { value: string; label: string };

const toOption = (value: number, label: string): SelectOption => ({
  value: String(value),
  label,
});

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [form, setForm] = useState<ProductFormState>({ ...INITIAL_FORM });
  const [variants, setVariants] = useState<VariantState[]>([
    { ...INITIAL_VARIANT },
  ]);
  const [images, setImages] = useState<ImageState[]>([{ ...INITIAL_IMAGE }]);
  const [masterOptions, setMasterOptions] = useState<{
    categories: SelectOption[];
    collections: SelectOption[];
    colors: SelectOption[];
    sizes: SelectOption[];
  }>({
    categories: [],
    collections: [],
    colors: [],
    sizes: [],
  });
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [_, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchProducts = useCallback(async () => {
    const data = await ProductsApi.list();
    setProducts(data);
  }, []);

  const fetchMasters = useCallback(async () => {
    const [
      categories,
      collections,
      colors,
      sizes,
    ] = await Promise.all([
      MasterApi.getCategories(),
      MasterApi.getCollections(),
      MasterApi.getColors(),
      MasterApi.getSizes(),
    ]);

    setMasterOptions({
      categories: categories.map((item: MasterCategory) =>
        toOption(item.id, item.name)
      ),
      collections: collections.map((item: MasterCollection) =>
        toOption(item.id, item.name)
      ),
      colors: colors.map((item: MasterColor) =>
        toOption(item.id, item.name)
      ),
      sizes: sizes.map((item: MasterSize) => toOption(item.id, item.label)),
    });
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchMasters()]);
        setError(null);
      } catch (err) {
        console.error("Failed to load product data:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchProducts, fetchMasters]);

  const handleFormChange = (key: keyof ProductFormState, value: any) => {
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

  const mapProductToForm = (product?: ProductResponse | null): ProductFormState =>
    product
      ? {
          name: product.name ?? "",
          slug: product.slug ?? "",
          short_description: product.shortDescription ?? "",
          description: product.description ?? "",
          gender: product.gender ?? "",
          category_id: product.categoryId ? String(product.categoryId) : "",
          collection_id: product.collectionId
            ? String(product.collectionId)
            : "",
          is_active: String(product.isActive),
        }
      : { ...INITIAL_FORM };

  const mapProductToVariants = (product?: ProductResponse | null) =>
    product && product.variants.length
      ? product.variants.map((variant: any) => ({
          id: variant.id,
          color: variant.color?.id ? String(variant.color.id) : "",
          size: variant.size?.id ? String(variant.size.id) : "",
          sku: variant.sku ?? "",
          stock: variant.stockQuantity
            ? String(variant.stockQuantity)
            : "",
          base_price: variant.basePrice ? String(variant.basePrice) : "",
          sale_price: variant.salePrice ? String(variant.salePrice) : "",
          is_available: String(
            typeof variant.isAvailable === "boolean"
              ? variant.isAvailable
              : true
          ),
          show_in_listing: String(
            typeof variant.showInListing === "boolean"
              ? variant.showInListing
              : true
          ),
        }))
      : [{ ...INITIAL_VARIANT }];

const mapProductToImages = (product?: ProductResponse | null) =>
  product && product.images.length
    ? product.images.map((image, index) => ({
        id: image.id,
        is_primary: Boolean(image.isPrimary),
        imageUrl: image.imageUrl,
        color:
          image.colorId != null
            ? String(image.colorId)


            : "",
        sort_order:
          typeof image.sortOrder === "number" ? image.sortOrder : index,
        file: null,
      }))
    : [{ ...INITIAL_IMAGE }];

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setForm({ ...INITIAL_FORM });
    setVariants([{ ...INITIAL_VARIANT }]);
    setImages([{ ...INITIAL_IMAGE }]);
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const handleOpenView = (product: ProductResponse) => {
    setModalMode("view");
    setSelectedProduct(product);
    setForm(mapProductToForm(product));
    setVariants(mapProductToVariants(product));
    setImages(mapProductToImages(product));
    openModal();
  };

  const handleOpenEdit = (product: ProductResponse) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setForm(mapProductToForm(product));
    setVariants(mapProductToVariants(product));
    setImages(mapProductToImages(product));
    setFieldErrors({});
    setError(null);
    openModal();
  };

  const normalizeBoolean = (value: string) =>
    value === "true" ? true : value === "false" ? false : true;

  const buildProductPayload = async (): Promise<ProductPayload> => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Product name is required.";
    }
    if (!form.short_description.trim()) {
      errors.short_description = "Short description is required.";
    }
    if (!form.description.trim()) {
      errors.description = "Description is required.";
    }
    if (!form.category_id) {
      errors.category_id = "Category is required.";
    }
    if (!form.gender) {
      errors.gender = "Gender is required.";
    }
    if (form.is_active === "") {
      errors.is_active = "Is Active is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw new Error("Please fix validation errors.");
    }

    setFieldErrors({});

    const payload: ProductPayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      shortDescription: form.short_description.trim(),
      description: form.description.trim(),
      gender: form.gender as ProductPayload["gender"],
      categoryId: Number(form.category_id),
      collectionId: form.collection_id ? Number(form.collection_id) : null,
      isActive: normalizeBoolean(form.is_active),
    };

    console.log("Raw variants before filtering:", variants);
    
    const normalizedVariants = variants
      .filter((variant) => {
        const isValid = variant.color && variant.size && variant.sku;
        console.log(`Variant check - ID: ${variant.id}, Color: ${variant.color}, Size: ${variant.size}, SKU: ${variant.sku}, Valid: ${isValid}`);
        return isValid;
      })
      .map((variant) => {
        const normalized = {
          id: variant.id,
          colorId: Number(variant.color),
          sizeId: Number(variant.size),
          sku: variant.sku,
          stockQuantity: Number(variant.stock) || 0,
          basePrice: Number(variant.base_price) || 0,
          salePrice: variant.sale_price ? Number(variant.sale_price) : null,
          isAvailable: normalizeBoolean(variant.is_available),
          showInListing: normalizeBoolean(variant.show_in_listing ?? "true"),
        };
        console.log("Normalized variant:", normalized);
        return normalized;
      });

    if (normalizedVariants.length) {
      payload.variants = normalizedVariants;
    }

    console.log("Payload being sent:", payload);

    const normalizedImages = (
      await Promise.all(
        images.map(async (image, index) => {
          // If image has a file, upload it and get the URL
          if (image.file) {
            const upload = await ProductsApi.uploadImage(image.file);
            const imageUrl = upload.url;

            return {
              id: image.id,
              imageUrl,
              isPrimary: Boolean(image.is_primary),
              colorId: image.color ? Number(image.color) : null,
              sortOrder:
                typeof image.sort_order === "number"
                  ? image.sort_order
                  : index,
            };
          }

          // If image has an ID (existing image), preserve it without uploading
          if (image.id) {
            return {
              id: image.id,
              imageUrl: image.imageUrl,
              isPrimary: Boolean(image.is_primary),
              colorId: image.color ? Number(image.color) : null,
              sortOrder:
                typeof image.sort_order === "number"
                  ? image.sort_order
                  : index,
            };
          }

          // Skip images with no file and no ID (new unsaved images)
          return null;
        })
      )
    ).filter((img): img is NonNullable<typeof img> => img !== null);

    if (normalizedImages && normalizedImages.length) {
      payload.images = normalizedImages;
    }

    return payload;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const payload = await buildProductPayload();
      if (modalMode === "edit" && selectedProduct) {
        await ProductsApi.update(selectedProduct.id, payload);
      } else {
        await ProductsApi.create(payload);
      }
      await fetchProducts();
      closeModal();
      setFieldErrors({});
    } catch (err: any) {
      console.error("Error saving product:", err);
      
      // Extract error message from axios response
      const errorMessage = 
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save product. Please try again.";
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmStatusChange = async (product: ProductResponse, nextStatus: boolean) => {
    try {
      setIsUpdatingStatus(true);
      await ProductsApi.updateStatus(product.id, nextStatus);
      await fetchProducts();
    } catch (err) {
      console.error("Error updating product status:", err);
      alert("Failed to update product status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const masterData = useMemo(
    () => ({
      categories: masterOptions.categories,
      collections: masterOptions.collections,
      colors: masterOptions.colors,
      sizes: masterOptions.sizes,
    }),
    [masterOptions]
  );

  return (
    <>
      <PageMeta title="Product Management" description="Manage your products" />
      <PageBreadcrumb pageTitle="Product Management" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Loader label="Loading products..." fullHeight />
          </div>
        ) : (
          <ProductList
            data={products}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onToggleActive={handleConfirmStatusChange}
            customAction={
              <CustomButton
                fullWidth={false}
                size="sm"
                variant="outline"
                onClick={handleOpenCreate}
              >
                Add Product
              </CustomButton>
            }
          />
        )}
      </div>

      <AddProductModal
        isOpen={isOpen}
        onClose={closeModal}
        mode={modalMode}
        onSave={handleSave}
        form={form}
        onFormChange={handleFormChange}
        variants={variants}
        setVariants={setVariants}
        images={images}
        setImages={setImages}
        masterData={masterData}
        isSaving={isSaving}
        fieldErrors={fieldErrors}
        error={error}
      />
    </>
  );
};

export default ProductPage;
