import React, { useEffect, useState } from 'react';
import { Search, Plus, Shield, Edit2, Trash2 } from 'lucide-react';
import { Role, RoleDto } from '../../Types';
import { getRoles, createRole, updateRole, deactivateRole } from '../../services/roleService';
import { Toast } from '../common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { RoleModal } from './RoleModal';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; target?: Role } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    getRoles().then(setRoles).catch(err => setLoadError(err.message || "No se pudieron cargar los roles")).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = roles.filter(r => r.nombre?.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const handleSave = async (dto: RoleDto) => {
    if (modal?.mode === "edit" && modal.target) {
      await updateRole(modal.target.id, dto);
      showToast(`Rol "${dto.nombre}" actualizado exitosamente`);
    } else {
      await createRole(dto);
      showToast(`Rol "${dto.nombre}" creado exitosamente`);
    }
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deactivateRole(deleteTarget.id);
      showToast("Rol desactivado satisfactoriamente", "danger");
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      showToast(err.message || "No se pudo desactivar el rol", "danger");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && <RoleModal onClose={() => setModal(null)} onSave={handleSave} initialData={modal.target} editMode={modal.mode === "edit"} />}
      {deleteTarget && (
        <ConfirmDialog title="¿Desactivar rol?" message={`¿Deseas desactivar el rol "${deleteTarget.nombre}"?`} confirmLabel="Sí, desactivar" danger
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Roles</h1>
          <p className="text-xs text-gray-500 mt-0.5">Administra los roles del sistema — {roles.length} roles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-36 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Nuevo Rol
          </button>
        </div>
      </div>

      <div className="p-6 flex-1">
        {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr><th className="px-6 py-3">Rol</th><th className="px-6 py-3">Descripción</th><th className="px-6 py-3 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {pageItems.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-3 font-medium">
                    <div className="flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"><Shield size={12} className="text-purple-600" /></div>
                      {r.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">{r.descripcion}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => setModal({ mode: "edit", target: r })} className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 size={13} className="text-blue-500" /></button>
                      <button type="button" onClick={() => setDeleteTarget(r)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay roles registrados.</div>}
          {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}