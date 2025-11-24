import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";
import { ColorResponse } from "../types";

type Props = {
  data: ColorResponse[];
  onView: (color: ColorResponse) => void;
  onEdit: (color: ColorResponse) => void;
  onDelete?: (color: ColorResponse) => void;
  customAction?: React.ReactNode;
};

const ColorsLists: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onDelete,
  customAction,
}) => {
  const columns: Array<ColumnDef<any>> = [
    {
      key: "name",
      header: "Color Name",
      searchable: true,
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      key: "code",
      header: "Color Code",
      searchable: true,
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.code}</span>
      ),
    },
    {
      key: "hexCode",
      header: "Hex Code",
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded border border-gray-300"
            style={{ backgroundColor: row.hexCode }}
          />
          <span className="text-gray-600 dark:text-gray-400">
            {row.hexCode}
          </span>
        </div>
      ),
    },
    {
      key: "id",
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
      data={data as any}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row: any) => `${row.name} - ${row.code || ""}`}
      onSuggestionSelect={(row: any) => onView(row as ColorResponse)}
      actionComponent={customAction}
    />
  );
};

export default ColorsLists;
