import { apiRequest } from './httpClient';
import { Permission, PermissionDto, EmployeePermissionPayload, EmployeePermissionItem } from '../Types';

export function getPermissions() { return apiRequest<Permission[]>('/api/Permission'); }
export function createPermission(dto: PermissionDto) { return apiRequest<void>('/api/Permission', { method: 'POST', body: dto }); }
export function assignPermission(payload: EmployeePermissionPayload) {
  return apiRequest<{ message: string }>('/api/Permission/assign', { method: 'POST', body: payload });
}
export function removePermission(payload: EmployeePermissionPayload) {
  return apiRequest<void>('/api/Permission/remove', { method: 'DELETE', body: payload });
}
export function getEmployeePermissions(employeeId: number) {
  return apiRequest<EmployeePermissionItem[]>(`/api/Permission/employee/${employeeId}`);
}

export async function getMyPermissionNames(employeeId: number): Promise<string[]> {
  const items = await getEmployeePermissions(employeeId);
  return items.map(p => p.nombre);
}