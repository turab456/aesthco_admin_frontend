export type CollectionsFormTypes = {
  name: string;
  slug: string;
  showOnHome: boolean;
  homeOrder?: number | null;
};

export type CollectionPayload = CollectionsFormTypes;

export type CollectionResponse = CollectionPayload & {
  id: number;
};
