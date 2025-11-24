
export type ShippingSetting = {
  id?: number;
  freeShippingThreshold: number;
  shippingFee: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ShippingFormState = {
  freeShippingThreshold: string;
  shippingFee: string;
  isActive: boolean;
};
