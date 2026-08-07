// Convención de nombres: deben crearse EXACTAMENTE así en la pantalla de Permisos
// y asignarse al empleado en Configuración para que el acceso se habilite.
export const PERMISSION_KEYS = {
  PROPIETARIOS: 'gestionar_propietarios',
  CATEGORIAS: 'gestionar_categorias',
  ROLES: 'gestionar_roles',
  INVENTARIO: 'gestionar_inventario',
  PERMISOS: 'gestionar_permisos',
} as const;

export function hasPermission(permissions: string[], key: string): boolean {
  return permissions.includes(key);
}