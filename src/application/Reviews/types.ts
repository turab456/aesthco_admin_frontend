export type ReviewProduct = {
  id: number;
  name: string;
  slug?: string;
};

export type ReviewOrder = {
  id: string;
  status: string;
  placedAt?: string;
};

export type ReviewUser = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
};

export type ReviewResponse = {
  id: number;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  product?: ReviewProduct | null;
  order?: ReviewOrder | null;
  user?: ReviewUser | null;
};

export type ReviewFilters = {
  status?: "pending" | "approved" | "all";
  rating?: number | null;
};

export type ReviewStatusPayload = {
  isApproved?: boolean;
  isFeatured?: boolean;
};
