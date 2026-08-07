import { apiRequest } from './httpClient';
import { Role, RoleDto } from '../Types';

export function getRoles() { return apiRequest<Role[]>('/api/role'); }
export function getRole(id: number) { return apiRequest<Role>(`/api/role/${id}`); }
export function createRole(dto: RoleDto) { return apiRequest<void>('/api/role', { method: 'POST', body: dto }); }
export function updateRole(id: number, dto: RoleDto) { return apiRequest<void>(`/api/role/${id}`, { method: 'PUT', body: dto }); }
export function deactivateRole(id: number) { return apiRequest<void>(`/api/role/${id}`, { method: 'DELETE' }); }