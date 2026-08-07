import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="h-full flex items-center justify-center text-center p-10">
      <div>
        <ShieldAlert className="mx-auto mb-3 text-red-400" size={40} />
        <h2 className="text-lg font-bold text-gray-700">Acceso restringido</h2>
        <p className="text-sm text-gray-400 mt-1">No tienes permisos de administrador para ver esta sección.</p>
      </div>
    </div>
  );
}