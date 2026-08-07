import { API_URL } from "../config/api";
import { ProductResponse } from "../interfaces/IProduct";
import { Product } from "../Types";
import { apiRequest } from "./httpClient";

export async function getProducts(): Promise<ProductResponse[]> {
  return apiRequest<ProductResponse[]>('/api/article/articulos', { method: 'GET' });
}

export async function getProductById(id: number): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(`/api/article/articulos/${id}`, { method: 'GET' });
}

export async function createProduct(
  product: Product
): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(
    "/api/article/articulos",
    {
      method: "POST",
      body: product,
    }
  );
}

export async function updateProduct(id: number, product: ProductResponse): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(`/api/article/articulos/${id}`, {
    method: 'PUT',
    body: product,
  });
}

export async function inactivateArticle(id: number): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(`/api/article/${id}`, { method: 'DELETE' });
}

export async function uploadProductImage(
  productId: number,
  image: File
): Promise<void> {

  const formData = new FormData();

  formData.append("image", image);

  await fetch(
    `${API_URL}/api/article/${productId}/image`,
    {
      method: "POST",
      body: formData,
    }
  );
}


export async function createProductWithImage(
  product: Product
): Promise<ProductResponse> {

  const created =
    await createProduct(product);

  if (product.image) {
    await uploadProductImage(
      created.id,
      product.image
    );
  }

  return created;
}