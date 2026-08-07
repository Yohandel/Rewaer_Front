import React, { useState, useEffect, useCallback } from 'react';
import { Page, CartItem, Product, LoginMode, AuthUser } from '../Types';
import { getMe } from '../services/authService';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../utils/authStorage';
import { getProducts } from '../services/productService';
import { addCartItem, getCart, updateCartItemQuantity, removeCartItem, checkoutCart, getCartByClient } from '../services/cartService';
import { adaptCartItem } from '../utils/adapters';

import { Sidebar } from '../Components/admin/Sidebar';
import { DashboardPage } from '../Components/admin/DashboardPage';
import { ProductosPage } from '../Components/admin/ProductosPage';
import { InventoryPage } from '../Components/admin/InventoryPage';
import { VentasPage } from '../Components/admin/VentasPage';
import { UsuariosPage } from '../Components/admin/UsuariosPage';
import { EmployeesPage } from '../Components/admin/EmployeesPage';
import { OwnersPage } from '../Components/admin/OwnersPage';
import { CategoriasPage } from '../Components/admin/CategoriasPage';
import { RolesPage } from '../Components/admin/RolesPage';
import { ConfiguracionPage } from '../Components/admin/ConfiguracionPage';
import { AccessDenied } from '../Components/Common/AccessDenied';

import { TiendaPublicaPage } from '../Components/public/TiendaPublicaPage';
import { CatalogoPage } from '../Components/public/CatalogoPage';
import { OfertasPage } from '../Components/public/OfertasPage';
import { ContactoPage } from '../Components/public/ContactoPage';
import { DetalleProductoPage } from '../Components/public/DetalleProductoPage';
import { CarritoPage } from '../Components/public/CarritoPage';

import { LoginScreen } from '../Components/auth/LoginScreen';
import { RegistroScreen } from '../Components/auth/RegistroScreen';
import { ProductResponse } from '../interfaces/IProduct';

import { getMyPermissionNames } from '../services/permissionService';
import { PermissionsPage } from '../Components/admin/PermissionsPage';
import { PERMISSION_KEYS, hasPermission } from '../utils/permissions';
import { Toast } from '../Components/Common/Toast';
import { MisPedidosPage } from '../Components/public/MisPedidosPage';
import { MiPerfilPage } from '../Components/public/MiPerfilPage';

export default function App() {
  const [currentView, setCurrentView] = useState<Page>("tienda");
  const [userRole, setUserRole] = useState<"admin" | "client" | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);

  const isAdmin = authUser?.roleName?.includes('Admin');
  const permissions = authUser?.permissions ?? [];
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (authUser?.role === "client") {
      getClientCart(authUser?.id as number);
    }
    else {
      setCartId(null);
    }
  }, [authUser]);

  useEffect(() => {
    getProducts().then(setProducts).catch(err => setProductsError(err.message || "No se pudo cargar el catálogo"));
  }, []);


  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored) { setCheckingSession(false); return; }

    setAuthUser(stored);
    setUserRole(stored.role);

    getMe()
      .then(async me => {
        let refreshed: AuthUser = { ...stored, id: me.id, nombre: me.name, email: me.email, roleName: me.role };
        if (refreshed.role === "admin") {
          try {
            const permNames = await getMyPermissionNames(Number(refreshed.id));
            refreshed = { ...refreshed, permissions: permNames };
          } catch { /* ignorar */ }
        }
        setAuthUser(refreshed);
        setStoredAuth(refreshed);
      })
      .catch(() => {
        clearStoredAuth();
        setAuthUser(null);
        setUserRole(null);
        setCurrentView("tienda");
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const refreshCart = useCallback(async (id: number) => {
    try {
      const items = await getCart(id);
      setCart(items.map(i => adaptCartItem(i, products)));
    } catch (err) {
      console.error("No se pudo cargar el carrito:", err);
    }
  }, [products]);

  useEffect(() => {
    if (cartId) refreshCart(cartId);
    else setCart([]);
  }, [cartId, refreshCart]);

  const handleAddToCart = async (product: ProductResponse) => {
    if (!cartId) return;
    try {
      await addCartItem({ CartId: cartId, ArticleId: product.id, Quantity: 1 });
      await refreshCart(cartId);
    } catch (err: any) {
      alert(err.message || "No se pudo agregar el artículo al carrito");
    }
  };

  const handleUpdateQty = async (cartDetailId: number, qty: number) => {
    if (!cartId) return;
    try {
      await updateCartItemQuantity({ cartDetailId, quantity: qty });
      await refreshCart(cartId);
    } catch (err: any) {
      alert(err.message || "No se pudo actualizar la cantidad");
    }
  };

  const handleRemove = async (cartDetailId: number) => {
    if (!cartId) return;
    try {
      await removeCartItem(cartDetailId);
      await refreshCart(cartId);
    } catch (err: any) {
      alert(err.message || "No se pudo eliminar el artículo");
    }
  };

  const handleCheckout = async () => {
    if (!cartId) return;
    try {
      await checkoutCart(cartId)
      refreshCart(cartId);
      showToast("¡Pedido creado correctamente!", "success");
    } catch (err: any) {
      showToast(err.message || "No se pudo completar la compra", "danger");
    }
  };

  const handleLoginSuccess = async (mode: LoginMode, data: any) => {
    const baseUser: AuthUser = {
      id: data.clientId ?? data.employeeId ?? data.id,
      nombre: data.nombre,
      email: data.email,
      role: mode === "employee" ? "admin" : "client",
      roleName: null,
      permissions: [],
      token: data.token,
      raw: data,
    };
    setStoredAuth(baseUser);

    let finalUser = baseUser;
    if (mode === "employee") {
      try {
        const me = await getMe();
        finalUser = { ...baseUser, roleName: me.role };
      } catch { /* si /me falla, se trata como no-admin */ }

      try {
        const permNames = await getMyPermissionNames(Number(finalUser.id));
        finalUser = { ...finalUser, permissions: permNames };
      } catch { /* si falla, sin permisos asignados */ }

      setStoredAuth(finalUser);
    }

    setAuthUser(finalUser);
    setUserRole(finalUser.role);
    setCurrentView(finalUser.role === "admin" ? (finalUser.roleName === "Admin" ? "dashboard" : "productos") : "tienda");
  };

  const handleRegisterSuccess = () => setCurrentView("login");

  const handleLogout = () => {
    setUserRole(null);
    setAuthUser(null);
    clearStoredAuth();
    setCart([]);
    setCurrentView("tienda");
  };

  const getClientCart = (clientId: number) => {
    if (!authUser || authUser.role !== "client") return;
    getCartByClient(Number(authUser.id))
      .then(cart => setCartId(cart.cartId))
      .catch(() => setCartId(null));
  }

  if (checkingSession) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const publicProps = { onNavigate: setCurrentView, userRole, onLogout: handleLogout, cartCount, onAddToCart: handleAddToCart };

  const renderView = () => {
    if (currentView === "tienda") return <TiendaPublicaPage {...publicProps} onSelectProduct={setSelectedProductId} />;
    if (currentView === "catalogo") return <CatalogoPage {...publicProps} products={products} onSelectProduct={setSelectedProductId} />;
    if (currentView === "contacto") return <ContactoPage {...publicProps} />;
    if (currentView === "detalle") return <DetalleProductoPage {...publicProps} product={selectedProduct} />;
    if (currentView === "carrito") return <CarritoPage {...publicProps} cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemove} onCheckout={handleCheckout} />;
    if (currentView === "registro") return <RegistroScreen onNavigate={setCurrentView} onCompleteRegister={handleRegisterSuccess} />;
    if (currentView === "login") return <LoginScreen onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;
    if (currentView === "mis-pedidos") return userRole === "client"
      ? <MisPedidosPage {...publicProps} clientId={Number(authUser?.id)} />
      : <LoginScreen onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;

    if (currentView === "mi-perfil") return userRole === "client"
      ? <MiPerfilPage {...publicProps} clientId={Number(authUser?.id)} />
      : <LoginScreen onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;

    return (
      <div className="w-full h-screen flex overflow-hidden bg-gray-50">
        <Sidebar current={currentView} onNavigate={setCurrentView} onLogout={handleLogout} isAdmin={isAdmin} permissions={permissions} />
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          {productsError && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{productsError}</div>
          )}
          {currentView === "dashboard" && (isAdmin ? <DashboardPage /> : <AccessDenied />)}
          {currentView === "productos" && <ProductosPage />}
          {currentView === "inventario" && (isAdmin || hasPermission(permissions, PERMISSION_KEYS.INVENTARIO) ? <InventoryPage /> : <AccessDenied />)}
          {currentView === "ventas" && <VentasPage />}
          {currentView === "usuarios" && (isAdmin ? <UsuariosPage /> : <AccessDenied />)}
          {currentView === "empleados" && (isAdmin ? <EmployeesPage /> : <AccessDenied />)}
          {currentView === "propietarios" && (isAdmin || hasPermission(permissions, PERMISSION_KEYS.PROPIETARIOS) ? <OwnersPage /> : <AccessDenied />)}
          {currentView === "categorias" && (isAdmin || hasPermission(permissions, PERMISSION_KEYS.CATEGORIAS) ? <CategoriasPage /> : <AccessDenied />)}
          {currentView === "roles" && (isAdmin || hasPermission(permissions, PERMISSION_KEYS.ROLES) ? <RolesPage /> : <AccessDenied />)}
          {currentView === "permisos" && (isAdmin ? <PermissionsPage /> : <AccessDenied />)}
          {currentView === "configuracion" && (isAdmin ? <ConfiguracionPage /> : <AccessDenied />)}
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {renderView()}
    </>
  );
}