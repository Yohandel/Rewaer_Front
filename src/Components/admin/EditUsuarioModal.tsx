import React, { useState } from 'react';
import { UserForm, UserRow } from '../../Types';
import { Modal } from '../Common/Modal';
import { Field } from '../Common/Field';
import { inputCls, selectCls } from '../../styles/formStyles';

export function EditUsuarioModal({ onClose, onSave, user }: { onClose: () => void; onSave: (f: UserForm) => void; user: UserRow }) {
  const [form, setForm] = useState<UserForm>({ name: user.name, email: user.email, role: user.role, status: user.status });
  const set = (k: keyof UserForm, v: string) => setForm(f => ({ ...f, [k]: v }));
  const [errors, setErrors] = useState<Partial<UserForm>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<UserForm> = {};
    if (!form.name.trim()) errs.name = "Campo requerido";
    if (!form.email.trim()) errs.email = "Campo requerido";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
    onClose();
  };

  return (
    <Modal title="Editar Usuario" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">{form.name[0] || "?"}</div>
          <div><p className="text-xs text-gray-400 font-mono">{user.id}</p></div>
        </div>
        <Field label="Nombre completo" required>
          <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </Field>
        <Field label="Correo electrónico" required>
          <input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rol" required>
            <select className={selectCls} value={form.role} onChange={e => set("role", e.target.value)}>
              {["Admin", "Vendedor", "Soporte"].map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Estado" required>
            <select className={selectCls} value={form.status} onChange={e => set("status", e.target.value)}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Guardar cambios</button>
        </div>
      </form>
    </Modal>
  );
}