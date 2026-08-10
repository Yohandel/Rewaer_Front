import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, ShoppingBag, ShoppingCart as CartIcon, LogOut, User, Package, ChevronDown } from 'lucide-react';
import { Page } from '../../Types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MeResponse } from '../../interfaces/IMeResponse';
import { getMe } from '../../services/authService';

export function PublicNav({ onNavigate, userRole, onLogout, currentPage, cartCount }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void; currentPage: Page; cartCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setClientMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    getMe()
      .then(me => setCurrentUser(me))
      .catch(() => setCurrentUser(null));
  }, []);

  const link = (label: string, page: Page) => (
    <button type="button" onClick={() => { onNavigate(page); setOpen(false); }}
      className={`text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`}>
      {label}
    </button>
  );

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
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">ReWear</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {link("Inicio", "tienda")}
            {link("Catálogo", "catalogo")}
            {link("Contacto", "contacto")}
          </nav>
          <div className="hidden md:flex items-center gap-3">

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
              <div className="relative" ref={menuRef}>
                <button type="button" onClick={() => setClientMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">C</div>
                  <span className="text-xs font-medium text-blue-900">{currentUser?.name}</span>
                  <ChevronDown size={13} className="text-blue-700" />
                </button>
                {clientMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
                    <button type="button" onClick={() => { onNavigate("mi-perfil"); setClientMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                      <User size={14} />Mi perfil
                    </button>
                    <button type="button" onClick={() => { onNavigate("mis-pedidos"); setClientMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                      <Package size={14} />Mis pedidos
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button type="button" onClick={() => { setConfirmLogout(true); setClientMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                      <LogOut size={14} />Cerrar sesión
                    </button>
                  </div>
                )}
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
          {userRole === "client" && (
            <>
              <div className="border-t border-slate-100 pt-3" />
              {link("Mi perfil", "mi-perfil")}
              {link("Mis pedidos", "mis-pedidos")}
              <button type="button" onClick={onLogout} className="text-sm font-medium text-red-500 text-left cursor-pointer">Cerrar sesión</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}