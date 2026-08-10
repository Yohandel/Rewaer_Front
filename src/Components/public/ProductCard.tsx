import React, { useState } from 'react';
import { ShoppingCart as CartIcon, Clock } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProductResponse } from '../../interfaces/IProduct';
import { getImageUrl } from '../../utils/image';

export function ProductCard({ product, onDetail, onRequireAuth, onAddToCart, userRole, small = false }:
  { product: ProductResponse; onDetail: () => void; onRequireAuth: () => void; onAddToCart: (p: ProductResponse) => void; userRole: string | null; small?: boolean }) {
  const [added, setAdded] = useState(false);
  const isAuth = userRole === "client" || userRole === "admin";
  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) { onRequireAuth(); return; }
    onAddToCart(product);
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };
  const handleApartar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) { onRequireAuth(); return; }
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group">
      <div className={`relative overflow-hidden bg-slate-100 cursor-pointer ${small ? "h-36" : "aspect-square"}`} onClick={onDetail}>
        <img src={getImageUrl(product.imagenUrl)}
          alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <StatusBadge status={product.physicalState} />
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 cursor-pointer hover:text-blue-600" onClick={onDetail}>{product.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{product.categoryName}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          <button type="button" onClick={handleCart}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer ${added ? "bg-green-500 text-white" : "bg-slate-900 hover:bg-blue-600 text-white"}`}>
            <CartIcon size={13} />{added ? "¡Agregado!" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}