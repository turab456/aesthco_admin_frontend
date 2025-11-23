export type CollectionsFormTypes = {
  name: string;
  slug: string;
};

export type CollectionPayload = CollectionsFormTypes;

export type CollectionResponse = CollectionPayload & {
  id: number;
};
