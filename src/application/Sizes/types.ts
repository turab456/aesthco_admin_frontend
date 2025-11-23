export type SizeFormTypes = {
  code: string;
  label: string;
};

export type SizePayload = SizeFormTypes;

export type SizeResponse = SizePayload & {
  id: number;
};
