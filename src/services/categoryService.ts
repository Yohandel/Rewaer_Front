import { ICategory } from '../interfaces/ICategory';
import { CategoryResponse } from '../Types';
import { apiRequest } from './httpClient';

export async function getCategories(): Promise<CategoryResponse[]> {
  return apiRequest<CategoryResponse[]>('/api/category/categorias', { method: 'GET' });
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>(`/api/category/categorias/${id}`, { method: 'GET' });
}

export async function createCategory(category: ICategory): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>('/api/category/categorias', {
    method: 'POST',
    body: category,
  });
}

export async function updateCategory(id: string, category: ICategory): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>(`/api/category/categorias/${id}`, {
    method: 'PUT',
    body: category,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/api/category/categorias/${id}`, {
    method: 'DELETE',
  });
}