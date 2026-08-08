import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Permission, PermissionDto } from '../../Types';
import { Modal } from '../common/Modal';
import { Field } from '../common/Field';
import { inputCls } from '../../styles/formStyles';

export function PermissionModal({ onClose, onSave, initialData, editMode = false }: {
  onClose: () => void;
  onSave: (dto: PermissionDto, id?: number) => Promise<void>;
  initialData?: Permission;
  editMode?: boolean;
}) {
  const [form, setForm] = useState<PermissionDto>({
    nombre_permiso: initialData?.nombre ?? "",
    descripcion: initialData?.descripcion ?? "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre_permiso.trim()) { setError("El nombre del permiso es requerido"); return; }
    setSubmitting(true);
    try { await onSave(form, initialData?.id); onClose(); }
    catch (err: any) { setError(err.message || "No se pudo guardar el permiso"); }
    finally { setSubmitting(false); }
  };

  return (
    <Modal title={editMode ? "Editar Permiso" : "Nuevo Permiso"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}

        {!editMode && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            Usa un nombre técnico sin espacios (ej. <code className="bg-white px-1 rounded">gestionar_inventario</code>) para poder usarlo luego como control de acceso.
          </div>
        )}

        <Field label="Nombre del permiso" required>
          <input className={inputCls} value={form.nombre_permiso} onChange={e => setForm(f => ({ ...f, nombre_permiso: e.target.value }))} placeholder="Ej: gestionar_inventario" />
        </Field>
        <Field label="Descripción">
          <textarea rows={3} className={inputCls} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="¿Qué le permite hacer este permiso al empleado?" />
        </Field>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Crear Permiso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}