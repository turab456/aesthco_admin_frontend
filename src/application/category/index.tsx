import React, { useState } from 'react'
import Button from '../../components/ui/button/Button'
import ProductList from '../Products/components/ProductList'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { CategoryFormTypes } from './types'
import { useModal } from '../../hooks/useModal'
import CategoryList from './components/CategoryList'
import AddCategoryModal from './components/AddCategoryModal'
import axios from 'axios'

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");



const sampleTableData = [
    {
        id: 1,
        categoryName: "Zip Hoodies",
        slug: "zip-hoodies"
    }
];
const INITIAL_FORM: CategoryFormTypes = {
    categoryName: "",
    slug: "",
};


const CategoryManagement = () => {
    const [form, setForm] = useState<CategoryFormTypes>(INITIAL_FORM);
    const { isOpen, openModal, closeModal } = useModal();
    const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
    const [, setSelectedItem] = useState<any | null>(null);


const handleFormChange = (key: keyof CategoryFormTypes, value: any) => {
    if (key === "categoryName") {
      setForm((prev) => ({
        ...prev,
        categoryName: value,
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
      
      };
      await axios.post("/api/products", payload);
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
    const handleOpenView = (item: any) => {
        setModalMode("view");
        setSelectedItem(item);
        setForm({ ...INITIAL_FORM, ...item });

        openModal();
    };

    const handleOpenEdit = (item: any) => {
        setModalMode("edit");
        setSelectedItem(item);
        setForm({ ...INITIAL_FORM, ...item });

        openModal();
    };
    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedItem(null);
        setForm(INITIAL_FORM);

        openModal();
    };
    return (
        <>
            <PageMeta title="Category Management" description="Manage your categories" />
            <PageBreadcrumb pageTitle="Category Management" />

            <div className="space-y-6">
                <CategoryList
                    data={sampleTableData}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    customAction={
                        <Button size="sm" onClick={handleOpenCreate}>
                            Add Category
                        </Button>
                    }
                />
            </div>

            <AddCategoryModal
        isOpen={isOpen}
        onClose={closeModal}
        mode={modalMode}
        onSave={handleSave}
        form={form}
        onFormChange={handleFormChange}
       
      />
        </>
    )
}

export default CategoryManagement
