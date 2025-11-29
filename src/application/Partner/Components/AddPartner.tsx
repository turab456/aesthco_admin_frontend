import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { CustomButton, CustomModal, CustomInput } from "../../../components/custom"
import PartnerApi from "../api/PartnerApi"

type Props = {
  isOpen: boolean
  onClose: () => void
  onPartnerCreated: () => void
}

const AddPartner: React.FC<Props> = ({ isOpen, onClose, onPartnerCreated }) => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" })
  const [isSaving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAdd = async () => {
    if (!form.email || !form.password) {
      alert("Email and password are required")
      return
    }
    setSaving(true)
    try {
      await PartnerApi.create({
        fullName: form.fullName || undefined,
        email: form.email,
        password: form.password,
      })
      setForm({ fullName: "", email: "", password: "" })
      onClose()
      onPartnerCreated()
    } catch (err: any) {
      console.error(err)
      alert(err?.message || "Failed to create partner")
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setForm({ fullName: "", email: "", password: "" })
    setShowPassword(false)
    onClose()
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      contentClassName="p-6"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Partner
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create partner account (email & password required).
          </p>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Full name (optional)"
            type="text"
            value={form.fullName}
            onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
            placeholder="Enter full name"
          />

          <CustomInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            placeholder="Enter email address"
            required
          />

          <div className="relative">
            <CustomInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <CustomButton
            variant="outline"
            onClick={handleClose}
            size="sm"
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleAdd} isLoading={isSaving} size="sm">
            Create Partner
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  )
}

export default AddPartner