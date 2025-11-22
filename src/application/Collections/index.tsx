import React, { useState } from 'react'
import Button from '../../components/ui/button/Button'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'

import axios from 'axios'
import { CollectionsFormTypes } from './types'
import { useModal } from '../../hooks/useModal'
import CollectionList from './components/CollectionList'
import AddCollectionModal from './components/AddCollectionModal'

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
const INITIAL_FORM: CollectionsFormTypes = {
    collectionName: "",
    slug: "",
};


const CollectionManagement = () => {
    const [form, setForm] = useState<CollectionsFormTypes>(INITIAL_FORM);
    const { isOpen, openModal, closeModal } = useModal();
    const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
    const [, setSelectedItem] = useState<any | null>(null);


const handleFormChange = (key: keyof CollectionsFormTypes, value: any) => {
    if (key === "collectionName") {
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
            <PageMeta title="Collection Management" description="Manage your categories" />
            <PageBreadcrumb pageTitle="Collection Management" />

            <div className="space-y-6">
                <CollectionList
                    data={sampleTableData}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    customAction={
                        <Button size="sm" onClick={handleOpenCreate}>
                            Add Collections
                        </Button>
                    }
                />
            </div>

            <AddCollectionModal
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

export default CollectionManagement
