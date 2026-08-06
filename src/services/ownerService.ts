import { apiRequest } from './httpClient';
import { Owner, OwnerCreateDto, OwnerUpdateDto } from '../Types';

export function getOwners() {
  return apiRequest<Owner[]>('/api/Owner');
}

export function getOwner(id: number) {
  return apiRequest<any>(`/api/Owner/${id}`); // el detalle trae "porcentaje" en vez de "comision"
}

export function createOwner(dto: OwnerCreateDto) {
  return apiRequest<void>('/api/Owner', { method: 'POST', body: dto });
}

export function updateOwner(id: number, dto: OwnerUpdateDto) {
  return apiRequest<void>(`/api/Owner/${id}`, { method: 'PUT', body: dto });
}

export function deactivateOwner(id: number) {
  return apiRequest<void>(`/api/Owner/${id}`, { method: 'DELETE' });
}