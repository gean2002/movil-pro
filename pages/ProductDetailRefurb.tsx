import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetailRefurb: React.FC = () => {
   const { brand, id } = useParams<{ brand: string; id: string }>();
   const { addToCart } = useCart();

   // States for selectors
   const [selectedCondition, setSelectedCondition] = useState<'Excelente' | 'Muy Bueno' | 'Bueno'>('Excelente');
   const [selectedColor, setSelectedColor] = useState('Negro Espacial');
   const [selectedStorage, setSelectedStorage] = useState('256GB');

   // State for Guide Modal
   const [isGuideOpen, setIsGuideOpen] = useState(false);

   // Pricing logic based on condition
   const basePrice = 989;
   const conditionPrices = {
      'Excelente': 0,
      'Muy Bueno': -40,
      'Bueno': -80
   };
   const currentPrice = basePrice + conditionPrices[selectedCondition];

   const product = {
      name: 'iPhone 14 Pro (Seminuevo)',
      originalPrice: 1319,
      description: 'El iPhone 14 Pro lleva la experiencia al límite con su Dynamic Island, una forma mágica de interactuar con el iPhone, y la pantalla Siempre Activa. Disfruta de una cámara de 48 MP con un detalle asombroso y el chip A16 Bionic, el motor que lo mueve todo.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9-FWZQD33v-L-xGQ_-q51m8C5U5uVKRzN6yf0AW5Yj5PyMp5Aaw9DVjd3NUf3Cb-4Kwole2A5on0Wv9J4x0SGEafIS189TgSu0ubZuoeh11FxlXMEOzqlJJ3pD74j-PiF3OcXdTyarlgwljIwj_Ds-CeG1iMeRdn92E1_8WdZ6egv8nt4lZa673Um4J3lrWnGypWV92nnEl-sZ0RiznNv-PrLNyrakv852xt42rZKNvy6dEr28I4G9Wg8u18BEemuE5311I8k19l',
      colors: [
         { name: 'Negro Espacial', hex: '#1C1C1E', ring: '#3a3a3c' },
         { name: 'Plata', hex: '#F2F1EC', ring: '#e6e5e0' },
         { name: 'Oro', hex: '#F9E5C9', ring: '#fdf1e0' },
         { name: 'Morado Oscuro', hex: '#483248', ring: '#5d415d' }
      ],
      storage: ['128GB', '256GB', '512GB'],
      specs: {
         check: '40 Puntos de inspección técnica',
         battery: 'Salud de batería garantizada >80%',
         warranty: '1 Año de garantía completa',
         appearance: 'Limpieza y desinfección profesional'
      }
   };

   const handleAddToCart = () => {
      addToCart({
         variantId: `refurb-${id || 'iphone-14-pro'}`,
         name: `${product.name} - ${selectedCondition}`,
         price: currentPrice,
         image: product.image,
         color: selectedColor,
         storage: selectedStorage,
         condition: 'Reacondicionado'
      });
      alert('Producto añadido al carrito');
   };

   return (
      <div className="flex flex-col bg-white relative w-full overflow-x-hidden">
         {/* Breadcrumbs */}
         <div className="px-4 md:px-10 lg:px-40 flex justify-center pt-4">
            <div className="flex flex-wrap gap-2 px-4 py-2 justify-center md:justify-start">
               <Link to="/" className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors">Inicio</Link>
               <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
               <Link to={`/reacondicionados`} className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors capitalize">Reacondicionados</Link>
               <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
               <span className="text-gray-500 text-xs md:text-sm font-medium capitalize">{brand}</span>
               <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
               <span className="text-black text-xs md:text-sm font-medium line-clamp-1">{product.name}</span>
            </div>
         </div>

         <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4">
            <div className="bg-[#fcfdfc] border border-[#a5be31]/30 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-16 flex flex-1 justify-center shadow-inner">
               <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1280px] flex-1">

                  {/* Left: Product Media */}
                  <div className="flex-1 min-w-0 flex flex-col gap-6">
                     <div className="w-full bg-white aspect-square rounded-[2rem] overflow-hidden relative border border-gray-100 shadow-sm flex items-center justify-center p-8 group">
                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 items-start">
                           <span className="bg-[#fef08a] text-yellow-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-yellow-200 flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-[14px] filled">verified</span> Reacondicionado
                           </span>
                           <span className="bg-[#ecfdf5] text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-green-200 flex items-center gap-1 shadow-sm">
                              <span className="material-symbols-outlined text-[14px] filled">eco</span> Eco-Friendly
                           </span>
                        </div>
                        <img
                           src={product.image}
                           alt={product.name}
                           className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                     </div>

                     {/* Trust Badges - Responsive Grid */}
                     <div className="grid grid-cols-3 gap-2 md:gap-3">
                        <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                           <span className="material-symbols-outlined text-green-600 text-[18px] md:text-[20px]">verified_user</span>
                           <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">1 Año Garantía</span>
                        </div>
                        <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                           <span className="material-symbols-outlined text-blue-600 text-[18px] md:text-[20px]">battery_full</span>
                           <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Batería +85%</span>
                        </div>
                        <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                           <span className="material-symbols-outlined text-orange-600 text-[18px] md:text-[20px]">fact_check</span>
                           <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Testado 40 pts</span>
                        </div>
                     </div>
                  </div>

                  {/* Right: Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                     <div className="mb-6">
                        <h1 className="text-[#111811] tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2">{product.name}</h1>
                        <div className="flex items-end gap-3 mt-4">
                           <span className="text-4xl font-black text-[#111811] tracking-tighter">S/ {currentPrice}</span>
                           <div className="flex flex-col mb-1">
                              <span className="text-sm text-gray-400 line-through font-medium">S/ {product.originalPrice}</span>
                              <span className="text-xs text-green-600 font-bold uppercase tracking-tight">Ahorras S/ {product.originalPrice - currentPrice}</span>
                           </div>
                        </div>
                     </div>

                     <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-medium">
                        {product.description}
                     </p>

                     <div className="space-y-8">
                        {/* Condition Selector */}
                        <div>
                           <div className="flex justify-between mb-3 items-center">
                              <span className="text-sm font-bold text-black uppercase tracking-wide">Estado Estético</span>
                              <button
                                 onClick={() => setIsGuideOpen(true)}
                                 className="text-[10px] font-black text-[#4ce64c] uppercase underline underline-offset-2 hover:text-green-600 transition-colors flex items-center gap-1 p-1"
                              >
                                 <span className="material-symbols-outlined text-[14px]">info</span>
                                 Guía de estados
                              </button>
                           </div>
                           <div className="grid grid-cols-3 gap-2 md:gap-3">
                              {(['Excelente', 'Muy Bueno', 'Bueno'] as const).map((cond) => (
                                 <button
                                    key={cond}
                                    onClick={() => setSelectedCondition(cond)}
                                    className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl border transition-all duration-200 ${selectedCondition === cond ? 'border-[#4ce64c] bg-green-50 shadow-md ring-1 ring-[#4ce64c]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                 >
                                    <span className={`text-[10px] md:text-[11px] font-black uppercase whitespace-nowrap ${selectedCondition === cond ? 'text-[#111811]' : 'text-gray-500'}`}>{cond}</span>
                                    <span className="text-[9px] md:text-[10px] text-gray-400 mt-1 text-center leading-tight">
                                       {cond === 'Excelente' ? 'Como nuevo' : cond === 'Muy Bueno' ? 'Marcas leves' : 'Signos de uso'}
                                    </span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Color Selector */}
                        <div>
                           <div className="flex justify-between mb-3">
                              <span className="text-sm font-bold text-black uppercase tracking-wide">Acabado</span>
                              <span className="text-sm text-gray-500 font-medium">{selectedColor}</span>
                           </div>
                           <div className="flex flex-wrap gap-4">
                              {product.colors.map((c) => (
                                 <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c.name)}
                                    className={`size-10 rounded-full relative shadow-sm transition-all duration-300 ${selectedColor === c.name ? 'ring-2 ring-offset-4 scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c.hex, '--tw-ring-color': c.ring } as React.CSSProperties}
                                 >
                                    {selectedColor === c.name && (
                                       <span className="absolute inset-0 flex items-center justify-center">
                                          <span className="material-symbols-outlined text-white text-[18px]">check</span>
                                       </span>
                                    )}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Storage Selector */}
                        <div>
                           <div className="flex justify-between mb-3">
                              <span className="text-sm font-bold text-black uppercase tracking-wide">Almacenamiento</span>
                           </div>
                           <div className="grid grid-cols-3 gap-3">
                              {product.storage.map((s) => (
                                 <button
                                    key={s}
                                    onClick={() => setSelectedStorage(s)}
                                    className={`py-3 rounded-xl border text-xs font-bold transition-all duration-200 ${selectedStorage === s ? 'border-black bg-black text-white shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}
                                 >
                                    {s}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Desktop Buy Actions */}
                        <div className="hidden md:flex pt-6 border-t border-gray-100 flex-col gap-4">
                           <button
                              onClick={handleAddToCart}
                              className="w-full bg-[#111811] hover:bg-[#4ce64c] hover:text-[#111811] text-white text-lg font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                           >
                              <span className="material-symbols-outlined group-hover:animate-bounce">shopping_bag</span> Añadir al Carrito
                           </button>

                           <div className="flex items-center justify-center gap-6 py-2">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                 <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                                 Envío Gratis 24/48h
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                 <span className="material-symbols-outlined text-[18px]">lock</span>
                                 Pago 100% Seguro
                              </div>
                           </div>
                        </div>

                        {/* Sustainability Message */}
                        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3 md:gap-4 items-start">
                           <div className="bg-green-100 p-2 rounded-full shrink-0">
                              <span className="material-symbols-outlined text-green-700 text-[20px] filled">eco</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-green-900 uppercase tracking-wide mb-1 text-xs">Impacto Positivo</h4>
                              <p className="text-[11px] text-green-800 leading-relaxed font-medium">
                                 Comprando este producto reacondicionado estás ahorrando aproximadamente **75kg de CO2** y evitando la minería de metales preciosos.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* --- New Section: Quality Guarantee --- */}
         <section className="bg-[#f5f5f7] py-20 px-6">
            <div className="max-w-[1000px] mx-auto">
               <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-[#1d1d1f]">Calidad Garantizada</h2>

               <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {[
                     { icon: 'playlist_add_check', title: 'Inspección', text: `${product.specs.check}. Revisamos pantalla, conectividad, altavoces y más.` },
                     { icon: 'battery_charging_full', title: 'Batería', text: `${product.specs.battery}. Si está por debajo, la cambiamos por una nueva.` },
                     { icon: 'verified_user', title: 'Garantía', text: `${product.specs.warranty}. Cualquier fallo técnico está cubierto.` },
                     { icon: 'cleaning_services', title: 'Estética', text: `${product.specs.appearance}. Recibes un dispositivo limpio y desinfectado.` }
                  ].map((spec, i) => (
                     <div key={i} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <span className="material-symbols-outlined text-4xl mb-4 text-green-600">{spec.icon}</span>
                        <h3 className="text-xl font-bold mb-2">{spec.title}</h3>
                        <p className="text-gray-600 font-medium">{spec.text}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- New Section: What's in the Box (Eco) --- */}
         <section className="bg-white py-20 px-6 border-b border-gray-100">
            <div className="max-w-[800px] mx-auto text-center">
               <h2 className="text-3xl font-black mb-12 text-[#1d1d1f]">Empaquetado Eco-Friendly</h2>
               <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-6xl text-gray-400">inventory_2</span>
                     </div>
                     <span className="font-bold text-gray-900">Caja Reciclada Genérica</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                        <img src={product.image} className="h-24 md:h-32 object-contain mix-blend-multiply" alt="iPhone" />
                     </div>
                     <span className="font-bold text-gray-900">{product.name}</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-6xl text-gray-400">cable</span>
                     </div>
                     <span className="font-bold text-gray-900">Cable Nuevo Compatible</span>
                  </div>
               </div>
               <p className="text-gray-400 text-xs mt-12 max-w-lg mx-auto leading-relaxed">
                  * Para reducir residuos electrónicos, no incluimos auriculares ni adaptador de corriente. El dispositivo viene en una caja neutra protegida.
               </p>
            </div>
         </section>

         {/* --- New Section: FAQ Refurbished --- */}
         <section className="bg-[#f5f5f7] py-20 px-6">
            <div className="max-w-[800px] mx-auto">
               <h2 className="text-3xl font-black mb-8 text-[#1d1d1f] text-center">Preguntas Frecuentes</h2>
               <div className="space-y-4">
                  {[
                     { q: "¿Qué significa seminuevo?", a: "Es un dispositivo que ha tenido una vida anterior pero ha sido inspeccionado, limpiado y reparado si es necesario para funcionar al 100% como uno nuevo." },
                     { q: "¿La batería es nueva?", a: "Garantizamos que la batería tiene al menos un 80% de su capacidad original. Si está por debajo de este umbral durante la inspección, la reemplazamos por una nueva." },
                     { q: "¿Es resistente al agua?", a: "Aunque los iPhone originales tienen resistencia IP68, al ser seminuevos y posiblemente abiertos para reparación, no garantizamos la estanqueidad original. Recomendamos no sumergirlos." },
                     { q: "¿Qué pasa si no me gusta?", a: "Tienes 14 días para devolverlo sin compromiso si no estás satisfecho con el estado estético o el funcionamiento." }
                  ].map((item, i) => (
                     <details key={i} className="group bg-white rounded-2xl p-6 cursor-pointer open:shadow-md transition-shadow">
                        <summary className="flex justify-between items-center font-bold text-lg list-none text-[#1d1d1f]">
                           {item.q}
                           <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                        </summary>
                        <p className="text-gray-600 mt-4 leading-relaxed font-medium text-sm md:text-base">
                           {item.a}
                        </p>
                     </details>
                  ))}
               </div>
            </div>
         </section>

         {/* --- New Section: Recommended Accessories --- */}
         <section className="bg-white py-20 px-6 pb-40">
            <div className="max-w-[1280px] mx-auto">
               <div className="flex justify-between items-end mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-[#1d1d1f]">Completa tu compra</h2>
                  <Link to="/accesorios" className="text-blue-600 font-bold text-sm hover:underline">Ver accesorios</Link>
               </div>

               <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
                  {[
                     { name: 'Funda Transparente', price: 'S/ 19', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsjDFK0sU_Z0W8esd6cD6-Id_dIROimRA1e1Ce8zuSX4UCECxpd9ua3Qnfm2QOi0EFoVqEm57-QF_Y6xD1aLJ6_2HwDllcK3bAhzcFWNwNGVLja3ttxClvhO1NVtTyd2TyXlPEPVvYIiXGZSTyrhQcZq8JeYw4htWEWM0QVxShiGUi9nVoI5EMM20W6eUkPbmsLL2WizjztMeFal1FDUEldS2YDB7ZeB_7ftH4UuH3qiNGoUf0v5_gOoQrzp6KmPFjts43FHHu8tO' },
                     { name: 'Cargador 20W', price: 'S/ 19', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtx-xlrdUDGoQ1PbJCJXkgjFHMoKdbfWLJk1Sb74G4fbT3EUHQFU-fxUCK97qHSgf-Y0erV4w49KJI9S1oNhuhNqWxlDwVxkQAW4jo193KMsuGSD3yXc4rCeF21Q6ij4CiBauI-wqjEeuU0-4nkGKhsZUygyWa21YrevozFTC24LlHsJ1CoDsnKiKSK7-SA8ELUIPAC9Rqk_NXmzDHSbRknVg4mPLmG1_VRF1NInLa6juvO4JV_rRWRFWMVqk-8NmUILdzx60Y5Bif' },
                     { name: 'Protector Pantalla', price: 'S/ 15', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC58MN5Wm4UUehIYovEU0XU9wBipCEnHpnp3Jt0K1C7y8FKNV5uo1htIgShTRW3MNnb2nNLqTjfRJH8O7u9w7piTB9PVy89jorKTp5_1PeB-lPIBK3msgEoUK_RR2rU-Ng6CWdV1-WIblugSGwbxn75OqU03LA0AFsu1K_kLVmQKgJL4qIUIiOJmfAz5NshuUNF0pL6E6KX2ETef2GblWiZK3G00uy3i6ZCgqBhN2WITXhbHWyE40ukIQfpDgvedSJO2YT6dkNCjJZ1' }
                  ].map((acc, i) => (
                     <div key={i} className="min-w-[200px] md:min-w-[240px] bg-white border border-gray-100 rounded-2xl p-4 snap-start hover:shadow-lg transition-all cursor-pointer group">
                        <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                           <img src={acc.img} className="h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={acc.name} />
                        </div>
                        <h3 className="font-bold text-[#1d1d1f] mb-1">{acc.name}</h3>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-900 font-medium">{acc.price}</span>
                           <button className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-colors transform active:scale-90 shadow-md">
                              <span className="material-symbols-outlined text-[16px]">add</span>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Mobile Sticky Bar */}
         <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pt-4 pb-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
            <div className="flex items-center gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Total Reacondicionado</span>
                  <span className="text-2xl font-black text-[#1d1d1f] leading-none">S/ {currentPrice}</span>
               </div>
               <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#111811] text-white h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
               >
                  Añadir
               </button>
            </div>
         </div>

         {/* Condition Guide Modal */}
         {isGuideOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all" onClick={() => setIsGuideOpen(false)}>
               <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6 md:p-8">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black text-[#1d1d1f]">Guía de Estados</h3>
                        <button onClick={() => setIsGuideOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                           <span className="material-symbols-outlined text-gray-500 text-xl">close</span>
                        </button>
                     </div>

                     <div className="space-y-6">
                        {/* Excelente */}
                        <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                              <span className="material-symbols-outlined text-green-600">verified</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-[#1d1d1f] text-lg mb-1">Excelente</h4>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                 <strong>Pantalla:</strong> Como nueva. <br />
                                 <strong>Cuerpo:</strong> Microrasguños invisibles a 20cm. <br />
                                 <strong>Batería:</strong> Superior al 80%.
                              </p>
                           </div>
                        </div>
                        {/* Muy Bueno */}
                        <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-1">
                              <span className="material-symbols-outlined text-yellow-700">star_half</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-[#1d1d1f] text-lg mb-1">Muy Bueno</h4>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                 <strong>Pantalla:</strong> En perfecto estado.<br />
                                 <strong>Cuerpo:</strong> Rasguños leves visibles a 20cm.<br />
                                 <strong>Batería:</strong> Superior al 80%.
                              </p>
                           </div>
                        </div>
                        {/* Bueno */}
                        <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                              <span className="material-symbols-outlined text-gray-600">check_circle</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-[#1d1d1f] text-lg mb-1">Bueno</h4>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                 <strong>Pantalla:</strong> Puede tener microrasguños.<br />
                                 <strong>Cuerpo:</strong> Rasguños o marcas visibles.<br />
                                 <strong>Batería:</strong> Superior al 80%.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                     <p className="text-xs text-gray-500 font-medium">Todos los dispositivos son 100% funcionales y han pasado el test de 40 puntos.</p>
                  </div>
               </div>
            </div>
         )}

         <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      </div>
   );
};

export default ProductDetailRefurb;