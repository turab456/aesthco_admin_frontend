export type SelectOption = {
  value: string;
  label: string;
};

export type ProductFormState = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  gender: string;
  category_id: string;
  collection_id: string;
  is_active: string;
};

export type VariantState = {
  id?: number;
  color: string;
  size: string;
  sku: string;
  stock: string;
  base_price: string;
  sale_price: string;
  is_available: string;
};

export type ImageState = {
  id?: number;
  is_primary: boolean;
  sort_order?: number;
  file: File | null;
};

export type MasterData = {
  categories: SelectOption[];
  collections: SelectOption[];
  colors: SelectOption[];
  sizes: SelectOption[];
};