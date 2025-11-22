import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";

type SizeResponse = {
  id: number;
  label: string;
  code: string;
};

type Props = {
  data: SizeResponse[];
  onView: (size: SizeResponse) => void;
  onEdit: (size: SizeResponse) => void;
  onDelete?: (size: SizeResponse) => void;
  customAction?: React.ReactNode;
};

const SizeLists: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onDelete,
  customAction,
}) => {
  const columns: Array<ColumnDef<SizeResponse>> = [
    {
      key: "label",
      header: "Label",
      searchable: true,
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.label}
        </span>
      ),
    },
    {
      key: "code",
      header: "Size Code",
      searchable: true,
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.code}
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
            className="h-4 w-4 cursor-pointer hover:text-blue-600"
            onClick={() => onView(row)}
          />
          <Pencil
            className="h-4 w-4 cursor-pointer hover:text-green-600"
            onClick={() => onEdit(row)}
          />
          {onDelete && (
            <Trash2
              className="h-4 w-4 cursor-pointer hover:text-red-600"
              onClick={() => onDelete(row)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row) =>
        `${row.code} – ${row.label || ""}`
      }
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default SizeLists;
