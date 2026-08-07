import React from 'react';
import { ArrowLeft, ShoppingCart as CartIcon, X, CheckCircle } from 'lucide-react';
import { CartItem, Page } from '../../Types';
import { PublicNav } from './PublicNav';
import { StatusBadge } from '../Common/StatusBadge';
import { getImageUrl } from '../../utils/image';

export function CarritoPage({ onNavigate, userRole, onLogout, cart, onUpdateQty, onRemove, onCheckout, cartCount }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void;
  cart: CartItem[]; onUpdateQty: (cartDetailId: number, qty: number) => void; onRemove: (cartDetailId: number) => void;
  onCheckout: () => void; cartCount: number;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = cart.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="carrito" cartCount={cartCount} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => onNavigate("tienda")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-slate-500">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Mi carrito</h1>
          {cart.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{cartCount} {cartCount === 1 ? "artículo" : "artículos"}</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <CartIcon className="w-9 h-9 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-1">Tu carrito está vacío</h2>
            <p className="text-slate-400 text-sm mb-6">Agrega productos desde el catálogo o las ofertas.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => onNavigate("catalogo")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                Ver catálogo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(({ product: p, qty, cartDetailId }) => (
                <div key={cartDetailId ?? p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 shadow-sm">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={getImageUrl(p.imagenUrl)} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{p.categoryName} · <StatusBadge status={p.physicalState} /></p>
                      </div>
                      <button type="button" onClick={() => cartDetailId !== undefined && onRemove(cartDetailId)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button type="button"
                          onClick={() => cartDetailId !== undefined && (qty > 1 ? onUpdateQty(cartDetailId, qty - 1) : onRemove(cartDetailId))}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer font-bold text-lg">−</button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-slate-800 border-x border-slate-200">{qty}</span>
                        <button type="button"
                          onClick={() => cartDetailId !== undefined && qty < p.stock && onUpdateQty(cartDetailId, qty + 1)}
                          className={`w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold text-lg ${qty >= p.stock ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}>+</button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">${p.price} × {qty}</p>
                        <p className="font-extrabold text-slate-900">${(p.price * qty).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => onNavigate("catalogo")}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium mt-2 cursor-pointer">
                <ArrowLeft size={14} />Seguir comprando
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
                <h2 className="font-bold text-slate-900 text-base mb-4">Resumen del pedido</h2>
                <div className="space-y-3 text-sm">
                  {cart.map(({ product: p, qty, cartDetailId }) => (
                    <div key={cartDetailId ?? p.id} className="flex justify-between text-slate-600">
                      <span className="truncate mr-2">{p.name} × {qty}</span>
                      <span className="font-medium flex-shrink-0">${(p.price * qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-slate-600">
                    <span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Envío estimado</span><span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-900 font-bold text-base">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button type="button" onClick={onCheckout}
                  className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <CheckCircle size={17} />Proceder al pago
                </button>
                <button type="button" onClick={() => onNavigate("catalogo")}
                  className="w-full mt-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}