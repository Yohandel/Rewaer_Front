import { apiRequest } from './httpClient';
import { Order, OrderDetailItem } from '../Types';

export function getOrders(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<Order[]>(`/api/Order${query}`);
}

export function getOrderDetails(id: number) {
  return apiRequest<OrderDetailItem[]>(`/api/Order/${id}/details`);
}

export function getMyOrders(clientId: number) {
  return apiRequest<Order[]>(`/api/Order/my-orders/${clientId}`);
}
export function cancelOrder(id: number) {
  return apiRequest<{ message: string }>(`/api/Order/${id}/cancel`, { method: 'PUT' });
}

export function invoiceOrder(id: number) {
  return apiRequest<{ message: string }>(`/api/Order/${id}/invoice`, { method: 'PUT' });
}

export function deliverOrder(id: number) {
  return apiRequest<{ message: string }>(`/api/Order/${id}/deliver`, { method: 'PUT' });
}