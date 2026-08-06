import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Owner, OwnerCreateDto, OwnerUpdateDto } from '../../Types';
import { Modal } from '../common/Modal';
import { Field } from '../common/Field';
import { inputCls, selectCls } from '../../styles/formStyles';

type FormState = {
  nombre: string; apellido: string; email: string; telefono: string;
  direccion: string; porcentaje_comision: string; estado: string;
};

const EMPTY: FormState = { nombre: "", apellido: "", email: "", telefono: "", direccion: "", porcentaje_comision: "10", estado: "Activo" };

export function OwnerModal({ onClose, onCreate, onUpdate, initialData, editMode = false }: {
  onClose: () => void;
  onCreate: (dto: OwnerCreateDto) => Promise<void>;
  onUpdate: (id: number, dto: OwnerUpdateDto) => Promise<void>;
  initialData?: Owner;
  editMode?: boolean;
}) {
  const [form, setForm] = useState<FormState>(
    editMode && initialData
      ? { nombre: initialData.nombre, apellido: initialData.apellido, email: initialData.email, telefono: initialData.telefono, direccion: initialData.direccion ?? "", porcentaje_comision: String(initialData.comision ?? 10), estado: initialData.estado || "Activo" }
      : EMPTY
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim())   e.nombre   = "Campo requerido";
    if (!form.apellido.trim()) e.apellido = "Campo requerido";
    if (!form.email.trim())    e.email    = "Campo requerido";
    if (!form.telefono.trim()) e.telefono = "Campo requerido";
    if (!form.porcentaje_comision.trim() || isNaN(Number(form.porcentaje_comision))) e.porcentaje_comision = "Valor numérico requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editMode && initialData) {
        await onUpdate(initialData.id, {
          nombre: form.nombre, apellido: form.apellido, email: form.email, telefono: form.telefono,
          porcentaje_comision: Number(form.porcentaje_comision), direccion: form.direccion,
        });
      } else {
        await onCreate({
          nombre: form.nombre, apellido: form.apellido, email: form.email, telefono: form.telefono,
          porcentaje_comision: Number(form.porcentaje_comision), direccion: form.direccion, estado: form.estado,
        });
      }
      onClose();
    } catch (err: any) {
      setApiError(err.message || "No se pudo guardar el propietario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={editMode ? "Editar Propietario" : "Nuevo Propietario"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{apiError}</p>}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre" required>
            <input className={inputCls} value={form.nombre} onChange={e => set("nombre", e.target.value)} />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </Field>
          <Field label="Apellido" required>
            <input className={inputCls} value={form.apellido} onChange={e => set("apellido", e.target.value)} />
            {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido}</p>}
          </Field>

          <div className="col-span-2">
            <Field label="Correo electrónico" required>
              <input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </Field>
          </div>

          <Field label="Teléfono" required>
            <input className={inputCls} value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="809-000-0000" />
            {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
          </Field>

          <Field label="Comisión (%)" required>
            <input type="number" min="0" max="100" step="0.1" className={inputCls} value={form.porcentaje_comision} onChange={e => set("porcentaje_comision", e.target.value)} />
            {errors.porcentaje_comision && <p className="text-xs text-red-500 mt-1">{errors.porcentaje_comision}</p>}
          </Field>

          <div className="col-span-2">
            <Field label="Dirección">
              <input className={inputCls} value={form.direccion} onChange={e => set("direccion", e.target.value)} />
            </Field>
          </div>

          {!editMode && (
            <div className="col-span-2">
              <Field label="Estado" required>
                <select className={selectCls} value={form.estado} onChange={e => set("estado", e.target.value)}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </Field>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Crear Propietario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}