import { CatRow, UserRow } from "../Types";

export const ADMIN_CATEGORIES: CatRow[] = [
  { id: "CAT-001", name: "Electrónicos",     date: "2026-07-01" },
  { id: "CAT-002", name: "Ropa y Accesorios",date: "2026-07-02" },
  { id: "CAT-003", name: "Muebles",          date: "2026-07-03" },
  { id: "CAT-004", name: "Hogar",            date: "2026-07-05" },
  { id: "CAT-005", name: "Deportes",         date: "2026-07-08" },
];

export const MOCK_USERS: UserRow[] = [
  { id: "USR-001", name: "María García",  email: "maria@gmail.com",  role: "Vendedor", status: "Activo" },
  { id: "USR-002", name: "Carlos López",  email: "carlos@gmail.com", role: "Admin",    status: "Activo" },
  { id: "USR-003", name: "Ana Martínez",  email: "ana@gmail.com",    role: "Vendedor", status: "Inactivo" },
];

export const MOCK_SALES = [
  { date: "2026-07-05", product: "Laptop Lenovo",     buyer: "María García",  price: "$450.00", status: "Completada" },
  { date: "2026-07-04", product: "Mesa de Madera",    buyer: "Carlos López",  price: "$85.00",  status: "Pendiente" },
  { date: "2026-07-03", product: "Cámara Canon",      buyer: "Ana Martínez",  price: "$320.00", status: "Completada" },
];

export const EMPLOYEES = [
  { id: "EMP-001", name: "María García",   email: "maria@rewear.com",   role: "Vendedor", permissions: ["ver_productos", "ver_ventas"],                        status: "Activo" },
  { id: "EMP-002", name: "Carlos López",   email: "carlos@rewear.com",  role: "Admin",    permissions: ["ver_productos", "ver_ventas", "gestionar_usuarios", "gestionar_categorias"], status: "Activo" },
  { id: "EMP-003", name: "Ana Martínez",   email: "ana@rewear.com",     role: "Vendedor", permissions: ["ver_productos"],                                      status: "Inactivo" },
  { id: "EMP-004", name: "Pedro Jiménez",  email: "pedro@rewear.com",   role: "Soporte",  permissions: ["ver_productos", "ver_ventas"],                        status: "Activo" },
  { id: "EMP-005", name: "Laura Sánchez",  email: "laura@rewear.com",   role: "Admin",    permissions: ["ver_productos", "ver_ventas", "gestionar_usuarios", "gestionar_categorias"], status: "Activo" },
];

export const ALL_PERMISSIONS = [
  { key: "ver_productos",       label: "Ver Productos",        desc: "Acceso al inventario de productos" },
  { key: "ver_ventas",          label: "Ver Ventas",           desc: "Acceso al historial de ventas" },
  { key: "gestionar_usuarios",  label: "Gestionar Usuarios",   desc: "Crear, editar y eliminar usuarios" },
  { key: "gestionar_categorias",label: "Gestionar Categorías", desc: "Administrar categorías del catálogo" },
];

export const ROLES = ["Admin", "Vendedor", "Soporte"];