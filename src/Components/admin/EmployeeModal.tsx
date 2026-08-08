import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto, Role } from '../../Types';
import { Modal } from '../Common/Modal';
import { Field } from '../Common/Field';
import { inputCls, selectCls } from '../../styles/formStyles';
import { getRoles } from '../../services/roleService';

type FormState = {
  nombre: string; apellido: string; email: string; telefono: string; direccion: string;
  contrasena: string; fecha_ingreso: string; estado_laboral: string; id_rol: number;
};
const EMPTY: FormState = {
  nombre: "", apellido: "", email: "", telefono: "", direccion: "",
  contrasena: "", fecha_ingreso: new Date().toISOString().slice(0, 10), estado_laboral: "Activo", id_rol: 0,
};

export function EmployeeModal({ onClose, onCreate, onUpdate, initialData, editMode = false }: {
  onClose: () => void;
  onCreate: (dto: EmployeeCreateDto) => Promise<void>;
  onUpdate: (id: number, dto: EmployeeUpdateDto) => Promise<void>;
  initialData?: Employee;
  editMode?: boolean;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [roles, setroles] = useState<Role[]>([])

  const [form, setForm] = useState<FormState>(
    editMode && initialData
      ? { ...EMPTY, nombre: initialData.nombre, apellido: initialData.apellido, email: initialData.email, telefono: initialData.telefono ?? "", direccion: initialData.direccion ?? "", id_rol: initialData.rolId ?? 2 }
      : EMPTY
  );

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Campo requerido";
    if (!form.apellido.trim()) e.apellido = "Campo requerido";
    if (!form.email.trim()) e.email = "Campo requerido";
    if (!form.telefono.trim()) e.telefono = "Campo requerido";
    if (!editMode && (!form.contrasena.trim() || form.contrasena.length < 4)) e.contrasena = "Mínimo 4 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    fectRoles()
  }, [])


  const fectRoles = () => {
    getRoles().then(roles => {
      setroles(roles)
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editMode && initialData) {
        await onUpdate(initialData.id, {
          nombre: form.nombre, apellido: form.apellido, email: form.email,
          telefono: form.telefono, direccion: form.direccion, id_rol: Number(form.id_rol),
        });
      } else {
        await onCreate({
          nombre: form.nombre, apellido: form.apellido, email: form.email, telefono: form.telefono,
          contrasena: form.contrasena,
          estado_laboral: form.estado_laboral, id_rol: Number(form.id_rol), direccion: form.direccion,
        });
      }
      onClose();
    } catch (err: any) {
      setApiError(err.message || "No se pudo guardar el empleado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={editMode ? "Editar Empleado" : "Nuevo Empleado"} onClose={onClose}>
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

          <Field label="Rol" required>
            <select className={selectCls} value={form.id_rol} onChange={e => set("id_rol", Number(e.target.value))}>
              <option value="0">Seleccionar...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </Field>

          <div >
            <Field label="Dirección">
              <input className={inputCls} value={form.direccion} onChange={e => set("direccion", e.target.value)} />
            </Field>
          </div>

          <Field label="Teléfono" required>
            <input className={inputCls} value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="809-000-0000" />
            {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
          </Field>

          <div >
            <Field label="Correo electrónico" required>
              <input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </Field>
          </div>

          {!editMode && (
            <>
              <Field label="Contraseña" required>
                <input type="password" className={inputCls} value={form.contrasena} onChange={e => set("contrasena", e.target.value)} />
                {errors.contrasena && <p className="text-xs text-red-500 mt-1">{errors.contrasena}</p>}
              </Field>
            </>
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Crear Empleado"}
          </button>
        </div>
      </form>
    </Modal>
  );
}