import { ProductResponse } from "../interfaces/IProduct";
import { Product } from "../Types";
import { apiRequest } from "./httpClient";

export async function getProducts(): Promise<ProductResponse[]> {
  return apiRequest<ProductResponse[]>('/api/article/articulos', { method: 'GET' });
}

export async function getProductById(id: number): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(`/api/article/articulos/${id}`, { method: 'GET' });
}

export async function createProduct(product: Product): Promise<ProductResponse> {
  return apiRequest<ProductResponse>('/api/article/articulos', {
    method: 'POST',
    body: product,
  });
}

export async function updateProduct(id: number, product: ProductResponse): Promise<ProductResponse> {
  return apiRequest<ProductResponse>(`/api/article/articulos/${id}`, {
    method: 'PUT',
    body: product,
  });
}