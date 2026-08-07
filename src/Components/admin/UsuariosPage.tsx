import React, { useEffect, useState } from 'react';
import { Search, Info } from 'lucide-react';
import { ClientApi } from '../../Types';
import { getClientes } from '../../services/clientService';
import { StatusBadge } from '../Common/StatusBadge';

export function UsuariosPage() {
  const [clientes, setClientes] = useState<ClientApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(err => setLoadError(err.message || "No se pudieron cargar los clientes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Usuarios (Clientes)</h1>
          <p className="text-xs text-gray-500 mt-0.5">{clientes.length} clientes registrados</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-44 text-gray-800" placeholder="Buscar…" />
        </div>
      </div>

      {/* <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-lg p-3">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>Esta vista es de solo lectura — la API actualmente no expone edición ni eliminación de clientes.</span>
      </div> */}

      {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Registro</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono text-xs text-gray-400">{c.id}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.nombre} {c.apellido}</td>
                <td className="px-6 py-3 text-xs">{c.email}</td>
                <td className="px-6 py-3 text-xs">{c.telefono}</td>
                <td className="px-6 py-3 text-xs text-gray-500">{String(c.fecha_registro).slice(0, 10)}</td>
                <td className="px-6 py-3"><StatusBadge status={c.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay clientes registrados.</div>}
        {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
      </div>
    </div>
  );
}