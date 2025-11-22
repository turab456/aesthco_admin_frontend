import React from "react";
import { Eye, Pencil } from "lucide-react";
import { DataTable, ColumnDef } from "../../../components/custom/CustomTable/CustomTable";
import Button from "../../../components/ui/button/Button";

type Props = {
  data: any[];
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  customAction?: React.ReactNode;
};

const CollectionList: React.FC<Props> = ({ data, onView, onEdit, customAction }) => {
  const columns: Array<ColumnDef<any>> = [
    {
      key: "collectionName",
      header: "Collection Name",
      render: (row) => row.categoryName,
      searchable: true,
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => row.slug,
      searchable: true,
    },
   
   {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(row)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
      searchable: false,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      enableSearchDropdown
      buildSuggestionLabel={(row) => `${row.categoryName} — ${row.slug || ""}`}
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default CollectionList;
