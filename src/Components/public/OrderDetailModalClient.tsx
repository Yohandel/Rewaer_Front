import React, { useEffect, useState } from 'react';
import { Order, OrderDetailItem } from '../../Types';
import { getOrderDetails } from '../../services/orderService';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';

export function OrderDetailModalClient({ order, onClose }: { order: Order; onClose: () => void }) {
  const [items, setItems] = useState<OrderDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderDetails(order.pedidoId)
      .then(setItems)
      .catch(err => setError(err.message || "No se pudo cargar el detalle"))
      .finally(() => setLoading(false));
  }, [order.pedidoId]);

  return (
    <Modal title={`Pedido #${order.pedidoId}`} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-xs text-slate-400">{String(order.fecha).slice(0, 10)}</p>
          <StatusBadge status={order.estado} />
        </div>
        <span className="font-bold text-slate-900 text-lg">${Number(order.total).toFixed(2)}</span>
      </div>

      {loading && <p className="text-center text-sm text-slate-400 py-6">Cargando detalle…</p>}
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}

      {!loading && !error && (
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-2.5">Artículo</th>
                <th className="px-4 py-2.5">Cant.</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-slate-800">{it.articulo}</td>
                  <td className="px-4 py-2.5 text-slate-600">{it.cantidad}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-900">${Number(it.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-center text-sm text-slate-400 py-6">Sin artículos.</p>}
        </div>
      )}
    </Modal>
  );
}