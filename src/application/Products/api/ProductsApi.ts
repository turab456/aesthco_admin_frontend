import apiClient from "../../../lib/apiClient";

export type ProductImagePayload = {
  id?: number;
  isPrimary?: boolean;
  sortOrder?: number;
  imageUrl?: string;
};

export type ProductVariantPayload = {
  id?: number;
  colorId: number;
  sizeId: number;
  sku: string;
  stockQuantity: number;
  basePrice: number;
  salePrice?: number | null;
  isAvailable?: boolean;
};

export type ProductPayload = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  categoryId: number;
  collectionId?: number | null;
  isActive: boolean;
  variants?: ProductVariantPayload[];
  images?: ProductImagePayload[];
};

export type ProductResponse = ProductPayload & {
  id: number;
  category?: { id: number; name: string; slug: string } | null;
  collection?: { id: number; name: string; slug: string } | null;
  images: Array<
    ProductImagePayload & {
      id: number;
      imageUrl?: string;
    }
  >;
  variants: Array<
    ProductVariantPayload & {
      id: number;
      color?: { id: number; name: string; code: string; hexCode: string } | null;
      size?: { id: number; code: string; label: string } | null;
    }
  >;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || "Product API error.");
  }
  return response.data;
};

const ProductsApi = {
  async list(): Promise<ProductResponse[]> {
    const response = await apiClient.get<ApiResponse<ProductResponse[]>>(
      "/products"
    );
    return unwrap(response.data);
  },

  async get(idOrSlug: string | number): Promise<ProductResponse> {
    const response = await apiClient.get<ApiResponse<ProductResponse>>(
      `/products/${idOrSlug}`
    );
    return unwrap(response.data);
  },

  async create(payload: ProductPayload): Promise<ProductResponse> {
    const response = await apiClient.post<ApiResponse<ProductResponse>>(
      "/products",
      payload
    );
    return unwrap(response.data);
  },

  async update(
    id: string | number,
    payload: Partial<ProductPayload>
  ): Promise<ProductResponse> {
    const response = await apiClient.put<ApiResponse<ProductResponse>>(
      `/products/${id}`,
      payload
    );
    return unwrap(response.data);
  },

  async remove(id: string | number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/products/${id}`
    );
    unwrap(response.data);
  },

  async uploadImage(file: File): Promise<{ url: string; publicId?: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post<
      ApiResponse<{ url: string; publicId?: string }>
    >("/products/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(response.data);
  },
};

export default ProductsApi;
