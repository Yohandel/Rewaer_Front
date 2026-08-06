import React, { useState } from 'react';
import { ShoppingBag, Loader2, Shield } from 'lucide-react';
import { Page } from '../../Types';
import { registerClient, RegisterClientPayload } from '../../services/clientService';

type FormState = {
  nombre: string; apellido: string; email: string; telefono: string; direccion: string; contrasena: string;
};
const EMPTY: FormState = { nombre: "", apellido: "", email: "", telefono: "", direccion: "", contrasena: "" };

export function RegistroScreen({ onNavigate, onCompleteRegister }: {
  onNavigate: (p: Page) => void;
  onCompleteRegister: (client: any) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.nombre.trim())     e.nombre     = "Campo requerido";
    if (!form.apellido.trim())   e.apellido   = "Campo requerido";
    if (!form.email.trim())      e.email      = "Campo requerido";
    if (!form.telefono.trim())   e.telefono   = "Campo requerido";
    if (!form.direccion.trim())  e.direccion  = "Campo requerido";
    if (!form.contrasena.trim() || form.contrasena.length < 4) e.contrasena = "Mínimo 4 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    const payload: RegisterClientPayload = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono,
      direccion: form.direccion,
      contrasena: form.contrasena,
      fecha_registro: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      estado: "Activo",
    };

    setLoading(true);
    try {
      const client = await registerClient(payload);
      onCompleteRegister(client);
    } catch (err: any) {
      setApiError(err.message || "No se pudo completar el registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-slate-200 my-8">
        <div className="text-center mb-6">
          <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Crea tu cuenta gratis</h2>
          <p className="text-sm text-slate-500 mt-1">Regístrate para reservar y comprar artículos.</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-start gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" /><span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input value={form.nombre} onChange={e => set("nombre", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="Yohandel" />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input value={form.apellido} onChange={e => set("apellido", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="Cuevas" />
              {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="tu-correo@gmail.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input value={form.telefono} onChange={e => set("telefono", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="809-965-2234" />
            {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input value={form.direccion} onChange={e => set("direccion", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="Tu dirección" />
            {errors.direccion && <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input type="password" value={form.contrasena} onChange={e => set("contrasena", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none text-slate-900" placeholder="••••••••" />
            {errors.contrasena && <p className="text-xs text-red-500 mt-1">{errors.contrasena}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2 cursor-pointer flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creando cuenta..." : "Completar Registro"}
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            ¿Ya tienes cuenta?{" "}
            <button type="button" onClick={() => onNavigate("login")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Inicia Sesión</button>
          </p>
        </form>
      </div>
    </div>
  );
}