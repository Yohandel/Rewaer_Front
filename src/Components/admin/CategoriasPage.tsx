import React, { useEffect, useState } from 'react';
import { Search, Plus, Tags, Edit2, Trash2 } from 'lucide-react';
import { CatForm, CategoryResponse } from '../../Types';
import { Toast } from '../Common/Toast';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { NuevaCategoriaModal } from './NuevaCategoriaModal';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/categoryService';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

export function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; target?: CategoryResponse } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (form: CatForm) => {
    if (modal?.mode === "edit" && modal.target) {
      updateCategory(modal.target.id, { Name: form.name, Description: form.description })
        .then(updatedCategory => {
          fetchCategories();
          showToast(`Categoría "${updatedCategory.name}" actualizada exitosamente`);
        });
    } else {
      createCategory({ Name: form.name, Description: form.description })
        .then(newCategory => {
          fetchCategories();
          showToast(`Categoría "${newCategory.name}" creada exitosamente`);
        })
        .catch(() => {
          showToast("Error al crear la categoría", "danger");
        });
    }
  };

  const handleDelete = () => {

    deleteCategory(deleteTarget!.id)
      .then(() => {
        showToast("Registro eliminado satisfactoriamente", "danger");
        fetchCategories();
        setDeleteTarget(null);
      })
      .catch(() => {
        showToast("Error al eliminar la categoría", "danger");
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    getCategories()
      .then(data => setCategories(data.filter(c => c.estado)))
      .catch(() => showToast("Error al cargar las categorías", "danger"));
  }
  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  return (
    <div className="flex flex-col h-full overflow-auto">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && (
        <NuevaCategoriaModal
          onClose={() => setModal(null)}
          onSave={handleSave}
          initialData={modal.target ? { name: modal.target.name, description: modal.target.description } : undefined}
          editMode={modal.mode === "edit"}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Eliminar categoría?"
          message={`¿Estás seguro de que deseas eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Sí, eliminar"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestión de Categorías</h1>
          <p className="text-xs text-gray-500 mt-0.5">Administra las categorías del catálogo — {categories.length} categorías</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-36 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Agregar Categoría
          </button>
        </div>
      </div>

      <div className="p-6 flex-1">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">ID Categoría</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {pageItems.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-3"><span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{cat.id}</span></td>
                  <td className="px-6 py-3 font-medium">
                    <div className="flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><Tags size={12} className="text-blue-600" /></div>
                      {cat.name}
                    </div>
                  </td>
                  <td className="px-6 py-3">{cat.description}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 ">
                      <button type="button" onClick={() => setModal({ mode: "edit", target: cat })} className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 size={13} className="text-blue-500" /></button>
                      <button type="button" onClick={() => setDeleteTarget(cat)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              {search ? `No se encontraron categorías para "${search}".` : "No hay categorías. ¡Crea la primera!"}
            </div>)}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}