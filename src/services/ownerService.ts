import { apiRequest } from './httpClient';
import { owner, ownerCreateDto, ownerUpdateDto } from '../Types';

export function getowners() {
  return apiRequest<owner[]>('/api/owner');
}

export function getowner(id: number) {
  return apiRequest<any>(`/api/owner/${id}`); // el detalle trae "porcentaje" en vez de "comision"
}

export function createowner(dto: ownerCreateDto) {
  return apiRequest<void>('/api/owner', { method: 'POST', body: dto });
}

export function updateowner(id: number, dto: ownerUpdateDto) {
  return apiRequest<void>(`/api/owner/${id}`, { method: 'PUT', body: dto });
}

export function deactivateowner(id: number) {
  return apiRequest<void>(`/api/owner/${id}`, { method: 'DELETE' });
}