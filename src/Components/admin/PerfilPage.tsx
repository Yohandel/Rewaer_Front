import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { AuthUser, Employee } from '../../Types';
import { getEmployee, changeEmployeePassword } from '../../services/employeeService';
import { StatusBadge } from '../common/StatusBadge';
import { ChangePasswordForm } from '../Common/ChangePasswordForm';

export function PerfilPage({ authUser }: { authUser: AuthUser }) {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getEmployee(Number(authUser.id))
            .then(setEmployee)
            .catch(err => setError(err.message || "No se pudo cargar tu información"))
            .finally(() => setLoading(false));
    }, [authUser.id]);

    return (
        <div className="p-6 overflow-auto h-full">
            <h1 className="text-lg font-bold text-gray-800 mb-1">Mi perfil</h1>
            <p className="text-xs text-gray-500 mb-6">Información de tu cuenta y seguridad</p>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{error}</div>}

            {loading ? (
                <p className="text-sm text-gray-400">Cargando…</p>
            ) : employee ? (
                <div className=" w-full flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-xl space-y-5">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-[#1a1a2e] px-6 py-8 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                    {employee.nombre[0]}
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">{employee.nombre} {employee.apellido}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <StatusBadge status={employee.estado} />
                                        {authUser.roleName && <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-semibold">{authUser.roleName}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Mail size={16} className="text-blue-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Correo electrónico</p>
                                        <p className="text-sm font-semibold text-gray-800">{employee.email}</p>
                                    </div>
                                </div>
                                {employee.telefono && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0"><Phone size={16} className="text-green-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Teléfono</p>
                                            <p className="text-sm font-semibold text-gray-800">{employee.telefono}</p>
                                        </div>
                                    </div>
                                )}
                                {employee.direccion && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin size={16} className="text-purple-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Dirección</p>
                                            <p className="text-sm font-semibold text-gray-800">{employee.direccion}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield size={16} className="text-gray-500" />
                                <h3 className="text-sm font-bold text-gray-800">Seguridad</h3>
                            </div>
                            <ChangePasswordForm onSubmit={(newPassword) => changeEmployeePassword(employee.id, newPassword).then(() => { })} />
                        </div>
                    </div>
                </div>
            ) : (
                !error && <p className="text-sm text-gray-400">No se encontró información.</p>
            )}
        </div>
    );
}