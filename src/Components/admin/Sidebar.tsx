import React, { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings, Store, LogOut, Briefcase, UserCog
} from 'lucide-react';
import { Page } from '../../Types';
import { ConfirmDialog } from '../common/ConfirmDialog';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",    page: "dashboard"    as Page },
  { icon: Package,         label: "Productos",    page: "productos"    as Page },
  { icon: ShoppingCart,    label: "Ventas",       page: "ventas"       as Page },
  { icon: Users,           label: "Usuarios",     page: "usuarios"     as Page },
  { icon: UserCog,         label: "Empleados",    page: "empleados"    as Page },
  { icon: Briefcase,       label: "Propietarios", page: "propietarios" as Page },
  { icon: Tag,             label: "Categorías",   page: "categorias"   as Page },
  { icon: Settings,        label: "Configuración",page: "configuracion" as Page },
];

export function Sidebar({ current, onNavigate, onLogout }: { current: Page; onNavigate: (p: Page) => void; onLogout: () => void }) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  return (
    <div className="w-48 bg-[#1a1a2e] flex flex-col h-full flex-shrink-0">
      {confirmLogout && (
        <ConfirmDialog
          title="¿Cerrar sesión?"
          message="¿Estás seguro de que deseas cerrar tu sesión actual?"
          confirmLabel="Sí, cerrar sesión"
          onConfirm={() => { setConfirmLogout(false); onLogout(); }}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store size={14} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold leading-tight">ReWear Admin</span>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const active = current === item.page;
          return (
            <button key={i} type="button" onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left w-full transition-colors cursor-pointer ${active ? "bg-blue-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
              <Icon size={15} /><span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button type="button" onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors cursor-pointer">
          <LogOut size={15} /><span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}