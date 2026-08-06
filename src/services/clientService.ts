import { API_BASE_URL } from '../config/api';
import { ClientApi } from '../Types';
import { apiRequest } from './httpClient';

export type RegisterClientPayload = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  contrasena: string;
  fecha_registro: string;
  estado: string;
};

async function handleResponse(res: Response) {
  let data: any = null;
  try { data = await res.json(); } catch { /* respuesta vacía o no-JSON */ }

  if (!res.ok) {
    const message = data?.message || data?.error || `Error ${res.status}: no se pudo completar el registro`;
    throw new Error(message);
  }
  return data;
}

export async function registerClient(payload: RegisterClientPayload) {
  const res = await fetch(`${API_BASE_URL}/api/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getClientes(): Promise<ClientApi[]> {
  const res = await apiRequest<{ clientes: ClientApi[]; message: string }>('/api/Clients/clientes');
  return res.clientes;
}

export function getCliente(id: number) {
  return apiRequest<ClientApi>(`/api/Clients/clientes/${id}`);
}