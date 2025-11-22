import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
} from "../../../components/custom/CustomTable/CustomTable";

type CollectionResponse = {
  id: number;
  collectionName: string;
  slug: string;
};

type Props = {
  data: CollectionResponse[];
  onView: (collection: CollectionResponse) => void;
  onEdit: (collection: CollectionResponse) => void;
  onDelete?: (collection: CollectionResponse) => void;
  customAction?: React.ReactNode;
};

const CollectionList: React.FC<Props> = ({
  data,
  onView,
  onEdit,
  onDelete,
  customAction,
}) => {
  const columns: Array<ColumnDef<CollectionResponse>> = [
    {
      key: "collectionName",
      header: "Collection Name",
      searchable: true,
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.collectionName}
        </span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      searchable: true,
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.slug}
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
        `${row.collectionName} – ${row.slug || "Uncategorised"}`
      }
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default CollectionList;
