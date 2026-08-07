import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryResponse, owner, ProductForm } from '../../Types';
import { ADMIN_CATEGORIES } from '../../Data/mockData';
import { Modal } from '../Common/Modal';
import { Field } from '../Common/Field';
import { inputCls, selectCls } from '../../styles/formStyles';
import { getCategories } from '../../services/categoryService';
import { Toast } from '../Common/Toast';
import { getowners } from '../../services/ownerService';

const EMPTY_PRODUCT: ProductForm = { name: "", categoryId: 0, price: "", physicalState: "Buen estado", ownerId: 2, description: "", owner: "" };

export function NuevoProductoModal({ onClose, onSave, initialData, editMode = false }: {
  onClose: () => void; onSave: (p: ProductForm, id?: number) => void;
  initialData?: ProductForm & { id?: number }; editMode?: boolean;
}) {
  const [form, setForm] = useState<ProductForm>(initialData ?? EMPTY_PRODUCT);
  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [owners, setowners] = useState<owner[]>([]);
  const [loadError, setLoadError] = useState("");
  const set = (k: keyof ProductForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);
  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e: Partial<ProductForm> = {};
    if (!form.name.trim()) e.name = "Campo requerido";
    if (!form.price.trim() || isNaN(Number(form.price))) e.price = "Precio válido requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, initialData?.id);
    onClose();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getCategories()
      .then(data => setCategories(data.filter(c => c.estado)))
      .catch(() => showToast("Error al cargar las categorías", "danger"));
    getowners()
      .then(setowners)
      .catch(err => setLoadError(err.message || "No se pudieron cargar los propietarios"))
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length)
      return;

    setForm(f => ({
      ...f,
      image: e.target.files![0]
    }));
  };
  return (
    <Modal title={editMode ? "Editar Producto" : "Nuevo Producto"} onClose={onClose}>
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Nombre del producto" required>
              <input className={inputCls} placeholder="Ej: Silla ergonómica" value={form.name} onChange={e => set("name", e.target.value)} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </Field>
          </div>

          <Field label="Categoría" required>
            <select className={selectCls} value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
              <option value="">Seleccionar…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </Field>

          <Field label="Condición" required>
            <select className={selectCls} value={form.physicalState} onChange={e => set("physicalState", e.target.value)}>
              {["Nuevo", "Como nuevo", "Excelente", "Bueno", "Buen estado", "Aceptable", "Usado"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Precio (USD)" required>
            <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" value={form.price} onChange={e => set("price", e.target.value)} />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </Field>

          <Field label="Proveedor" required>
            <select className={selectCls} value={form.ownerId} onChange={e => set("ownerId", e.target.value)}>
              <option value="">Seleccionar…</option>
              {owners.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.ownerId && <p className="text-xs text-red-500 mt-1">{errors.ownerId}</p>}
          </Field>

          <div className="col-span-2">
            <Field label="Descripción">
              <textarea rows={3} className={inputCls} placeholder="Describe el producto brevemente…" value={form.description} onChange={e => set("description", e.target.value)} />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="Imagen del producto">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className={inputCls}
                onChange={handleImageChange}
              />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{editMode ? "Guardar cambios" : "Crear Producto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}