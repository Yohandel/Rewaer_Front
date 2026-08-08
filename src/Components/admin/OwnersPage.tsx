import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { owner, ownerCreateDto, ownerUpdateDto } from '../../Types';
import { getowners, getowner, createowner, updateowner, deactivateowner } from '../../services/ownerService';
import { Toast } from '../Common/Toast';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { OwnerModal } from './ownerModal';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../Common/Pagination';

export function OwnersPage() {
  const [owners, setowners] = useState<owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; data?: owner } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<owner | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    getowners()
      .then(setowners)
      .catch(err => setLoadError(err.message || "No se pudieron cargar los proveedor"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = owners.filter(o =>
    `${o.nombre} ${o.apellido}`.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = async (owner: owner) => {
    try {
      const detail = await getowner(owner.id); // trae "porcentaje" en vez de "comision"
      setModal({ mode: "edit", data: { ...owner, ...detail, comision: detail.porcentaje ?? owner.comision } });
    } catch {
      setModal({ mode: "edit", data: owner });
    }
  };

  const handleCreate = async (dto: ownerCreateDto) => {
    await createowner(dto);
    showToast(`Propietario "${dto.nombre}" creado exitosamente`);
    load();
  };

  const handleUpdate = async (id: number, dto: ownerUpdateDto) => {
    await updateowner(id, dto);
    showToast(`Propietario "${dto.nombre}" actualizado exitosamente`);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deactivateowner(deleteTarget.id);
      showToast("Propietario desactivado satisfactoriamente", "danger");
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      showToast(err.message || "No se pudo desactivar el propietario", "danger");
      setDeleteTarget(null);
    }
  };

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  return (
    <div className="p-6 overflow-auto h-full relative">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && (
        <OwnerModal
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          initialData={modal.data}
          editMode={modal.mode === "edit"}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Desactivar proveedor?"
          message={`¿Estás seguro de que deseas desactivar a "${deleteTarget.nombre} ${deleteTarget.apellido}"?`}
          confirmLabel="Sí, desactivar"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Proveedor</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestiona los proveedor de artículos — {owners.length} registrados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-40 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Nuevo Propietario
          </button>
        </div>
      </div>

      {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Comisión</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {pageItems.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{o.nombre} {o.apellido}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{o.email}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{o.telefono}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{o.comision}%</td>
                <td className="px-4 py-3"><StatusBadge status={o.estado} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => openEdit(o)} className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 size={13} className="text-blue-500" /></button>
                    <button type="button" onClick={() => setDeleteTarget(o)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay proveedor registrados.</div>}
        {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}