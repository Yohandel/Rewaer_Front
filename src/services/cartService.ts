import { apiRequest } from './httpClient';
import { CartItemApi, AddCartItemPayload, UpdateCartItemPayload } from '../Types';
import { CartByClientResponse } from '../interfaces/ICartResponse';

export function addCartItem(payload: AddCartItemPayload) {
  return apiRequest<{ message: string }>('/api/Cart/items', { method: 'POST', body: payload });
}

export function getCart(cartId: number) {
  return apiRequest<CartItemApi[]>(`/api/Cart/${cartId}`);
}

export function getCartByClientId(clientId: number) {
  return apiRequest<CartByClientResponse>(`/api/Cart/client/${clientId}`);
}

export function updateCartItemQuantity(payload: UpdateCartItemPayload) {
  return apiRequest<void>('/api/Cart/items', { method: 'PUT', body: payload });
}

export function removeCartItem(cartDetailId: number) {
  return apiRequest<void>(`/api/Cart/items/${cartDetailId}`, { method: 'DELETE' });
}

export function checkoutCart(cartId: number) {
  return apiRequest<CartItemApi>('/api/Cart/checkout', { method: 'POST', body: { cartId } });
}
