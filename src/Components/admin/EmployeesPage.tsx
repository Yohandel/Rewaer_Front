import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto } from '../../Types';
import { getEmployees, getEmployee, createEmployee, updateEmployee, deactivateEmployee } from '../../services/employeeService';
import { Toast } from '../common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusBadge } from '../common/StatusBadge';
import { EmployeeModal } from './EmployeeModal';
import { getRoles } from '../../services/roleService';
import { Role } from '../../Types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; data?: Employee } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  useEffect(() => { getRoles().then(setRoles).catch(() => { }); }, []);
  const filtered = employees.filter(e =>
    `${e.nombre} ${e.apellido}`.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    getEmployees()
      .then(employees => setEmployees(employees.filter(employee => employee.estado === "Activo")))
      .catch(err => setLoadError(err.message || "No se pudieron cargar los empleados"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);


  const openEdit = async (emp: Employee) => {
    try {
      const full = await getEmployee(emp.id); // el detalle trae telefono/direccion/rolId
      setModal({ mode: "edit", data: full });
    } catch {
      setModal({ mode: "edit", data: emp });
    }
  };

  const handleCreate = async (dto: EmployeeCreateDto) => {
    await createEmployee(dto);
    showToast(`Empleado "${dto.nombre}" creado exitosamente`);
    load();
  };

  const handleUpdate = async (id: number, dto: EmployeeUpdateDto) => {
    await updateEmployee(id, dto);
    showToast(`Empleado "${dto.nombre}" actualizado exitosamente`);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deactivateEmployee(deleteTarget.id);
      showToast("Empleado desactivado satisfactoriamente", "danger");
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      showToast(err.message || "No se pudo desactivar el empleado", "danger");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 overflow-auto h-full relative">
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {modal && (
        <EmployeeModal
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          initialData={modal.data}
          editMode={modal.mode === "edit"}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Desactivar empleado?"
          message={`¿Estás seguro de que deseas desactivar a "${deleteTarget.nombre} ${deleteTarget.apellido}"? Podrá reactivarse después.`}
          confirmLabel="Sí, desactivar"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Empleados</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestiona el personal — {employees.length} empleados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-40 text-gray-800" placeholder="Buscar…" />
          </div>
          <button type="button" onClick={() => setModal({ mode: "create" })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Plus size={15} />Nuevo Empleado
          </button>
        </div>
      </div>

      {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{loadError}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {pageItems.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{e.nombre} {e.apellido}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{e.email}</td>
                <td className="px-4 py-3"><span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">{e.rol}</span></td>
                <td className="px-4 py-3"><StatusBadge status={e.estado} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => openEdit(e)} className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 size={13} className="text-blue-500" /></button>
                    <button type="button" onClick={() => setDeleteTarget(e)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No hay empleados registrados.</div>}
        {loading && <div className="py-12 text-center text-gray-400 text-sm">Cargando…</div>}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}