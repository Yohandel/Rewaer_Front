import { API_BASE_URL } from '../config/api';
import { ClientLoginPayload, EmployeeLoginPayload } from '../interfaces/ILogin';
import { MeResponse } from '../interfaces/IMeResponse';
import { apiRequest } from './httpClient';


async function handleResponse(res: Response) {
  let data: any = null;
  try { data = await res.json(); } catch { /* respuesta vacía o no-JSON */ }

  if (!res.ok) {
    const message = data?.message || data?.error || `Error ${res.status}: no se pudo iniciar sesión`;
    throw new Error(message);
  }
  return data;
}

export async function employeeLogin(payload: EmployeeLoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/employee-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function clientLogin(payload: ClientLoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/client-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Usa el httpClient porque este endpoint SÍ requiere el Bearer token
export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/api/auth/me', { method: 'GET' });
}