import React, { useState } from 'react';
import { Store, ChevronRight, Shield, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { LoginMode, Page } from '../../Types';
import { employeeLogin, clientLogin } from '../../services/authService';

export function LoginScreen({ onNavigate, onLoginSuccess }: {
  onNavigate: (p: Page) => void;
  onLoginSuccess: (mode: LoginMode, data: any) => void;
}) {
  const [mode, setMode] = useState<LoginMode>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const payload = { email, contrasena: password };
      const data = mode === "employee" ? await employeeLogin(payload) : await clientLogin(payload);
      onLoginSuccess(mode, data);
    } catch (err: any) {
      console.error("Login error:", err.message);
      setLoginError("Credenciales incorrectas. Verifica tu correo y contraseña (O si estas en el modo correcto).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white w-full h-full relative">
      <button type="button" onClick={() => onNavigate("tienda")} className="absolute top-6 right-6 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline z-50 cursor-pointer">
        Volver a la Tienda <ChevronRight size={16} />
      </button>
      <div className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop" alt="ReWear" className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-75" />
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <h1 className="text-5xl font-bold mb-3 leading-tight">Conecta, compra y vende</h1>
          <p className="text-base text-slate-300/90">Accede a tu cuenta para gestionar tus publicaciones o descubrir las mejores ofertas.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-blue-600/20">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">ReWear</h1>
            <p className="text-sm text-gray-500 mt-1">Accede a tu panel o a tu cuenta</p>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
            <button type="button" onClick={() => { setMode("client"); setLoginError(""); }}
              className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors cursor-pointer ${mode === "client" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
              Cliente
            </button>
            <button type="button" onClick={() => { setMode("employee"); setLoginError(""); }}
              className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors cursor-pointer ${mode === "employee" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
              Empleado
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" /><span>{loginError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={mode === "employee" ? "carlos@rewear.com" : "cliente@correo.com"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">Contraseña</label>
              </div>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-slate-900" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-7 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-5 text-center text-xs text-gray-500">
            ¿No tienes cuenta?{" "}
            <button type="button" onClick={() => onNavigate("registro")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Regístrate</button>
          </div>
        </div>
      </div>
    </div>
  );
}