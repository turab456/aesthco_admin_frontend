import React, { useState } from 'react'
import { CustomButton } from '../../components/custom'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { useModal } from '../../hooks/useModal'

import axios from 'axios'
import SizeLists from './components/SizeLists'
import AddSizesModal from './components/AddSizesModal'
import { SizeFormTypes } from './types'




const sampleTableData = [
    {
        id: 1,
        code: "M",
        label: "Medium",
       
    }
];
const INITIAL_FORM: SizeFormTypes = {
    code: "",
    label: "",
};


const SizeManagement = () => {
    const [form, setForm] = useState<SizeFormTypes>(INITIAL_FORM);
    const { isOpen, openModal, closeModal } = useModal();
    const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
    const [, setSelectedItem] = useState<any | null>(null);


const handleFormChange = (key: keyof SizeFormTypes, value: any) => {
   
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
            <PageMeta title="Size Management" description="Manage your sizes" />
            <PageBreadcrumb pageTitle="Size Management" />

            <div className="space-y-6">
                <SizeLists
                    data={sampleTableData}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    customAction={
                        <CustomButton size="sm" onClick={handleOpenCreate}>
                            Add Size
                        </CustomButton>
                    }
                />
            </div>

            <AddSizesModal
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

export default SizeManagement
