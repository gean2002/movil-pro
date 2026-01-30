import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'izipay' | 'powerpay'>('izipay');
  const finalTotal = cartTotal;

  // Calculate monthly installment for Powerpay (3 months)
  const powerpayInstallment = finalTotal / 3;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call / Redirection
    setTimeout(() => {
      setLoading(false);
      clearCart();
      const gatewayName = paymentMethod === 'izipay' ? 'Izipay' : 'Powerpay';
      alert(`Serás redirigido a ${gatewayName} para completar tu pago de manera segura.`);
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header simple */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/cart" className="hover:text-black">Carrito</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-black">Pago y Envío</span>
        </div>

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 space-y-6">

            {/* Shipping Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">location_on</span>
                Dirección de Envío
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Nombre</label>
                  <input required className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="Ej. Juan" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Apellidos</label>
                  <input required className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="Ej. Pérez" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">Documento de Identidad (DNI/CE)</label>
                  <input required className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="Número de documento para boleta/factura" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">Dirección y Número</label>
                  <input required className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="Av. Larco 123, Dpto 401" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Departamento</label>
                  <select className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] bg-gray-50 outline-none">
                    <option>Lima</option>
                    <option>Cusco</option>
                    <option>Arequipa</option>
                    <option>La Libertad</option>
                    <option>Piura</option>
                    <option>Otros</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Distrito</label>
                  <input required className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="Ej. Miraflores" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">Teléfono Celular</label>
                  <input required type="tel" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-gray-50" placeholder="999 999 999" />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">payments</span>
                Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Izipay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('izipay')}
                  className={`relative p-4 rounded-xl border-2 flex flex-col items-start gap-3 transition-all overflow-hidden ${paymentMethod === 'izipay' ? 'border-[#ff004d] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'izipay' ? 'border-[#ff004d]' : 'border-gray-300'}`}>
                        {paymentMethod === 'izipay' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff004d]" />}
                      </div>
                      <span className="font-bold text-[#1d1d1f] text-lg">Izipay</span>
                    </div>
                    <span className="material-symbols-outlined text-[#ff004d]">credit_card</span>
                  </div>
                  <p className="text-xs text-gray-500 text-left font-medium">Tarjetas de Crédito y Débito. Cuotas sin interés.</p>
                  {paymentMethod === 'izipay' && (
                    <div className="absolute top-0 right-0 bg-[#ff004d] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMENDADO</div>
                  )}
                </button>

                {/* Powerpay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('powerpay')}
                  className={`relative p-4 rounded-xl border-2 flex flex-col items-start gap-3 transition-all overflow-hidden ${paymentMethod === 'powerpay' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'powerpay' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'powerpay' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                      </div>
                      <span className="font-bold text-[#1d1d1f] text-lg">Powerpay</span>
                    </div>
                    <span className="material-symbols-outlined text-black">bolt</span>
                  </div>
                  <p className="text-xs text-gray-500 text-left font-medium">Financiamiento al instante. 3 cuotas sin interés.</p>
                </button>
              </div>

              {/* Izipay Content */}
              {paymentMethod === 'izipay' && (
                <div className="animate-fade-in space-y-5">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#ff004d] font-bold text-sm">
                      <span className="material-symbols-outlined text-lg">verified</span>
                      Cuotas sin interés
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Paga en cuotas sin intereses con tarjetas <strong>BBVA, Interbank y Diners Club</strong>. Aceptamos todas las tarjetas Visa y Mastercard.
                    </p>
                    <div className="flex gap-2 mt-1 opacity-70">
                      {/* Simulated Bank Logos */}
                      <div className="h-4 w-8 bg-blue-800 rounded"></div>
                      <div className="h-4 w-8 bg-green-600 rounded"></div>
                      <div className="h-4 w-8 bg-gray-400 rounded"></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Serás redirigido a la pasarela segura de <strong>Izipay</strong> para ingresar los datos de tu tarjeta y completar la compra.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Transacción encriptada y 100% segura.
                    </div>
                  </div>
                </div>
              )}

              {/* Powerpay Content */}
              {paymentMethod === 'powerpay' && (
                <div className="animate-fade-in space-y-5">
                  <div className="p-5 bg-[#111] text-white rounded-xl flex flex-col gap-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">Resumen de Cuotas</h3>
                      <span className="bg-[#a5be31] text-black text-[10px] font-bold px-2 py-0.5 rounded">0% INTERÉS</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                      <span className="text-gray-300 text-sm">Total a pagar</span>
                      <span className="font-bold text-lg">S/ {cartTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>1ª Cuota (Hoy)</span>
                        <span className="font-bold">S/ {powerpayInstallment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>2ª Cuota (30 días)</span>
                        <span>S/ {powerpayInstallment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>3ª Cuota (60 días)</span>
                        <span>S/ {powerpayInstallment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Serás redirigido a <strong>Powerpay</strong> para validar tu identidad y completar la compra en 3 cuotas sin interés con cualquier tarjeta de crédito.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Proceso seguro y validación instantánea.
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-6">Tu Pedido</h2>

              <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg bg-center bg-contain bg-no-repeat shrink-0" style={{ backgroundImage: `url('${item.image}')` }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-[#1d1d1f] line-clamp-1">{item.name}</h4>
                        <span className="text-sm font-bold">S/ {item.price}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.color} - {item.storage}</p>
                      <p className="text-xs text-gray-400 mt-1">Cantidad: 1</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">S/ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío (Perú)</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-4 mb-6">
                <span className="text-xl font-black text-[#1d1d1f]">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#1d1d1f] block leading-none">S/ {finalTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111811] text-white h-14 rounded-xl font-bold text-lg hover:bg-[#000] active:scale-[0.98] transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{paymentMethod === 'izipay' ? 'Continuar a Izipay' : 'Continuar a Powerpay'}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex justify-center gap-2 opacity-50 grayscale">
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;