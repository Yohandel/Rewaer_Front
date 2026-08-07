import React, { useEffect, useState } from 'react';
import { Users, UserCog, Package, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { DashboardData } from '../../Types';
import { getDashboard } from '../../services/dashboardService';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard().then(setData).catch(err => setError(err.message || "No se pudo cargar el dashboard"));
  }, []);

  const cards = data ? [
    { label: "Clientes",            value: data.totalClientes,     icon: Users,         color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Empleados",           value: data.totalEmpleados,    icon: UserCog,       color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Artículos",           value: data.totalArticulos,    icon: Package,       color: "text-slate-700",  bg: "bg-slate-100" },
    { label: "Ventas Totales",      value: `$${Number(data.ventasTotales).toFixed(2)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pedidos Pendientes",  value: data.pedidosPendientes, icon: Clock,         color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Pedidos Completados", value: data.pedidosCompletados,icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50" },
    { label: "Artículos sin Stock", value: data.articulosSinStock, icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50" },
  ] : [];

  return (
    <div className="p-6 overflow-auto h-full">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h1>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{error}</div>}
      {!data && !error && <p className="text-sm text-gray-400">Cargando…</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.bg}`}><Icon size={16} className={s.color} /></div>
              <div className="text-xs text-gray-400 font-bold uppercase">{s.label}</div>
              <div className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}