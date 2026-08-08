import React, { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { inputCls } from '../../styles/formStyles';

export function ChangePasswordForm({ onSubmit }: { onSubmit: (newPassword: string) => Promise<void> }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (newPassword.length < 4) { setError("La contraseña debe tener al menos 4 caracteres"); return; }
    if (newPassword !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }

    setSubmitting(true);
    try {
      await onSubmit(newPassword);
      setSuccess(true);
      setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "No se pudo cambiar la contraseña");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}
      {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-2.5">Contraseña actualizada correctamente.</p>}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nueva contraseña</label>
        <input type="password" className={inputCls} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
        <input type="password" className={inputCls} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
      </div>

      <button type="submit" disabled={submitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2">
        {submitting ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
        {submitting ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}