import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CatForm } from '../../Types';
import { Modal } from '../Common/Modal';
import { Field } from '../Common/Field';
import { inputCls } from '../../styles/formStyles';

const EMPTY_CAT: CatForm = { name: "", description: "" };

export function NuevaCategoriaModal({ onClose, onSave, initialData, editMode = false }: {
  onClose: () => void; 
  onSave: (c: CatForm) => void; 
  initialData?: CatForm; 
  editMode?: boolean;
}) {
  const [form, setForm] = useState<CatForm>(initialData ?? EMPTY_CAT);
  
  // Estado para los mensajes de error por campo
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const set = (k: keyof CatForm, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    
    // Limpiamos el error del campo en cuanto el usuario empieza a escribir
    if (errors[k]) {
      setErrors(prev => ({ ...prev, [k]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; description?: string } = {};

    // 1. Validar Nombre
    if (!form.name.trim()) {
      newErrors.name = "El nombre de la categoría es requerido.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    // 2. Validar Descripción
    if (!form.description.trim()) {
      newErrors.description = "La descripción es requerida.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres.";
    }

    // Si hay algún error, detenemos el envío
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Guardar si todo está bien
    onSave({
      name: form.name.trim(),
      description: form.description.trim()
    });
    onClose();
  };

  return (
    <Modal title={editMode ? "Editar Categoría" : "Nueva Categoría"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">

        <Field label="Nombre de la categoría" required>
          <input
            className={`${inputCls} ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Ej: Electrodomésticos"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            autoFocus
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
          )}
        </Field>

        <Field label="Descripción" required>
          <textarea
            rows={3}
            className={`${inputCls} ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Describe brevemente qué tipo de productos incluye esta categoría…"
            value={form.description}
            onChange={e => set("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.description}</p>
          )}
        </Field>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={15} />{editMode ? "Guardar cambios" : "Crear Categoría"}
          </button>
        </div>
      </form>
    </Modal>
  );
}