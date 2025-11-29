import React, { useState } from "react";
import { Eye, Power, PowerOff } from "lucide-react";
import {
  ColumnDef,
  DataTable,
} from "../../../components/custom/CustomTable/CustomTable";
import CustomConfirmModal from "../../../components/custom/CustomConfirmModal";
import type { UserSummary } from "../../User/types";

type Props = {
  data: UserSummary[];
  onView: (partner: UserSummary) => void;
  onToggleActive: (partner: UserSummary) => void;
  onPartnerCreated: () => void;
  customAction?: React.ReactNode;
};

const PartnerList: React.FC<Props> = ({
  data = [],
  onView,
  onToggleActive,
  customAction,
}) => {
  const [confirmModal, setConfirmModal] = useState<{
    user: UserSummary;
    action: "activate" | "deactivate";
  } | null>(null);

  const handleToggleClick = (user: UserSummary) => {
    setConfirmModal({
      user,
      action: user.isActive ? "deactivate" : "activate",
    });
  };

  const handleConfirm = () => {
    if (confirmModal) {
      onToggleActive(confirmModal.user);
      setConfirmModal(null);
    }
  };

  const columns: Array<ColumnDef<UserSummary>> = [
    {
      key: "fullName",
      header: "Name",
      searchable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.fullName || "—"}
          </span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ),
    },

    {
      key: "status",
      header: "Status",
      searchable: false,
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Eye
            className="h-4 w-4 cursor-pointer text-gray-600 hover:text-indigo-600"
            onClick={() => onView(row)}
          />
          {row.isActive ? (
            <div title="Deactivate partner">
              <PowerOff
                className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-800"
                onClick={() => handleToggleClick(row)}
              />
            </div>
          ) : (
            <div title="Activate partner">
              <Power
                className="h-4 w-4 cursor-pointer text-green-600 hover:text-green-800"
                onClick={() => handleToggleClick(row)}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        defaultPageSize={10}
        enableSearchDropdown
        buildSuggestionLabel={(row) => `${row.fullName ?? ""} ${row.email}`}
        onSuggestionSelect={(row) => onView(row)}
        actionComponent={customAction}
      />

      <CustomConfirmModal
        isOpen={!!confirmModal}
        title={
          confirmModal?.action === "activate"
            ? "Activate Partner"
            : "Deactivate Partner"
        }
        message={`Are you sure you want to ${confirmModal?.action} ${
          confirmModal?.user.fullName || confirmModal?.user.email
        }?${
          confirmModal?.action === "deactivate"
            ? " This will prevent them from logging in."
            : ""
        }`}
        confirmText={
          confirmModal?.action === "activate" ? "Activate" : "Deactivate"
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
};

export default PartnerList;
