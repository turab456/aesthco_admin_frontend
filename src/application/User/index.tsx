import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import PageMeta from "../../components/common/PageMeta"
import Loader from "../../components/common/Loader"
import UserList from "./components/UserList"
import UserDetailsModal from "./components/UserDetailsModal"
import UserApi from "./api/UserApi"
import type { UserSummary } from "./types"

const UserManagement = () => {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await UserApi.list()
      const customers = data.filter(user => user.role === 'customer')
      setUsers(customers)
      setError(null)
    } catch (err: any) {
      console.error("Failed to load users:", err)
      const message = err?.response?.data?.message || err?.message || "Failed to load users"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  const openDetails = (user: UserSummary) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (user: UserSummary) => {
    try {
      await UserApi.toggleActive(user.id)
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, isActive: !u.isActive } : u
        )
      )
    } catch (err: any) {
      console.error('Failed to toggle user status:', err)
      const message = err?.response?.data?.message || err?.message || 'Failed to update user status'
      setError(message)
    }
  }

  return (
    <>
      <PageMeta title="User Management" description="Manage store users" />
      <PageBreadcrumb pageTitle="User Management" />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Loader label="Loading users..." fullHeight />
          </div>
        ) : (
          <UserList
            data={users}
            onView={openDetails}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>

      <UserDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
    </>
  )
}

export default UserManagement
