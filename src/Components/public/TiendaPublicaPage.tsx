import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { Page, Product } from '../../Types';
import { PublicNav } from './PublicNav';
import { ProductResponse } from '../../interfaces/IProduct';
import { getProducts } from '../../services/productService';
import { getImageUrl } from '../../utils/image';
import { StatusBadge } from '../common/StatusBadge';

export function TiendaPublicaPage({ onNavigate, userRole, onLogout, cartCount, onSelectProduct }: {
  onNavigate: (p: Page) => void; userRole: string | null;
  onLogout: () => void;
  cartCount: number;
  onSelectProduct: (productId: number) => void;
  onAddToCart?: (p: ProductResponse) => void;
}) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  useEffect(() => {
    getProducts()
      .then(products => setProducts(products.filter(p => p.stock > 0)))
      .catch(err => console.error("Error al cargar el catálogo:", err));
  }, []);
  const featured = products.slice(0, 6);

  const handleProductClick = (productId: number) => {
    onSelectProduct(productId);
    onNavigate("detalle");
  }
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="tienda" cartCount={cartCount} />
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">Encuentra artículos de segunda mano al mejor precio</h1>
            <p className="text-slate-300 mb-8 text-base">Calidad garantizada, precios imbatibles. Tu tesoro está aquí.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate("catalogo")} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-full transition-all cursor-pointer">Ver catálogo</button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Artículos destacados</h2>
          <button type="button" onClick={() => onNavigate("catalogo")} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1 cursor-pointer">Ver todos <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer" onClick={() => handleProductClick(product.id)}>
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={getImageUrl(product.imagenUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3"><StatusBadge status={product.physicalState} /></div>
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-sm line-clamp-1">{product.name}</h3>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900">${product.price}</span>
                  <span className="text-xs text-slate-400">{product.categoryName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && <p className="text-center text-slate-400 py-10">No hay artículos disponibles todavía.</p>}
      </main>

      <footer className="bg-slate-900 text-white py-10 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-blue-400" /><span className="font-bold">ReWear</span></div>
          <p className="text-slate-400 text-xs">© 2026 ReWear. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Instagram className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
            <Facebook className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
            <Twitter className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}