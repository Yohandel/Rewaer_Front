import React from 'react';

export function DashboardPage() {
  return (
    <div className="p-6 overflow-auto h-full">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Productos Activos", value: "124", color: "text-slate-800" },
          { label: "Ventas de Hoy",      value: "$450", color: "text-green-600" },
          { label: "Usuarios Nuevos",    value: "+12",  color: "text-blue-600" },
          { label: "Categorías",         value: "8",    color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-400 font-bold uppercase">{s.label}</div>
            <div className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}