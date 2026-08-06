import React from 'react';

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completada: "bg-green-100 text-green-700", Pendiente: "bg-yellow-100 text-yellow-700",
    Cancelada: "bg-red-100 text-red-700",      Nuevo: "bg-blue-100 text-blue-700",
    Usado: "bg-gray-100 text-gray-600",        "Buen estado": "bg-teal-100 text-teal-700",
    Activo: "bg-green-100 text-green-700",     Inactivo: "bg-gray-100 text-gray-600",
    Admin: "bg-purple-100 text-purple-700",    Vendedor: "bg-blue-100 text-blue-700",
    Excelente: "bg-green-100 text-green-700",  Bueno: "bg-teal-100 text-teal-700",
    Aceptable: "bg-yellow-100 text-yellow-700","Como nuevo": "bg-blue-100 text-blue-700",
    Oferta: "bg-red-500 text-white",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>;
}