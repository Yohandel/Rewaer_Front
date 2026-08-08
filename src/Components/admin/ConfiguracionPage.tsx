import React, { useEffect, useState } from 'react';
import { Settings, Search, Shield } from 'lucide-react';
import { Employee, Role, Permission, EmployeePermissionItem, UpdateEmployeeRoleDto } from '../../Types';
import { getEmployees, getEmployee, updateEmployee, deactivateEmployee, updateEmployeeRole, changeEmployeePassword } from '../../services/employeeService';
import { getRoles } from '../../services/roleService';
import { getPermissions, getEmployeePermissions, assignPermission, removePermission } from '../../services/permissionService';
import { Toast } from '../common/Toast';
import { ChangePasswordForm } from '../Common/ChangePasswordForm';

export function ConfiguracionPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Employee | null>(null);
  const [empPermissions, setEmpPermissions] = useState<EmployeePermissionItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [permLoading, setPermLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const loadEmployees = () => getEmployees().then(setEmployees);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEmployees(), getRoles().then(setRoles), getPermissions().then(setAllPermissions)])
      .catch(err => showToast(err.message || "Error al cargar configuración", "danger"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedId === null) { setSelectedDetail(null); return; }
    getEmployee(selectedId).then(setSelectedDetail).catch(() => { });
    setPermLoading(true);
    getEmployeePermissions(selectedId)
      .then(setEmpPermissions)
      .catch(() => setEmpPermissions([]))
      .finally(() => setPermLoading(false));
  }, [selectedId]);

  const filteredEmployees = employees.filter(employee => `${employee.nombre} ${employee.apellido}`.toLowerCase().includes(search.toLowerCase()));
  const roleName = (id?: number) => roles.find(r => r.id === id)?.nombre ?? "—";

  const changeRole = async (idRol: number) => {
    if (!selectedDetail) return;
    try {
      const data: UpdateEmployeeRoleDto = {
        RoleId: idRol
      }
      await updateEmployeeRole(selectedId, data);
      setSelectedDetail({ ...selectedDetail, rolId: idRol });
      loadEmployees();
      showToast("Rol actualizado exitosamente");
    } catch (err: any) {
      showToast(err.message || "No se pudo actualizar el rol", "danger");
    }
  };

  const toggleStatus = async () => {
    if (!selectedDetail) return;
    if (selectedDetail.estado === "Inactivo") {
      showToast("La API aún no permite reactivar empleados", "danger");
      return;
    }
    try {
      await deactivateEmployee(selectedDetail.id);
      setSelectedDetail({ ...selectedDetail, estado: "Inactivo" });
      loadEmployees();
      showToast("Empleado desactivado exitosamente", "danger");
    } catch (err: any) {
      showToast(err.message || "No se pudo desactivar el empleado", "danger");
    }
  };

  const togglePermission = async (permId: number, active: boolean) => {
    if (!selectedDetail) return;
    try {
      if (active) {
        await removePermission({ id_empleado: selectedDetail.id, id_permiso: permId }).then(res => {
          showToast("Permiso Removido", "success");
        });
        setEmpPermissions(prev => prev.filter(p => p.idPermiso !== permId));
      } else {
        await assignPermission({ id_empleado: selectedDetail.id, id_permiso: permId }).then(res => {
          showToast("Permiso Asignado", "success");
        });
        const perm = allPermissions.find(p => p.id === permId);
        if (perm) setEmpPermissions(prev => [...prev, { idPermiso: perm.id, nombre: perm.nombre, descripcion: perm.descripcion }]);
      }
    } catch (err: any) {
      showToast(err.message || "No se pudo actualizar el permiso", "danger");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800">Configuración</h1>
        <p className="text-xs text-gray-500 mt-0.5">Administra roles, permisos y estado de los empleados</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Empleados ({employees.length})</p>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2.5 py-1.5">
              <Search size={12} className="text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs outline-none w-full text-gray-800" placeholder="Buscar…" />
            </div>
          </div>
          <div className="flex-1 overflow-auto divide-y divide-gray-100">
            {loading && <p className="text-center text-xs text-gray-400 py-6">Cargando…</p>}
            {filteredEmployees.map(employee => (
              <button key={employee.id} type="button" onClick={() => setSelectedId(employee.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${selectedId === employee.id ? "bg-blue-50 border-l-2 border-blue-600" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${selectedId === employee.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    {employee.nombre[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{employee.nombre} {employee.apellido}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">{roleName(employee.rolId)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${employee.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{employee.estado}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {!selectedDetail ? (
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
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">{selectedDetail.nombre[0]}</div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-base">{selectedDetail.nombre} {selectedDetail.apellido}</h2>
                    <p className="text-xs text-gray-500">{selectedDetail.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Rol</label>
                    <select value={selectedDetail.rolId ?? ""} onChange={employee => changeRole(Number(employee.target.value))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Estado</label>
                    <button type="button" onClick={toggleStatus}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-colors cursor-pointer ${selectedDetail.estado === "Activo" ? "border-green-500 text-green-600 hover:bg-green-50" : "border-gray-300 text-gray-500"}`}>
                      <span className={`w-2 h-2 rounded-full ${selectedDetail.estado === "Activo" ? "bg-green-500" : "bg-gray-400"}`} />
                      {selectedDetail.estado}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Permisos de acceso</h3>
                {permLoading && <p className="text-xs text-gray-400 mb-2">Cargando permisos…</p>}
                <div className="space-y-3">
                  {allPermissions.map(perm => {
                    const active = empPermissions.some(p => p.idPermiso === perm.id);
                    return (
                      <div key={perm.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{perm.nombre}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{perm.descripcion}</p>
                        </div>
                        <div className="relative flex-shrink-0 ml-4 cursor-pointer" onClick={() => togglePermission(perm.id, active)}>
                          <div className={`w-10 h-6 rounded-full transition-colors ${active ? "bg-blue-600" : "bg-gray-200"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${active ? "translate-x-5" : "translate-x-1"}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {allPermissions.length === 0 && <p className="text-xs text-gray-400">No hay permisos configurados.</p>}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={16} className="text-gray-500" />
                  <h3 className="text-sm font-bold text-gray-800">Cambiar contraseña</h3>
                </div>
                <ChangePasswordForm onSubmit={(newPassword) => changeEmployeePassword(selectedDetail.id, newPassword).then(() => { })} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}