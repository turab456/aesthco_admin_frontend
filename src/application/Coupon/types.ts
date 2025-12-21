
export type CouponType = "NORMAL" | "COMBO" | "WELCOME" | "SEASONAL" | "OTHER";
export type DiscountType = "PERCENT" | "FIXED";

export type CouponFormState = {
  code: string;
  type: CouponType;
  discountType: DiscountType;
  discountValue: string;
  startAt: string;
  endAt: string;
  globalMaxRedemptions: string;
  perUserLimit: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  comboRequiredQuantity: string;
  comboAllowedQuantity: string;
  isActive: boolean;
};

export type CouponPayload = {
  code: string;
  type: CouponType;
  discountType: DiscountType;
  discountValue: number;
  startAt?: string | null;
  endAt?: string | null;
  globalMaxRedemptions?: number | null;
  perUserLimit?: number | null;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  comboRequiredQuantity?: number | null;
  comboAllowedQuantity?: number | null;
  isActive?: boolean;
};

export type CouponResponse = CouponPayload & {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  redemptionsCount?: number;
};
