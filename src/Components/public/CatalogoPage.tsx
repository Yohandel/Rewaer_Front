import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Page, Product } from '../../Types';
import { PublicNav } from './PublicNav';
import { ProductCard } from './ProductCard';
import { Toast } from '../Common/Toast';
import { ProductResponse } from '../../interfaces/IProduct';

export function CatalogoPage({ onNavigate, userRole, onLogout, onSelectProduct, onAddToCart, cartCount, products }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void;
  onSelectProduct: (id: number) => void; onAddToCart: (p: ProductResponse) => void; cartCount: number; products: ProductResponse[];
}) {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName.toLowerCase().includes(search.toLowerCase()));
  const handleRequireAuth = () => { setToast(true); onNavigate("login"); };
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {toast && <Toast message="Debes iniciar sesión o registrarte para acceder a esta funcionalidad" onClose={() => setToast(false)} />}
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="catalogo" cartCount={cartCount} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Catálogo completo</h1>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} artículos disponibles</p>
          </div>
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Buscar en catálogo..."
              className="bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm outline-none w-60 text-slate-900 shadow-sm" />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} small userRole={userRole} onRequireAuth={handleRequireAuth} onAddToCart={onAddToCart}
              onDetail={() => { onSelectProduct(p.id); onNavigate("detalle"); }} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">No se encontraron artículos para "<strong>{search}</strong>".</div>
        )}
      </div>
    </div>
  );
}