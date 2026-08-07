import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-gray-600">
        <ChevronLeft size={13} />Anterior
      </button>
      <span className="text-xs text-gray-500">Página {page} de {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-gray-600">
        Siguiente<ChevronRight size={13} />
      </button>
    </div>
  );
}