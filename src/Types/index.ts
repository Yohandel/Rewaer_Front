import { ProductResponse } from "../interfaces/IProduct";

export type Page =
  | "productos" | "ventas" | "usuarios" | "dashboard" | "categorias" | "configuracion"
  | "empleados" | "propietarios"| "tienda" | "registro" | "login" | "catalogo" | "ofertas" 
  | "contacto"| "detalle" | "carrito";

export type Product = {
  name: string;
  categoryId: number;
  physicalState: string;
  price: number;
  Owner?: string;
  OwnerId: number;
  description: string;
};

export type CartItem = { product: ProductResponse; qty: number; cartDetailId?: number };

export type ProductForm = {
  name: string; description: string; price: string; physicalState: string;
  categoryId: number; OwnerId: number; Owner?: string;
};

export type CatForm = { name: string; description: string };

export type UserRow = { id: string; name: string; email: string; role: string; status: string };
export type UserForm = { name: string; email: string; role: string; status: string };

export type CategoryResponse = { id: string; name: string; description: string; estado: boolean };

export type LoginMode = "client" | "employee";

export type AuthUser = {
  id: number | string;
  nombre: string;
  email: string;
  role: "admin" | "client";
  token: string;
  raw: any;
};

// ── Artículos (backend) ──
export type Article = {
  id: number;
  name: string;
  description: string;
  price: number;
  physicalState: string;
  categoryId: number;
  categoryName: string;
  stock: number;
  owner: string;
  ownerId: number;
};

export type ArticleDto = {
  name: string;
  description: string;
  price: number;
  physicalState: string;
  categoryId: number;
  ownerId: number;
};

// ── Carrito (backend) ──
export type CartItemApi = {
  cartDetailId: number;
  articleId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type AddCartItemPayload = { CartId: number; ArticleId: number; Quantity: number };
export type UpdateCartItemPayload = { cartDetailId: number; quantity: number };
// ── Empleados ──
export type Employee = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  estado: string;   // estado_laboral
  rolId?: number;
};

export type EmployeeCreateDto = {
  nombre: string; apellido: string; email: string; telefono: string;
  contrasena: string; fecha_ingreso: string; estado_laboral: string;
  id_rol: number; direccion: string;
};

export type EmployeeUpdateDto = {
  nombre: string; apellido: string; email: string; telefono: string;
  direccion: string; id_rol: number;
};

// ── Propietarios ──
export type Owner = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  comision: number;
  direccion?: string;
  estado: string;
};

export type OwnerCreateDto = {
  nombre: string; apellido: string; email: string; telefono: string;
  porcentaje_comision: number; direccion: string; estado: string;
};

export type OwnerUpdateDto = {
  nombre: string; apellido: string; email: string; telefono: string;
  porcentaje_comision: number; direccion: string;
};

// ── Clientes (solo lectura) ──
export type ClientApi = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  estado: string;
};

// ── Pedidos / Ventas ──
export type Order = {
  idPedido: number;
  idCliente: number;
  fecha: string;
  total: number;
  cliente: string;
  estado: string;
};

export type OrderDetailItem = {
  articulo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};