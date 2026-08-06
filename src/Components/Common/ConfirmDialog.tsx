import React from 'react';
import { Trash2, LogOut } from 'lucide-react';

export function ConfirmDialog({ title, message, confirmLabel = "Sí, confirmar", danger = false, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-100" : "bg-yellow-100"}`}>
          {danger ? <Trash2 size={26} className="text-red-500" /> : <LogOut size={26} className="text-yellow-600" />}
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
            No, cancelar
          </button>
          <button type="button" onClick={onConfirm}
            className={`flex-1 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}