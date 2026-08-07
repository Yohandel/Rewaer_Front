import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, Eye, XCircle } from 'lucide-react';
import { Order, Page, Product } from '../../Types';
import { cancelOrder, getMyOrders } from '../../services/orderService';
import { PublicNav } from './PublicNav';
import { StatusBadge } from '../Common/StatusBadge';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { OrderDetailModalClient } from './OrderDetailModalClient';
import { ProductResponse } from '../../interfaces/IProduct';
import { Toast } from '../Common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function MisPedidosPage({ onNavigate, userRole, onLogout, cartCount, clientId }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void; cartCount: number;
  clientId: number; onAddToCart?: (p: ProductResponse) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailTarget, setDetailTarget] = useState<Order | null>(null);
  const [confirmCancel, setconfirmCancel] = useState(false);
  const [currentPedidoId, setcurrentPedidoId] = useState(0)
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);
  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!clientId) return;
    getMyOrders(clientId)
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setOrders(sorted);
      })
      .catch(err => setError(err.message || "No se pudieron cargar tus pedidos"))
      .finally(() => setLoading(false));
  }, [clientId]);

  const { page, setPage, totalPages, pageItems } = usePagination(orders, 8);

  const cancelMyOrder = (pedidoId: number) => {
    cancelOrder(pedidoId).then(res => {
      showToast("¡Pedido creado correctamente!", "success");
    })

  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {detailTarget && <OrderDetailModalClient order={detailTarget} onClose={() => setDetailTarget(null)} />}
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {confirmCancel && (
        <ConfirmDialog
          title="¿Cancelar Orden?"
          message="¿Estás seguro de que deseas cancelar su orden? Esta acción no se puede deshacer"
          confirmLabel="Sí, cancelar"
          onConfirm={() => { cancelMyOrder(currentPedidoId); setconfirmCancel(false)}}
          onCancel={() => setconfirmCancel(false)}
        />
      )}
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="mis-pedidos" cartCount={cartCount} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => onNavigate("tienda")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-slate-500">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Mis pedidos</h1>
          {orders.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{orders.length}</span>}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

        {loading ? (
          <p className="text-center text-slate-400 py-16">Cargando pedidos…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <Package className="w-9 h-9 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-1">Aún no tienes pedidos</h2>
            <p className="text-slate-400 text-sm mb-6">Cuando compres algo, aparecerá aquí.</p>
            <button type="button" onClick={() => onNavigate("catalogo")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
              Ver catálogo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Pedido</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pageItems.map(order => (
                  <tr key={order.pedidoId} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-xs">#{order.pedidoId}</td>
                    <td className="px-6 py-3 text-xs">{String(order.fecha).slice(0, 10)}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">${Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-3"><StatusBadge status={order.estado} /></td>
                    <td className="px-6 py-3 text-right">
                      <button type="button" onClick={() => setDetailTarget(order)}
                        className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer inline-flex"><Eye size={14} className="text-blue-500" /></button>
                      {(order.estado !== "Facturado" && order.estado !== "Entregado") && (
                        <button type="button" onClick={() => { setconfirmCancel(true); setcurrentPedidoId(order.pedidoId) }} title="Cancelar"
                          className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><XCircle size={14} className="text-red-500" /></button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}