import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Product, ProductForm } from '../../Types';
import { ALL_PRODUCTS } from '../../Data/products';
import { Toast } from '../Common/Toast';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { NuevoProductoModal } from './NuevoProductoModal';
import { createProduct, getProducts } from '../../services/productService';
import { ProductResponse } from '../../interfaces/IProduct';

export function ProductosPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; data?: ProductForm & { id?: number } } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductResponse | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.categoryName?.toLowerCase().includes(search.toLowerCase()) || p.physicalState?.toLowerCase().includes(search.toLowerCase()));


  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = (form: ProductForm, id?: number) => {
    if (id !== undefined) {

      showToast(`Producto "${form.name}" actualizado exitosamente`);
    } else {
      const newP: Product = {
        name: form.name, categoryId: 7,
        physicalState: form.physicalState, price: Number(form.price), OwnerId: Number(form.OwnerId),
        description: form.description,
      };

      createProduct(newP).then(created => {
        fetchProducts();
        showToast(`Producto "${form.name}" creado exitosamente`);
      });
    }
  };

  const fetchProducts = () => {
    getProducts()
      .then(data => setProducts(data.filter(p => p.stock > 0)))
      .catch(() => showToast("Error al cargar los productos", "danger"));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
    showToast("Registro eliminado satisfactoriamente", "danger");
    setDeleteTarget(null);
  };

  const toForm = (product: Product): ProductForm => ({
    name: product.name, categoryId: product.categoryId, price: String(product.price), physicalState: product.physicalState, OwnerId: product.OwnerId,
    description: product.description, Owner: product.Owner
  });

  return (
    <div className="p-6 overflow-auto h-full relative">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && <NuevoProductoModal onClose={() => setModal(null)} onSave={handleSave} initialData={modal.data} editMode={modal.mode === "edit"} />}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Eliminar producto?"
          message={`¿Estás seguro de que deseas eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Sí, eliminar"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Inventario de Productos</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestiona las publicaciones activas — {products.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-36 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Condición</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{product.categoryName}</td>
                <td className="px-4 py-3 font-bold text-gray-900">${product.price}</td>
                <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                <td className="px-4 py-3"><StatusBadge status={product.physicalState} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setModal({ mode: "edit", data: toForm(product) })} className="product-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 size={13} className="text-blue-500" /></button>
                    <button type="button" onClick={() => setDeleteTarget(product)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            {search ? `No se encontraron productos para "${search}".` : "No hay productos. ¡Crea el primero!"}
          </div>
        )}
      </div>
    </div>
  );
}