import React, { useState } from 'react'
import Button from '../../components/ui/button/Button'
import ProductList from '../Products/components/ProductList'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { useModal } from '../../hooks/useModal'

import axios from 'axios'
import { ColorFormTypes } from './types'
import ColorsLists from './components/ColorsList'
import AddColorsModal from './components/AddColorsModal'




const sampleTableData = [
    {
        id: 1,
        name: "Cafe",
        code: "#122HH",
        hexCode: "#122HH",
       
    }
];
const INITIAL_FORM: ColorFormTypes = {
    name: "",
    code: "",
    hexCode: "",
};


const ColorsManagement = () => {
    const [form, setForm] = useState<ColorFormTypes>(INITIAL_FORM);
    const { isOpen, openModal, closeModal } = useModal();
    const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
    const [, setSelectedItem] = useState<any | null>(null);


const handleFormChange = (key: keyof ColorFormTypes, value: any) => {
   
      setForm((prev) => ({ ...prev, [key]: value }));
    
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
            <PageMeta title="Colors Management" description="Manage your colors" />
            <PageBreadcrumb pageTitle="Colors Management" />

            <div className="space-y-6">
                <ColorsLists
                    data={sampleTableData}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    customAction={
                        <Button size="sm" onClick={handleOpenCreate}>
                            Add Colors
                        </Button>
                    }
                />
            </div>

            <AddColorsModal
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

export default ColorsManagement
