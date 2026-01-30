import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { shopifyClient, associateCustomerToCheckout } from '../lib/shopify';

const Cart: React.FC = () => {
  const { items, removeFromCart, cartTotal } = useCart();
  const { token, isAuthenticated } = useAuth();

  // UI States
  const [loading, setLoading] = useState(false);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  // Discount & Checkout Data
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  // Reset checkout state if items change
  useEffect(() => {
    setCheckoutUrl(null);
    setCheckoutId(null);
    setCalculatedTotal(null);
    setDiscountAmount(0);
    setAppliedCode(null);
  }, [items]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setValidatingDiscount(true);
    setDiscountAmount(0);

    try {
      // 1. Create Checkout (if not exists) or use existing? 
      // Better to create fresh to ensure consistency with current cart
      const checkout = await shopifyClient.checkout.create();

      // 2. Prepare Line Items
      const lineItems = items.reduce((acc, item) => {
        if (!item.variantId) return acc;
        const existing = acc.find(i => i.variantId === item.variantId);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ variantId: item.variantId, quantity: 1 });
        }
        return acc;
      }, [] as { variantId: string; quantity: number }[]);

      if (lineItems.length === 0) {
        alert('No hay productos válidos para aplicar descuento.');
        setValidatingDiscount(false);
        return;
      }

      // 3. Add Items
      let updatedCheckout = await shopifyClient.checkout.addLineItems(checkout.id, lineItems);

      // 4. Add Discount
      updatedCheckout = await shopifyClient.checkout.addDiscount(updatedCheckout.id, discountCode.trim());

      // 5. Calculate Discount
      // using cartTotal (what user sees) vs checkout total (what they pay) handles all discount types
      const subtotalCheckout = parseFloat(updatedCheckout.subtotalPrice.amount);
      const total = parseFloat(updatedCheckout.totalPrice.amount);

      // Use logic: if checkout total is less than our local cart total, that's the savings.
      // Also check against checkout subtotal to be safe (in case local cart drifts, though it shouldn't)
      const basePrice = Math.max(subtotalCheckout, cartTotal);

      if (total < basePrice) {
        const diff = basePrice - total;
        setDiscountAmount(diff);
        setCalculatedTotal(total);
        setCheckoutUrl(updatedCheckout.webUrl);
        setCheckoutId(updatedCheckout.id);
        setAppliedCode(discountCode.trim());
        alert(`¡Cupón "${discountCode.trim()}" aplicado! Ahorras S/ ${diff.toFixed(2)}`);
      } else {
        alert('El código es válido pero no aplicó descuento a estos productos (o el monto es igual).');
        // Could act as success but 0 discount, or invalid. Treating as warning.
        setCheckoutUrl(updatedCheckout.webUrl); // Still keep checkout 
        setCheckoutId(updatedCheckout.id);
      }

    } catch (error) {
      console.error('Error applying discount:', error);
      alert('El cupón no es válido o ha expirado.');
    } finally {
      setValidatingDiscount(false);
    }
  };

  const handleProceedToCheckout = async () => {
    setLoading(true);
    try {
      let targetWebUrl = checkoutUrl;
      let targetCheckoutId = checkoutId;

      // If we don't have a checkout yet (no discount flow), create one
      if (!targetWebUrl || !targetCheckoutId) {
        const checkout = await shopifyClient.checkout.create();
        const lineItems = items.reduce((acc, item) => {
          if (!item.variantId) return acc;
          const existing = acc.find(i => i.variantId === item.variantId);
          if (existing) {
            existing.quantity += 1;
          } else {
            acc.push({ variantId: item.variantId, quantity: 1 });
          }
          return acc;
        }, [] as { variantId: string; quantity: number }[]);

        if (lineItems.length === 0) {
          alert('Error: Carrito vacío.');
          setLoading(false);
          return;
        }

        const checkoutWithItems = await shopifyClient.checkout.addLineItems(checkout.id, lineItems);
        targetWebUrl = checkoutWithItems.webUrl;
        targetCheckoutId = checkoutWithItems.id;
      }

      // --- CRITICAL: Associate Logged In User ---
      if (token && targetCheckoutId) {
        console.log('Associating customer to checkout...');
        const assocResult = await associateCustomerToCheckout(targetCheckoutId, token);
        if (assocResult?.webUrl) {
          targetWebUrl = assocResult.webUrl; // Sometimes webUrl updates with token param
        }
      }

      if (targetWebUrl) {
        window.location.href = targetWebUrl;
      } else {
        alert('Error generando link de pago.');
      }

    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-gray-400">shopping_cart_off</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111811]">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-4">¿No sabes qué comprar? ¡Miles de productos te esperan!</p>
        <Link to="/smartphones" className="px-6 py-3 bg-[#111811] text-white rounded-full font-bold hover:bg-[#a5be31] hover:text-[#111811] transition-colors">
          Ver Novedades
        </Link>
      </div>
    );
  }

  const finalTotal = calculatedTotal !== null ? calculatedTotal : cartTotal;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2 pb-2 border-b border-gray-200">
            <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight">Tu Carrito <span className="text-gray-400 font-medium text-2xl">({items.length} artículos)</span></h1>
            <div className="flex items-center gap-2 text-green-700">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <p className="text-sm font-medium">Envío gratis a todo el Perú</p>
            </div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative shrink-0">
                <div className="bg-gray-100 aspect-square h-32 w-32 rounded-lg bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url('${item.image}')` }}></div>
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.condition === 'Nuevo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.condition}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111811]">{item.name}</h3>
                    {item.selectedOptions ? (
                      <div className="flex flex-col gap-0.5 mt-1">
                        {item.selectedOptions.map((opt, idx) => (
                          <p key={idx} className="text-gray-500 text-sm">
                            <span className="font-medium">{opt.name}:</span> {opt.value}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Color: {item.color}</p>
                        <p className="text-gray-500 text-sm">Almacenamiento: {item.storage}</p>
                      </>
                    )}
                  </div>
                  <p className="text-lg font-bold text-[#111811]">S/ {item.price}</p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500"><span className="material-symbols-outlined text-lg">remove</span></button>
                      <input className="w-8 p-0 text-center bg-transparent border-none text-sm font-medium" readOnly value="1" />
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500"><span className="material-symbols-outlined text-lg">add</span></button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-[#111811]">Resumen del Pedido</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Cupón de Descuento</label>
                <div className="flex gap-2">
                  <input
                    className={`w-full pl-3 pr-3 py-2.5 rounded-lg border ${appliedCode ? 'border-[#a5be31] bg-[#a5be31]/10 text-[#5c6e12] font-bold' : 'border-gray-200 bg-gray-50'} text-sm transition-colors`}
                    placeholder="Ingresa tu código"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={!!appliedCode}
                    readOnly={!!appliedCode}
                  />
                  {appliedCode ? (
                    <button
                      onClick={() => {
                        setAppliedCode(null);
                        setDiscountAmount(0);
                        setCalculatedTotal(null);
                        setCheckoutUrl(null);
                        setCheckoutId(null);
                        setDiscountCode('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500 rounded-lg flex items-center justify-center transition-all"
                      title="Remover cupón"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyDiscount}
                      className="px-4 py-2 bg-[#111811] text-white hover:bg-[#a5be31] hover:text-[#111811] rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed w-[52px]"
                      disabled={!discountCode.trim() || validatingDiscount}
                      title="Validar código"
                    >
                      {validatingDiscount ? (
                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <span className="material-symbols-outlined">check</span>
                      )}
                    </button>
                  )}
                </div>
                {appliedCode && (
                  <p className="text-xs text-[#a5be31] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Cupón aplicado correctamente
                  </p>
                )}
              </div>
              <hr className="border-gray-100" />
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center"><span className="text-gray-600">Subtotal</span><span className="font-medium text-[#111811]">S/ {cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Envío</span><span className="text-green-600 font-medium">Gratis</span></div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#a5be31] animate-fade-in">
                    <span className="font-bold">Descuento</span>
                    <span className="font-bold">- S/ {discountAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
              <hr className="border-dashed border-gray-200" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col"><span className="text-lg font-bold text-[#111811]">Total</span></div>
                <span className="text-2xl font-black text-[#111811]">S/ {finalTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                disabled={loading || validatingDiscount}
                className="w-full bg-[#a5be31] hover:bg-[#36d636] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#111811] h-14 rounded-xl text-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Proceder al Pago</span> <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;