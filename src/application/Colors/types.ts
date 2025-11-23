export type ColorFormTypes = {
  name: string;
  code: string;
  hexCode: string;
};

export type ColorPayload = ColorFormTypes;

export type ColorResponse = ColorPayload & {
  id: number;
};
