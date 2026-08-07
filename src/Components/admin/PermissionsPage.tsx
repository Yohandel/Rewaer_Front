import React, { useEffect, useState } from 'react';
import { Search, Plus, KeyRound, Info } from 'lucide-react';
import { Permission, PermissionDto } from '../../Types';
import { getPermissions, createPermission } from '../../services/permissionService';
import { Toast } from '../common/Toast';
import { PermissionModal } from './PermissionModal';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    getPermissions().then(setPermissions).catch(err => setLoadError(err.message || "No se pudieron cargar los permisos")).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = permissions.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const handleSave = async (dto: PermissionDto) => {
    await createPermission(dto);
    showToast(`Permiso "${dto.nombre_permiso}" creado exitosamente`);
    load();
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modalOpen && <PermissionModal onClose={() => setModalOpen(false)} onSave={handleSave} />}

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Permisos</h1>
          <p className="text-xs text-gray-500 mt-0.5">Catálogo de permisos del sistema — {permissions.length} permisos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-36 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Nuevo Permiso
          </button>
        </div>
      </div>

      <div className="p-6 flex-1">
        <div className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-lg p-3">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>La API aún no permite editar ni eliminar permisos. Para asignar o quitar un permiso a un empleado, ve a Configuración → selecciona el empleado.</span>
        </div>

        {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr><th className="px-6 py-3">Permiso</th><th className="px-6 py-3">Descripción</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {pageItems.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">
                    <div className="flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><KeyRound size={12} className="text-amber-600" /></div>
                      <span className="font-mono text-xs">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">{p.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay permisos registrados.</div>}
          {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}