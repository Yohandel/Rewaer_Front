import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { EMPLOYEES, ALL_PERMISSIONS, ROLES } from '../../Data/mockData';

export function ConfiguracionPage() {
  const [employees, setEmployees] = useState(EMPLOYEES.map(e => ({ ...e, permissions: [...e.permissions] })));
  const [selected, setSelected] = useState<string | null>(null);

  const emp = employees.find(e => e.id === selected);

  const togglePerm = (empId: string, perm: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== empId) return e;
      const has = e.permissions.includes(perm);
      return { ...e, permissions: has ? e.permissions.filter(p => p !== perm) : [...e.permissions, perm] };
    }));
  };

  const changeRole = (empId: string, role: string) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, role } : e));
  };

  const toggleStatus = (empId: string) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, status: e.status === "Activo" ? "Inactivo" : "Activo" } : e));
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800">Configuración</h1>
        <p className="text-xs text-gray-500 mt-0.5">Administra roles y permisos de los empleados</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Empleados ({employees.length})</p>
          </div>
          <div className="flex-1 overflow-auto divide-y divide-gray-100">
            {employees.map(e => (
              <button key={e.id} type="button" onClick={() => setSelected(e.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${selected === e.id ? "bg-blue-50 border-l-2 border-blue-600" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${selected === e.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    {e.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${e.role === "Admin" ? "bg-purple-100 text-purple-700" : e.role === "Soporte" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{e.role}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${e.status === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{e.status}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {!emp ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <Settings size={32} className="mx-auto mb-2 opacity-30" />
                Selecciona un empleado para editar sus permisos
              </div>
            </div>
          ) : (
            <div className="max-w-xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">{emp.name[0]}</div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-base">{emp.name}</h2>
                    <p className="text-xs text-gray-500">{emp.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Rol</label>
                    <select value={emp.role} onChange={e => changeRole(emp.id, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Estado</label>
                    <button type="button" onClick={() => toggleStatus(emp.id)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-colors cursor-pointer ${emp.status === "Activo" ? "border-green-500 text-green-600 hover:bg-green-50" : "border-gray-300 text-gray-500 hover:bg-gray-100"}`}>
                      <span className={`w-2 h-2 rounded-full ${emp.status === "Activo" ? "bg-green-500" : "bg-gray-400"}`} />
                      {emp.status}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Permisos de acceso</h3>
                <div className="space-y-3">
                  {ALL_PERMISSIONS.map(perm => {
                    const active = emp.permissions.includes(perm.key);
                    return (
                      <label key={perm.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{perm.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{perm.desc}</p>
                        </div>
                        <div className="relative flex-shrink-0 ml-4">
                          <input type="checkbox" className="sr-only" checked={active} onChange={() => togglePerm(emp.id, perm.key)} />
                          <div onClick={() => togglePerm(emp.id, perm.key)}
                            className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${active ? "bg-blue-600" : "bg-gray-200"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${active ? "translate-x-5" : "translate-x-1"}`} />
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}