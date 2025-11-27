export type SizeFormTypes = {
  code: string;
  label: string;
  sortOrder?: string | number;
};

export type SizePayload = SizeFormTypes;

export type SizeResponse = SizePayload & {
  id: number;
  sortOrder?: number;
};
