import React, { useState } from 'react';
import { CheckCircle, Shield, X } from 'lucide-react';

export function Toast({ message, onClose, variant = "dark" }: { message: string; onClose: () => void; variant?: "dark" | "success" | "danger" }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const cls = variant === "success" ? "bg-green-600" : variant === "danger" ? "bg-red-600" : "bg-slate-900";
  const icon = variant === "success" ? <CheckCircle size={16} className="flex-shrink-0" /> : <Shield size={16} className="text-yellow-400 flex-shrink-0" />;
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100]">
      <div className={`flex items-center gap-3 ${cls} text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl border border-white/10 max-w-sm`}>
        {icon}
        <span>{message}</span>
        <button type="button" onClick={onClose} className="ml-2 text-white/50 hover:text-white cursor-pointer"><X size={14} /></button>
      </div>
    </div>
  );
}