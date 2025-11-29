import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import PageMeta from "../../components/common/PageMeta"
import Loader from "../../components/common/Loader"
import { CustomButton } from "../../components/custom"
import PartnerList from "./Components/PartnerList"
import PartnerDetails from "./Components/PartnerDetails"
import AddPartner from "./Components/AddPartner"
import PartnerApi from "./api/PartnerApi"
import type { UserSummary } from "../User/types"

const PartnerManagement = () => {
  const [partners, setPartners] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPartner, setSelectedPartner] = useState<UserSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddOpen, setAddOpen] = useState(false)

  const fetchPartners = async () => {
    try {
      setLoading(true)
      console.log('Fetching partners...')
      const data = await PartnerApi.list()
      console.log('Partners data:', data)
      setPartners(data)
      setError(null)
    } catch (err: any) {
      console.error("Failed to load partners:", err)
      const message = err?.response?.data?.message || err?.message || "Failed to load partners"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchPartners()
  }, [])

  const openDetails = (partner: UserSummary) => {
    setSelectedPartner(partner)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (partner: UserSummary) => {
    try {
      await PartnerApi.toggleActive(partner.id)
      setPartners(prevPartners => 
        prevPartners.map(p => 
          p.id === partner.id ? { ...p, isActive: !p.isActive } : p
        )
      )
    } catch (err: any) {
      console.error('Failed to toggle partner status:', err)
      const message = err?.response?.data?.message || err?.message || 'Failed to update partner status'
      setError(message)
    }
  }

  const handlePartnerCreated = () => {
    void fetchPartners()
  }

  const handleOpenAdd = () => {
    setAddOpen(true)
  }

  return (
    <>
      <PageMeta title="Partner Management" description="Manage store partners" />
      <PageBreadcrumb pageTitle="Partner Management" />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Loader label="Loading partners..." fullHeight />
          </div>
        ) : (
          <PartnerList
            data={partners}
            onView={openDetails}
            onToggleActive={handleToggleActive}
            onPartnerCreated={handlePartnerCreated}
            customAction={
              <CustomButton size="sm" variant="outline" fullWidth={false} onClick={handleOpenAdd}>
                Add Partner
              </CustomButton>
            }
          />
        )}
      </div>

      <PartnerDetails isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedPartner} />
      
      <AddPartner
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        onPartnerCreated={handlePartnerCreated}
      />
    </>
  )
}

export default PartnerManagement