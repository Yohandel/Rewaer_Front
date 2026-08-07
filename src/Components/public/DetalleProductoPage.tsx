import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart as CartIcon, Clock } from 'lucide-react';
import { Page, Product } from '../../Types';
import { PublicNav } from './PublicNav';
import { ProductResponse } from '../../interfaces/IProduct';
import { getImageUrl } from '../../utils/image';
import { getProductById } from '../../services/productService';
import { StatusBadge } from '../common/StatusBadge';
import { Toast } from '../common/Toast';

export function DetalleProductoPage({ product, onNavigate, userRole, onLogout, onAddToCart, cartCount }: {
  product: ProductResponse | null; onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void;
  onAddToCart: (p: ProductResponse) => void; cartCount: number;
}) {
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);
  const [selectedProduct, setselectedProduct] = useState<ProductResponse>();
  const isAuth = userRole === "client" || userRole === "admin";
  const requireAuth = () => { setToast(true); setTimeout(() => { onNavigate("login"); }, 1200); };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="tienda" cartCount={cartCount} />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">Cargando artículo…</div>
      </div>
    );
  }

  useEffect(() => {
      getProductById(product?.id).then(res => console.log(res)).catch(err => setProductsError(err.message || "No se pudo cargar el catálogo"));
    }, []);
  const p = product;
  const handleCart = () => {
    if (!isAuth) { requireAuth(); return; }
    onAddToCart(p);
    setAdded(true); setTimeout(() => setAdded(false), 2000);
  };
  const handleApartar = () => { if (!isAuth) requireAuth(); };
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {toast && <Toast message="Debes iniciar sesión o registrarte para acceder a esta funcionalidad" onClose={() => setToast(false)} />}
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="tienda" cartCount={cartCount} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <button type="button" onClick={() => onNavigate("tienda")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 cursor-pointer transition-colors">
          <ArrowLeft size={16} />Volver al inicio
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-slate-100 h-72 md:h-auto">
              <img src={getImageUrl(product.imagenUrl)} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <StatusBadge status={p.physicalState} />
              </div>
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{p.categoryName}</p>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{p.name}</h1>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-medium">Precio</span>
                    <span className="text-sm font-bold">
                      {p.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-medium">Estado del producto</span>
                    <StatusBadge status={p.physicalState} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-medium">Proveedor</span>
                    <span className="text-sm font-semibold text-slate-800">{p.owner}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-medium">Ejemplares disponibles</span>
                    <span className={`text-sm font-bold ${p.stock <= 1 ? "text-red-600" : "text-green-600"}`}>
                      {p.stock} {p.stock === 1 ? "unidad" : "unidades"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <button type="button" onClick={handleCart}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors cursor-pointer ${added ? "bg-green-500 text-white" : "bg-slate-900 hover:bg-blue-600 text-white"}`}>
                  <CartIcon size={16} />{added ? "¡Agregado al carrito!" : "Agregar al carrito"}
                </button>
                <button type="button" onClick={handleApartar}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Clock size={16} />Apartar ahora mismo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function setProductsError(arg0: any): any {
  throw new Error('Function not implemented.');
}
