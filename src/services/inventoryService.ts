import { apiRequest } from './httpClient';
import { InventoryDto } from '../Types';

export type InventoryItem = {
  id: number;
  cantidad: number;
  ubicacion: string;
  articuloId: number;
};

export function getInventory() {
  return apiRequest<InventoryItem[]>('/api/Inventory');
}

export function addInventory(dto: InventoryDto) {
  return apiRequest<void>('/api/Inventory', { method: 'POST', body: dto });
}

export function updateInventory(id: number, dto: InventoryDto) {
  return apiRequest<void>(`/api/Inventory/${id}`, { method: 'PUT', body: dto });
}

export function reduceInventory(id_articulo: number, cantidad: number) {
  return apiRequest<{ message: string }>('/api/Inventory/reduce', { method: 'POST', body: { id_articulo, cantidad } });
}