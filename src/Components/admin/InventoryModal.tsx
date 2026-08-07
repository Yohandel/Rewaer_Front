import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { InventoryDto } from '../../Types';
import { InventoryItem } from '../../services/inventoryService';
import { Modal } from '../common/Modal';
import { Field } from '../common/Field';
import { inputCls, selectCls } from '../../styles/formStyles';
import { ProductResponse } from '../../interfaces/IProduct';

export function InventoryModal({ onClose, onSave, products, initialData, editMode = false }: {
  onClose: () => void;
  onSave: (dto: InventoryDto, id?: number) => Promise<void>;
  products: ProductResponse[];
  initialData?: InventoryItem;
  editMode?: boolean;
}) {
  const [form, setForm] = useState<InventoryDto>({
    id_articulo: initialData?.articuloId ?? products[0]?.id ?? 0,
    cantidad: initialData?.cantidad ?? 1,
    ubicacion_almacen: initialData?.ubicacion ?? "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof InventoryDto, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_articulo) { setError("Selecciona un artículo"); return; }
    if (!form.cantidad || form.cantidad <= 0) { setError("La cantidad debe ser mayor que cero"); return; }
    setSubmitting(true);
    try { await onSave(form, initialData?.id); onClose(); }
    catch (err: any) { setError(err.message || "No se pudo guardar el movimiento"); }
    finally { setSubmitting(false); }
  };

  return (
    <Modal title={editMode ? "Editar Registro de Inventario" : "Agregar Stock"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}
        <Field label="Artículo" required>
          <select className={selectCls} value={form.id_articulo} onChange={e => set("id_articulo", Number(e.target.value))} disabled={editMode}>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Cantidad" required>
          <input type="number" min="1" className={inputCls} value={form.cantidad} onChange={e => set("cantidad", Number(e.target.value))} />
        </Field>
        <Field label="Ubicación en almacén">
          <input className={inputCls} value={form.ubicacion_almacen} onChange={e => set("ubicacion_almacen", e.target.value)} placeholder="Ej: Estante A-3" />
        </Field>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Plus size={15} />{submitting ? "Guardando..." : editMode ? "Guardar cambios" : "Agregar Stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}