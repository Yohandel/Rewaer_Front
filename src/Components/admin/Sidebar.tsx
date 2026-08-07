import React, { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings, Store, LogOut,
  Briefcase, UserCog, Shield, Warehouse, KeyRound
} from 'lucide-react';
import { Page } from '../../Types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { PERMISSION_KEYS, hasPermission } from '../../utils/permissions';

const navItems: { icon: any; label: string; page: Page; adminOnly?: boolean; permission?: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard",     page: "dashboard",     adminOnly: true },
  { icon: Package,         label: "Productos",     page: "productos" },
  { icon: Warehouse,       label: "Inventario",    page: "inventario",    permission: PERMISSION_KEYS.INVENTARIO },
  { icon: ShoppingCart,    label: "Ventas",        page: "ventas" },
  { icon: Users,           label: "Usuarios",      page: "usuarios",      adminOnly: true },
  { icon: UserCog,         label: "Empleados",     page: "empleados",     adminOnly: true },
  { icon: Briefcase,       label: "Propietarios",  page: "propietarios",  permission: PERMISSION_KEYS.PROPIETARIOS },
  { icon: Tag,             label: "Categorías",    page: "categorias",    permission: PERMISSION_KEYS.CATEGORIAS },
  { icon: Shield,          label: "Roles",         page: "roles",         permission: PERMISSION_KEYS.ROLES },
  { icon: KeyRound,        label: "Permisos",      page: "permisos",      adminOnly: true },
  { icon: Settings,        label: "Configuración", page: "configuracion", adminOnly: true },
];

export function Sidebar({ current, onNavigate, onLogout, isAdmin, permissions }: {
  current: Page; onNavigate: (p: Page) => void; onLogout: () => void; isAdmin: boolean | undefined; permissions: string[];
}) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const visibleItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.permission) return isAdmin || hasPermission(permissions, item.permission);
    return true;
  });

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
        {visibleItems.map((item, i) => {
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