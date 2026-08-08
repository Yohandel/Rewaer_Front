import { apiRequest } from './httpClient';
import { ChangePasswordDto, Employee, EmployeeCreateDto, EmployeeUpdateDto, UpdateEmployeeRoleDto } from '../Types';

export function getEmployees() {
  return apiRequest<Employee[]>('/api/Employee');
}

export function getEmployee(id: number) {
  return apiRequest<Employee>(`/api/Employee/${id}`);
}

export function createEmployee(dto: EmployeeCreateDto) {
  return apiRequest<void>('/api/Employee', { method: 'POST', body: dto });
}

export function updateEmployee(id: number, dto: EmployeeUpdateDto) {
  return apiRequest<void>(`/api/Employee/${id}`, { method: 'PUT', body: dto });
}

export function deactivateEmployee(id: number) {
  return apiRequest<void>(`/api/Employee/${id}`, { method: 'DELETE' });
}

export function updateEmployeeRole(id: number | null, dto: UpdateEmployeeRoleDto) {
  return apiRequest<void>(`/api/Employee/${id}/role`, { method: 'PUT', body: dto });
}

export function changeEmployeePassword(id: number, newPassword: string) {
  return apiRequest<{ message: string }>(`/api/Employee/${id}/password`, {
    method: 'PUT',
    body: { newPassword } as ChangePasswordDto,
  });
}