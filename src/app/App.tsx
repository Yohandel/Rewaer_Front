import React, { useState, useEffect, useCallback } from 'react';
import { Page, CartItem, LoginMode, AuthUser } from '../Types';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../utils/authStorage';
import { getProducts } from '../services/productService';
import { addCartItem, getCart, updateCartItemQuantity, removeCartItem, checkoutCart, getCartByClientId } from '../services/cartService';
import { adaptCartItem } from '../utils/adapters';

import { Sidebar } from '../Components/admin/Sidebar';
import { DashboardPage } from '../Components/admin/DashboardPage';
import { ProductosPage } from '../Components/admin/ProductosPage';
import { VentasPage } from '../Components/admin/VentasPage';
import { UsuariosPage } from '../Components/admin/UsuariosPage';
import { CategoriasPage } from '../Components/admin/CategoriasPage';
import { ConfiguracionPage } from '../Components/admin/ConfiguracionPage';

import { TiendaPublicaPage } from '../Components/public/TiendaPublicaPage';
import { CatalogoPage } from '../Components/public/CatalogoPage';
import { ContactoPage } from '../Components/public/ContactoPage';
import { DetalleProductoPage } from '../Components/public/DetalleProductoPage';
import { CarritoPage } from '../Components/public/CarritoPage';

import { LoginScreen } from '../Components/auth/LoginScreen';
import { RegistroScreen } from '../Components/auth/RegistroScreen';
import { getMe } from '../services/authservice';
import { ProductResponse } from '../interfaces/IProduct';
import { EmployeesPage } from '../Components/admin/EmployeesPage';
import { OwnersPage } from '../Components/admin/OwnersPage';
import { Toast } from '../Components/common/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState<Page>("tienda");
  const [userRole, setUserRole] = useState<"admin" | "client" | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "danger" } | null>(null);

  const showToast = (msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant }); setTimeout(() => setToast(null), 3500);
  };

  const [cartId, setCartId] = useState<number | null>(null);
  useEffect(() => {
    getClientCart(authUser?.id as number);
  }, [authUser]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

  // Cargar catálogo de artículos al montar la app
  useEffect(() => {
    getProducts()
      .then(products => setProducts(products.filter(p => p.stock > 0)))
      .catch(err => setProductsError(err.message || "No se pudo cargar el catálogo"));
  }, []);

  // Validar sesión guardada
  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored) { setCheckingSession(false); return; }

    setAuthUser(stored);
    setUserRole(stored.role);

    getMe()
      .then(me => {
        const refreshed: AuthUser = { ...stored, id: me.id, nombre: me.name, email: me.email };
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

  const getClientCart = (clientId: number) => {
    if (!authUser || authUser.role !== "client") return;
    getCartByClientId(clientId)
      .then(cartResp => {
        if (cartResp && cartResp.cartId) {
          refreshCart(cartResp.cartId);
          setCartId(cartResp.cartId);
        } else {
          setCart([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener el carrito del cliente:", err);
        setCart([]);
      });
  }

  const refreshCart = useCallback(async (id: number) => {
    try {
      const items = await getCart(id);
      setCart(items.map(i => adaptCartItem(i, products)));
    } catch (err) {
      console.error("No se pudo cargar el carrito:", err);
    }
  }, [products]);

  // Cargar el carrito cuando hay un cliente logueado (o limpiarlo si no)
  useEffect(() => {
    if (cartId) refreshCart(cartId);
    else setCart([]);
  }, [cartId, refreshCart]);

  const handleAddToCart = async (product: ProductResponse) => {
    if (!cartId) return; // no debería pasar: la UI ya exige login antes de llamar esto
    try {
      await addCartItem({ CartId: cartId, ArticleId: product.id, Quantity: 1 });
      await refreshCart(cartId);
    } catch (err: any) {
      showToast(err.message || "No se pudo agregar el artículo al carrito", "danger")
    }
  };

  const handleUpdateQty = async (cartDetailId: number, qty: number) => {
    if (!cartId) return;
    try {
      await updateCartItemQuantity({ cartDetailId, quantity: qty });
      await refreshCart(cartId);
    } catch (err: any) {
      showToast(err.message || "No se pudo actualizar la cantidad", "danger");

    }
  };

  const handleRemove = async (cartDetailId: number) => {
    if (!cartId) return;
    try {
      await removeCartItem(cartDetailId);
      await refreshCart(cartId);
    } catch (err: any) {
      showToast(err.message || "No se pudo eliminar el artículo", "danger");
    }
  };

  const handleCheckout = async () => {
    if (!cartId || cart.length === 0) return;

    try {
      // 1. Procesa la venta/orden en el backend
      await checkoutCart(cartId);

      // 2. Elimina individualmente cada producto del carrito usando su cartDetailId
      const deletePromises = cart
        .filter(item => item.cartDetailId !== undefined)
        .map(item => removeCartItem(item.cartDetailId!));

      await Promise.all(deletePromises);

      // 3. Notifica al usuario y refresca el carrito desde el backend (quedará en [])
      showToast("¡Pedido creado correctamente!", "success");
      await refreshCart(cartId);

    } catch (err: any) {
      showToast(err.message || "No se pudo completar la compra", "danger");
    }
  };

  const handleLoginSuccess = (mode: LoginMode, data: any) => {
    const user: AuthUser = {
      id: data.clientId ?? data.employeeId ?? data.id,
      nombre: data.nombre,
      email: data.email,
      role: mode === "employee" ? "admin" : "client",
      token: data.token,
      raw: data,
    };
    setAuthUser(user);
    setUserRole(user.role);
    setStoredAuth(user);
    setCurrentView(user.role === "admin" ? "dashboard" : "tienda");
  };

  const handleRegisterSuccess = () => setCurrentView("login");

  const handleLogout = () => {
    setUserRole(null);
    setAuthUser(null);
    clearStoredAuth();
    setCart([]);
    setCurrentView("tienda");
  };

  if (checkingSession) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const publicProps = {
    onNavigate: setCurrentView,
    userRole,
    onLogout: handleLogout,
    cartCount,
    onAddToCart: handleAddToCart,
    showToast
  };

  const renderView = () => {
    if (currentView === "tienda") return <TiendaPublicaPage {...publicProps} onSelectProduct={setSelectedProductId} />;
    if (currentView === "catalogo") return <CatalogoPage {...publicProps} products={products} onSelectProduct={setSelectedProductId} />;
    if (currentView === "contacto") return <ContactoPage {...publicProps} />;
    if (currentView === "detalle") return <DetalleProductoPage {...publicProps} product={selectedProduct} />;
    if (currentView === "carrito") return <CarritoPage {...publicProps} cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemove} onCheckout={handleCheckout} />;
    if (currentView === "registro") return <RegistroScreen onNavigate={setCurrentView} onCompleteRegister={handleRegisterSuccess} />;
    if (currentView === "login") return <LoginScreen onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;

    return (
      <div className="w-full h-screen flex overflow-hidden bg-gray-50">
        <Sidebar current={currentView} onNavigate={setCurrentView} onLogout={handleLogout} />
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          {productsError && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{productsError}</div>
          )}
          {currentView === "dashboard" && <DashboardPage />}
          {currentView === "productos" && <ProductosPage />}
          {currentView === "ventas" && <VentasPage />}
          {currentView === "usuarios" && <UsuariosPage />}
          {currentView === "empleados" && <EmployeesPage />}
          {currentView === "propietarios" && <OwnersPage />}
          {currentView === "categorias" && <CategoriasPage />}
          {currentView === "configuracion" && <ConfiguracionPage />}
        </div>
      </div>
    );
  };


  return (
    <>
      {toast && <Toast message={toast.msg} variant={toast.variant} onClose={() => setToast(null)} />}
      {renderView()}
    </>
  );
}