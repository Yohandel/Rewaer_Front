import React, { useEffect, useState } from 'react';
import { FileCheck, Truck, XCircle, Eye } from 'lucide-react';
import { Order } from '../../Types';
import { getOrders, cancelOrder, invoiceOrder, deliverOrder } from '../../services/orderService';
import { Toast } from '../Common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { OrderDetailsModal } from './OrderDetailsModal';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../Common/Pagination';

const STATUS_FILTERS = ["Todos", "Pendiente", "Facturado", "Entregado", "Cancelado"];

export function VentasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [detailTarget, setDetailTarget] = useState<Order | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ order: Order; type: "cancel" | "invoice" | "deliver" } | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = (status: string) => {
    setLoading(true);
    getOrders(status === "Todos" ? undefined : status)
      .then(setOrders)
      .catch(err => setLoadError(err.message || "No se pudieron cargar las ventas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(activeFilter); }, [activeFilter]);

  const runAction = async () => {
    if (!confirmAction) return;
    const { order, type } = confirmAction;
    try {
      if (type === "cancel") { await cancelOrder(order.pedidoId); showToast(`Pedido #${order.pedidoId} cancelado`, "danger"); }
      if (type === "invoice") { await invoiceOrder(order.pedidoId); showToast(`Pedido #${order.pedidoId} facturado`); }
      if (type === "deliver") { await deliverOrder(order.pedidoId); showToast(`Pedido #${order.pedidoId} entregado`); }
      setConfirmAction(null);
      load(activeFilter);
    } catch (err: any) {
      showToast(err.message || "No se pudo completar la acción", "danger");
      setConfirmAction(null);
    }
  };

  const confirmCopy: Record<string, { title: string; message: string; label: string; danger?: boolean }> = {
    cancel: { title: "¿Cancelar pedido?", message: "Esta acción cancelará el pedido seleccionado.", label: "Sí, cancelar", danger: true },
    invoice: { title: "¿Facturar pedido?", message: "Se marcará el pedido como facturado.", label: "Sí, facturar" },
    deliver: { title: "¿Marcar como entregado?", message: "Se marcará el pedido como entregado.", label: "Sí, entregar" },
  };

  const { page, setPage, totalPages, pageItems } = usePagination(orders, 6);

  return (
    <div className="flex flex-col h-full">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {detailTarget && <OrderDetailsModal order={detailTarget} onClose={() => setDetailTarget(null)} />}
      {confirmAction && (
        <ConfirmDialog
          title={confirmCopy[confirmAction.type].title}
          message={confirmCopy[confirmAction.type].message}
          confirmLabel={confirmCopy[confirmAction.type].label}
          danger={confirmCopy[confirmAction.type].danger}
          onConfirm={runAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div><h1 className="text-lg font-bold text-gray-800">Ventas</h1><p className="text-xs text-gray-500 mt-0.5">Historial de pedidos</p></div>
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${activeFilter === f ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {orders.map(o => (
                <tr key={o.pedidoId} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs">#{o.pedidoId}</td>
                  <td className="px-6 py-3 text-xs">{String(o.fecha).slice(0, 10)}</td>
                  <td className="px-6 py-3 font-semibold">{o.cliente}</td>
                  <td className="px-6 py-3 font-bold">${Number(o.total).toFixed(2)}</td>
                  <td className="px-6 py-3"><StatusBadge status={o.estado} /></td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => setDetailTarget(o)} title="Ver detalle"
                        className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={14} className="text-gray-500" /></button>
                      {(o.estado !== "Cancelado" && o.estado !== "Entregado" && o.estado !== "Facturado") && (
                        <button type="button" onClick={() => setConfirmAction({ order: o, type: "invoice" })} title="Facturar"
                          className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><FileCheck size={14} className="text-blue-500" /></button>
                      )}
                      {o.estado === "Facturado" && (
                        <button type="button" onClick={() => setConfirmAction({ order: o, type: "deliver" })} title="Marcar entregado"
                          className="p-1.5 hover:bg-green-50 rounded-lg cursor-pointer"><Truck size={14} className="text-green-600" /></button>
                      )}
                      {(o.estado !== "Cancelado" && o.estado !== "Facturado" && o.estado !== "Entregado") && (
                        <button type="button" onClick={() => setConfirmAction({ order: o, type: "cancel" })} title="Cancelar"
                          className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><XCircle size={14} className="text-red-500" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay pedidos para este filtro.</div>}
          {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}