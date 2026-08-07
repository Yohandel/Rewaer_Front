import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { RoleDto, Role } from '../../Types';
import { Modal } from '../common/Modal';
import { Field } from '../common/Field';
import { inputCls } from '../../styles/formStyles';

export function RoleModal({ onClose, onSave, initialData, editMode = false }: {
  onClose: () => void; onSave: (dto: RoleDto) => Promise<void>; initialData?: Role; editMode?: boolean;
}) {
  const [form, setForm] = useState<RoleDto>({ nombre: initialData?.nombre ?? "", descripcion: initialData?.descripcion ?? "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError("El nombre del rol es requerido"); return; }
    setSubmitting(true);
    try { await onSave(form); onClose(); }
    catch (err: any) { setError(err.message || "No se pudo guardar el rol"); }
    finally { setSubmitting(false); }
  };

  return (
    <Modal title={editMode ? "Editar Rol" : "Nuevo Rol"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}
        <Field label="Nombre del rol" required>
          <input className={inputCls} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Supervisor" />
        </Field>
        <Field label="Descripción">
          <textarea rows={3} className={inputCls} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        </Field>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Crear Rol"}
          </button>
        </div>
      </form>
    </Modal>
  );
}