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

const ProductList: React.FC<Props> = ({ data, onView, onEdit, customAction }) => {
  const columns: Array<ColumnDef<any>> = [
    {
      key: "productName",
      header: "Product Name",
      render: (row) => row.product.name,
      searchable: true,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => row.product.category_id,
      searchable: true,
    },
    {
      key: "collection",
      header: "Collection",
      render: (row) => row.product.collection_id || "—",
      searchable: true,
    },
    {
      key: "shortDescription",
      header: "Short Description",
      render: (row) => row.product.short_description,
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
      buildSuggestionLabel={(row) => `${row.product.name} — ${row.product.category_id || ""}`}
      onSuggestionSelect={(row) => onView(row)}
      actionComponent={customAction}
    />
  );
};

export default ProductList;
