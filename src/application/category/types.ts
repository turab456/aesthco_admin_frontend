export type CategoryFormTypes = {
  name: string;
  slug: string;
};

export type CategoryPayload = CategoryFormTypes;

export type CategoryResponse = CategoryPayload & {
  id: number;
};
