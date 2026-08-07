import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { ClientApi, Page, Product } from '../../Types';
import { getCliente } from '../../services/clientService';
import { PublicNav } from './PublicNav';
import { StatusBadge } from '../Common/StatusBadge';
import { ProductResponse } from '../../interfaces/IProduct';

export function MiPerfilPage({ onNavigate, userRole, onLogout, cartCount, clientId }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void; cartCount: number;
  clientId: number; onAddToCart?: (p: ProductResponse) => void;
}) {
  const [cliente, setCliente] = useState<ClientApi | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    getCliente(clientId)
      .then(setCliente)
      .catch(err => setError(err.message || "No se pudo cargar tu perfil"))
      .finally(() => setLoading(false));
  }, [clientId]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="mi-perfil" cartCount={cartCount} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => onNavigate("tienda")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-slate-500">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

        {loading ? (
          <p className="text-center text-slate-400 py-16">Cargando perfil…</p>
        ) : cliente ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {cliente.nombre[0]}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{cliente.nombre} {cliente.apellido}</h2>
                <StatusBadge status={cliente.estado} />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Mail size={16} className="text-blue-600" /></div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">Correo electrónico</p>
                  <p className="text-sm font-semibold text-slate-800">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0"><Phone size={16} className="text-green-600" /></div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">Teléfono</p>
                  <p className="text-sm font-semibold text-slate-800">{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin size={16} className="text-purple-600" /></div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">Dirección</p>
                  <p className="text-sm font-semibold text-slate-800">{cliente.direccion}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0"><Calendar size={16} className="text-orange-600" /></div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">Cliente desde</p>
                  <p className="text-sm font-semibold text-slate-800">{String(cliente.fecha_registro).slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && <p className="text-center text-slate-400 py-16">No se encontró información del perfil.</p>
        )}
      </div>
    </div>
  );
}