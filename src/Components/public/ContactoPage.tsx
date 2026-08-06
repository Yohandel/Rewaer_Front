import React from 'react';
import { ShoppingBag, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { Page, Product } from '../../Types';
import { PublicNav } from './PublicNav';
import { ProductResponse } from '../../interfaces/IProduct';

export function ContactoPage({ onNavigate, userRole, onLogout, cartCount }: {
  onNavigate: (p: Page) => void; userRole: string | null; onLogout: () => void; cartCount: number; onAddToCart?: (p: ProductResponse) => void;
}) {
  const schedules = [
    { day: "Lunes – Viernes", hours: "8:00 AM – 10:00 PM" },
    { day: "Sábado",          hours: "9:00 AM – 9:00 PM" },
    { day: "Domingo",         hours: "9:00 AM – 2:00 PM" },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNav onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} currentPage="contacto" cartCount={cartCount} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contáctanos</h1>
          <p className="text-slate-500 text-sm">Estamos aquí para ayudarte. Escríbenos o visítanos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">ReWear</h2>
                <p className="text-xs text-slate-500">Tienda de segunda mano</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              ReWear es tu destino de confianza para comprar y vender artículos de segunda mano en República Dominicana.
              Conectamos compradores y vendedores con artículos de calidad a precios accesibles, promoviendo el consumo responsable y la economía circular.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Teléfonos</p>
                  <p className="text-sm font-semibold text-slate-800">+1 (809) 555-0182</p>
                  <p className="text-sm font-semibold text-slate-800">+1 (829) 555-0247</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Correo electrónico</p>
                  <a href="mailto:reweardr@gmail.com" className="text-sm font-semibold text-blue-600 hover:underline">reweardr@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Ubicación</p>
                  <p className="text-sm font-semibold text-slate-800">Santo Domingo, República Dominicana</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg">Horarios de atención</h2>
            </div>
            <div className="space-y-3">
              {schedules.map((s, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? "bg-blue-50 border border-blue-100" : "bg-slate-50 border border-slate-100"}`}>
                  <span className={`text-sm font-medium ${i === 0 ? "text-blue-800" : "text-slate-700"}`}>{s.day}</span>
                  <span className={`text-sm font-bold ${i === 0 ? "text-blue-600" : "text-slate-900"}`}>{s.hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
                Atendiendo ahora mismo
              </p>
              <p className="text-xs text-green-600 mt-1">Respondemos en menos de 24 horas por correo.</p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">Síguenos en redes</p>
              <div className="flex gap-3">
                <button type="button" className="flex items-center gap-2 text-xs text-slate-600 hover:text-pink-600 bg-slate-50 hover:bg-pink-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  <Instagram size={14} />Instagram
                </button>
                <button type="button" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  <Facebook size={14} />Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}