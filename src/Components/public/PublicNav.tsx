import React, { useState, useEffect } from 'react';
import { Search, Menu, ShoppingCart as CartIcon, LogOut } from 'lucide-react';
import { Page } from '../../Types';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { getMe } from '../../services/authservice';
import { MeResponse } from '../../interfaces/IMeResponse';

export function PublicNav({ onNavigate, userRole, onLogout, currentPage, cartCount }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void; currentPage: Page; cartCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const link = (label: string, page: Page) => (
    <button type="button" onClick={() => { onNavigate(page); setOpen(false); }}
      className={`text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`}>
      {label}
    </button>
  );

  useEffect(() => {
    getMe()
      .then(me => setCurrentUser(me))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {confirmLogout && (
        <ConfirmDialog
          title="¿Cerrar sesión?"
          message="¿Estás seguro de que deseas cerrar tu sesión actual?"
          confirmLabel="Sí, cerrar sesión"
          onConfirm={() => { setConfirmLogout(false); onLogout(); }}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("tienda")}>
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            <span className="text-xl font-bold tracking-tight text-slate-900">ReWear</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {link("Inicio", "tienda")}
            {link("Catálogo", "catalogo")}

            {link("Contacto", "contacto")}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input type="text" placeholder="Buscar artículo..." className="bg-slate-100 rounded-full pl-10 pr-4 py-1.5 text-sm outline-none w-48 lg:w-56 text-slate-900" />
              <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            </div>

            <button type="button" onClick={() => onNavigate("carrito")}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${currentPage === "carrito" ? "bg-blue-100 text-blue-600" : "text-slate-500 hover:bg-slate-100"}`}>
              <CartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {userRole === "client" ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">C</div>
                  <span className="text-xs font-medium text-blue-900">{currentUser?.name}</span>
                </div>
                <button type="button" onClick={() => setConfirmLogout(true)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => onNavigate("login")} className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer">Iniciar Sesión</button>
                <button type="button" onClick={() => onNavigate("registro")} className="text-sm font-medium bg-slate-900 text-white px-4 py-1.5 rounded-full hover:bg-slate-800 transition cursor-pointer">Registrarse</button>
              </>
            )}
          </div>
          <button type="button" onClick={() => setOpen(!open)} className="md:hidden text-slate-600 cursor-pointer"><Menu className="w-6 h-6" /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-3">
          {link("Inicio", "tienda")}{link("Catálogo", "catalogo")}{link("Contacto", "contacto")}
        </div>
      )}
    </header>
  );
}