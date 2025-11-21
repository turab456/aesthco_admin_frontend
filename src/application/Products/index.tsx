import React, { useState } from "react";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useModal } from "../../hooks/useModal";
import ProductList from "./components/ProductList";
import AddProductModal, {
  ProductFormState,
  VariantState,
  ImageState,
} from "./components/AddProductModal";
import Button from "../../components/ui/button/Button";

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
  is_active: "",
};

const INITIAL_VARIANT: VariantState = {
  color: "",
  size: "",
  sku: "",
  stock: "",
  base_price: "",
  sale_price: "",
  is_available: "",
};

const INITIAL_IMAGE: ImageState = {
  image_url: "",
  alt_text: "",
  is_primary: "",
  file: null,
};

const sampleTableData = [
  {
    id: 1,
    product: {
      name: "Premium Hoodie",
      slug: "premium-hoodie",
      short_description: "Soft cotton hoodie for daily wear.",
      description: "A premium hoodie made with 100% soft cotton.",
      gender: "MEN",
      category_id: "hoodies",
      collection_id: "new-arrival",
      is_active: true,
    },
    variants: [
      {
        color: "Black",
        size: "M",
        sku: "HD-BLK-M",
        stock: 50,
        base_price: 2999,
        sale_price: 2499,
        is_available: true,
      },
    ],
    images: [
      {
        image_url: "/images/products/hoodie-1.jpg",
        alt_text: "Hoodie Front View",
        is_primary: true,
        file: null,
      },
    ],
  },
];

const ProductPage: React.FC = () => {
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [variants, setVariants] = useState<VariantState[]>([INITIAL_VARIANT]);
  const [images, setImages] = useState<ImageState[]>([INITIAL_IMAGE]);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [, setSelectedItem] = useState<any | null>(null);

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

  const handleSave = async () => {
    try {
      const payload = {
        product: form,
        variants,
        images,
      };
      await axios.post("/api/products", payload);
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setForm(INITIAL_FORM);
    setVariants([INITIAL_VARIANT]);
    setImages([INITIAL_IMAGE]);
    openModal();
  };

  const handleOpenView = (item: any) => {
    setModalMode("view");
    setSelectedItem(item);
    setForm({ ...INITIAL_FORM, ...item.product });
    setVariants(item.variants || []);
    setImages(item.images || []);
    openModal();
  };

  const handleOpenEdit = (item: any) => {
    setModalMode("edit");
    setSelectedItem(item);
    setForm({ ...INITIAL_FORM, ...item.product });
    setVariants(item.variants || []);
    setImages(item.images || []);
    openModal();
  };

  return (
    <>
      <PageMeta title="Product Management" description="Manage your products" />
      <PageBreadcrumb pageTitle="Product Management" />

      <div className="space-y-6">
        <ProductList
          data={sampleTableData}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          customAction={
            <Button size="sm" onClick={handleOpenCreate}>
              Add Product
            </Button>
          }
        />
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
      />
    </>
  );
};

export default ProductPage;
