import { API_BASE_URL } from '../config/api';
import { getStoredToken, clearStoredAuth } from '../utils/authStorage';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // true por defecto: adjunta el Bearer token si existe
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getStoredToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try { data = await res.json(); } catch { /* respuesta vacía o no-JSON */ }

  if (!res.ok) {
    // Token vencido o inválido: limpiamos la sesión guardada
    if (res.status === 401) clearStoredAuth();
    const message = data?.message || data?.error || `Error ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}