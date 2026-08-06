import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Page, Product } from '../../Types';
import { OFFER_PRODUCTS } from '../../Data/products';
import { PublicNav } from './PublicNav';
import { ProductCard } from './ProductCard';
import { Toast } from '../Common/Toast';

export function OfertasPage({ onNavigate, userRole, onLogout, onSelectProduct, onAddToCart, cartCount }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void;
  onSelectProduct: (id: number) => void; onAddToCart: (p: Product) => void; cartCount: number;
}) {
  const [toast, setToast] = useState(false);
  const handleRequireAuth = () => { setToast(true); onNavigate("login"); };
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {toast && <Toast message="Debes iniciar sesión o registrarte para acceder a esta funcionalidad" onClose={() => setToast(false)} />}
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="ofertas" cartCount={cartCount} />
      <div className="bg-red-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-7 h-7 fill-white" />
            <h1 className="text-3xl font-bold">Ofertas especiales</h1>
          </div>
          <p className="text-red-100 text-sm">Artículos con descuento por tiempo limitado. ¡Aprovecha antes de que se agoten!</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <p className="text-slate-500 text-sm mb-6">{OFFER_PRODUCTS.length} ofertas disponibles</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {OFFER_PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p} small userRole={userRole} onRequireAuth={handleRequireAuth} onAddToCart={onAddToCart}
              onDetail={() => { onSelectProduct(p.id); onNavigate("detalle"); }} />
          ))}
        </div>
      </div>
    </div>
  );
}