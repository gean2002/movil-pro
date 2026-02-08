import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { createCheckout, checkoutLineItemsAdd, associateCustomerToCheckout } from '../lib/shopify';

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create Checkout
      const checkout = await createCheckout();
      if (!checkout) throw new Error("No se pudo iniciar el checkout");

      // 2. Format Line Items
      // Ensure variantId is base64 encoded as expected by Storefront API often, 
      // BUT our lib/shopify helper usually handles raw IDs if formatted correctly consistently.
      // Assuming variantId in cart is the correct ID from Shopify.
      const lineItems = items.map(item => ({
        variantId: item.variantId,
        quantity: 1 // Cart logic might need quantity update if we support > 1
      }));

      // 3. Add Items
      const updatedCheckout = await checkoutLineItemsAdd(checkout.id, lineItems);
      if (!updatedCheckout) throw new Error("Error al agregar productos");

      // 4. Associate Customer (if logged in)
      if (isAuthenticated && token) {
        console.log("Associating user to checkout...");
        await associateCustomerToCheckout(updatedCheckout.id, token);
      }

      // 5. Redirect
      clearCart();
      window.location.href = updatedCheckout.webUrl;

    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu compra. Por favor intenta nuevamente.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart_off</span>
          <h1 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h1>
          <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-gray-700">lock</span>
          </div>

          <h1 className="text-3xl font-black text-[#1d1d1f] tracking-tight">
            Resumen del Pedido
          </h1>

          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Estás a un paso de completar tu compra. Serás redirigido a nuestra pasarela de pago segura.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4 my-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 bg-center bg-contain bg-no-repeat shrink-0"
                  style={{ backgroundImage: `url('${item.image}')` }}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.storage} • {item.color}</p>
                </div>
                <span className="font-bold text-sm">S/ {item.price.toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Total a Pagar</span>
              <span className="text-2xl font-black text-[#1d1d1f]">S/ {cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#1d1d1f] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Proceder al Pago Seguro</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 font-medium pt-4 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Pagos procesados de forma segura por Shopify
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;