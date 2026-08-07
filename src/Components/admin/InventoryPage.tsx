import React, { useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { InventoryDto, Product } from '../../Types';
import { getInventory, addInventory, updateInventory, InventoryItem } from '../../services/inventoryService';
import { getProducts } from '../../services/productService';
import { Toast } from '../common/Toast';
import { InventoryModal } from './InventoryModal';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { ProductResponse } from '../../interfaces/IProduct';

export function InventoryPage() {
  const [rows, setRows] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; target?: InventoryItem } | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    Promise.all([getInventory(), getProducts().catch(() => [])])
      .then(([inv, prods]) => { setRows(inv); setProducts(prods); })
      .catch(err => setLoadError(err.message || "No se pudo cargar el inventario"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const { page, setPage, totalPages, pageItems } = usePagination(rows, 8);
  const productName = (id: number) => products.find(p => p.id === id)?.name ?? `Artículo #${id}`;

  const handleSave = async (dto: InventoryDto, id?: number) => {
    if (id !== undefined) {
      await updateInventory(id, dto);
      showToast("Registro actualizado exitosamente");
    } else {
      await addInventory(dto);
      showToast("Stock agregado exitosamente");
    }
    load();
  };

  return (
    <div className="p-6 overflow-auto h-full relative">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && (
        <InventoryModal
          onClose={() => setModal(null)}
          onSave={handleSave}
          products={products}
          initialData={modal.target}
          editMode={modal.mode === "edit"}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Inventario</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestiona el stock por ubicación — {rows.length} registros</p>
        </div>
        <button type="button" onClick={() => setModal({ mode: "create" })}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
          <Plus size={15} />Agregar Stock
        </button>
      </div>

      {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Artículo</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Ubicación</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {pageItems.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold text-gray-900">{productName(row.articuloId)}</td>
                <td className="px-6 py-3 font-bold">{row.cantidad}</td>
                <td className="px-6 py-3 text-xs text-gray-500">{row.ubicacion || "—"}</td>
                <td className="px-6 py-3 text-right">
                  <button type="button" onClick={() => setModal({ mode: "edit", target: row })} className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer">
                    <Edit2 size={13} className="text-blue-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay movimientos de inventario.</div>}
        {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}