import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetailAccessory: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('Arcilla');
  const [selectedModel, setSelectedModel] = useState('iPhone 15 Pro Max');
  const [activeImage, setActiveImage] = useState(0);

  // Specific data for the Silicone Case or generic for others
  const isSiliconeCase = id === 'silicone-case';
  const isCharger = id === 'magsafe-charger';

  // Mock Data Logic
  const product = isSiliconeCase ? {
    name: 'Funda de Silicona con MagSafe',
    category: 'Fundas y Protección',
    price: 49,
    description: 'La funda de silicona con MagSafe ha sido diseñada por Apple especialmente para proteger tu iPhone con elegancia. El acabado exterior de silicona tiene un tacto tan agradable que te va a sorprender. Y el interior está forrado de suave microfibra para proteger el iPhone.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsjDFK0sU_Z0W8esd6cD6-Id_dIROimRA1e1Ce8zuSX4UCECxpd9ua3Qnfm2QOi0EFoVqEm57-QF_Y6xD1aLJ6_2HwDllcK3bAhzcFWNwNGVLja3ttxClvhO1NVtTyd2TyXlPEPVvYIiXGZSTyrhQcZq8JeYw4htWEWM0QVxShiGUi9nVoI5EMM20W6eUkPbmsLL2WizjztMeFal1FDUEldS2YDB7ZeB_7ftH4UuH3qiNGoUf0v5_gOoQrzp6KmPFjts43FHHu8tO',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsjDFK0sU_Z0W8esd6cD6-Id_dIROimRA1e1Ce8zuSX4UCECxpd9ua3Qnfm2QOi0EFoVqEm57-QF_Y6xD1aLJ6_2HwDllcK3bAhzcFWNwNGVLja3ttxClvhO1NVtTyd2TyXlPEPVvYIiXGZSTyrhQcZq8JeYw4htWEWM0QVxShiGUi9nVoI5EMM20W6eUkPbmsLL2WizjztMeFal1FDUEldS2YDB7ZeB_7ftH4UuH3qiNGoUf0v5_gOoQrzp6KmPFjts43FHHu8tO' // Duplicated for gallery demo
    ],
    colors: [
      { name: 'Arcilla', hex: '#8b847e', ring: '#a8a29d' },
      { name: 'Tormenta', hex: '#4b5563', ring: '#6b7280' },
      { name: 'Guayaba', hex: '#f87171', ring: '#fca5a5' },
      { name: 'Rosa Claro', hex: '#fce4ec', ring: '#f8bbd0' },
      { name: 'Negro', hex: '#1C1C1E', ring: '#3a3a3c' }
    ],
    models: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14', 'iPhone 13'],
    specs: [
      { label: 'Material', value: 'Silicona suave al tacto' },
      { label: 'Interior', value: 'Microfibra' },
      { label: 'MagSafe', value: 'Sí, imanes integrados' },
      { label: 'Peso', value: '32 g' }
    ],
    compatibility: ['iPhone 15 Series', 'iPhone 14 Series', 'iPhone 13 Series']
  } : isCharger ? {
    name: 'Cargador MagSafe',
    category: 'Carga',
    price: 35,
    description: 'El cargador MagSafe se conecta a través de imanes perfectamente alineados. Para que la carga inalámbrica sea más rápida y cómoda que nunca.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC58MN5Wm4UUehIYovEU0XU9wBipCEnHpnp3Jt0K1C7y8FKNV5uo1htIgShTRW3MNnb2nNLqTjfRJH8O7u9w7piTB9PVy89jorKTp5_1PeB-lPIBK3msgEoUK_RR2rU-Ng6CWdV1-WIblugSGwbxn75OqU03LA0AFsu1K_kLVmQKgJL4qIUIiOJmfAz5NshuUNF0pL6E6KX2ETef2GblWiZK3G00uy3i6ZCgqBhN2WITXhbHWyE40ukIQfpDgvedSJO2YT6dkNCjJZ1'
    ],
    colors: [{ name: 'Blanco', hex: '#FFFFFF', ring: '#e5e5e5' }],
    models: ['Universal MagSafe'],
    specs: [
      { label: 'Conector', value: 'USB-C integrado' },
      { label: 'Potencia', value: 'Hasta 15 W' },
      { label: 'Longitud', value: '1 metro' }
    ],
    compatibility: ['iPhone 12 en adelante', 'AirPods con estuche de carga inalámbrica']
  } : {
    name: 'Accesorio Apple',
    category: 'Accesorios',
    price: 29,
    description: 'Accesorio oficial de Apple diseñado para funcionar a la perfección con tus dispositivos.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtx-xlrdUDGoQ1PbJCJXkgjFHMoKdbfWLJk1Sb74G4fbT3EUHQFU-fxUCK97qHSgf-Y0erV4w49KJI9S1oNhuhNqWxlDwVxkQAW4jo193KMsuGSD3yXc4rCeF21Q6ij4CiBauI-wqjEeuU0-4nkGKhsZUygyWa21YrevozFTC24LlHsJ1CoDsnKiKSK7-SA8ELUIPAC9Rqk_NXmzDHSbRknVg4mPLmG1_VRF1NInLa6juvO4JV_rRWRFWMVqk-8NmUILdzx60Y5Bif'
    ],
    colors: [{ name: 'Blanco', hex: '#FFFFFF', ring: '#F5F5F7' }],
    models: ['Universal'],
    specs: [],
    compatibility: ['Dispositivos Apple']
  };

  const handleAddToCart = () => {
    addToCart({
      variantId: id || 'accessory',
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      storage: selectedModel,
      condition: 'Nuevo'
    });
    alert('Accesorio añadido al carrito');
  };

  return (
    <div className="flex flex-col bg-white relative w-full overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-10 lg:px-40 flex justify-center pt-4">
        <div className="flex flex-wrap gap-2 px-4 py-2 justify-center md:justify-start">
          <Link to="/" className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors">Inicio</Link>
          <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
          <Link to="/accesorios" className="text-blue-600 font-bold text-sm hover:underline">Ver accesorios</Link>
          <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
          <span className="text-gray-500 text-xs md:text-sm font-medium capitalize">{category}</span>
          <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
          <span className="text-black text-xs md:text-sm font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4">
        <div className="bg-[#fcfdfc] border border-[#a5be31]/30 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-16 flex flex-1 justify-center shadow-inner w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1280px] flex-1">

            {/* Left: Product Images */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <div className="w-full bg-[#f5f5f7] aspect-square rounded-[2rem] overflow-hidden relative group">
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                  {/* MagSafe Badge */}
                  {(isSiliconeCase || isCharger) && (
                    <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-100">
                      <span className="material-symbols-outlined text-green-600 text-[18px]">bolt</span>
                      <span className="text-[10px] font-black uppercase tracking-tight text-gray-800">MagSafe</span>
                    </div>
                  )}
                </div>
                {/* Main Image */}
                <div className="w-full h-full bg-center bg-contain bg-no-repeat transition-all duration-700 ease-in-out group-hover:scale-105 p-12 mix-blend-multiply" style={{ backgroundImage: `url('${product.images[activeImage]}')` }}></div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex justify-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded-xl border-2 bg-[#f5f5f7] p-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
              {/* Trust Badges - Responsive Grid */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                  <span className="material-symbols-outlined text-green-600 text-[18px] md:text-[20px]">verified_user</span>
                  <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Garantía Movil Pro</span>
                </div>
                <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                  <span className="material-symbols-outlined text-blue-600 text-[18px] md:text-[20px]">inventory_2</span>
                  <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Original Apple</span>
                </div>
                <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                  <span className="material-symbols-outlined text-orange-600 text-[18px] md:text-[20px]">rocket_launch</span>
                  <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Envío Express</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase */}
            <div className="flex-1 min-w-0 flex flex-col pt-2">
              <div className="mb-4">
                <span className="text-[#86198f] text-xs font-bold uppercase tracking-wide mb-2 block">{product.category}</span>
                <h1 className="text-[#111811] tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500">
                  <span className="text-yellow-500">★★★★★</span> 5.0
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-[#111811] tracking-tighter">S/ {product.price}</span>
                  <div className="flex flex-col mb-1">
                    {/* Mock comparison for visual consistency */}
                    <span className="text-sm text-gray-400 line-through font-medium">S/ {(product.price * 1.2).toFixed(0)}</span>
                    <span className="text-xs text-green-600 font-bold uppercase tracking-tight">Oferta Especial</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-medium">
                {product.description}
              </p>

              <div className="space-y-8 border-t border-gray-100 pt-8">

                {/* Model Selector (Only if models exist) */}
                {product.models.length > 1 && (
                  <div>
                    <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">Selecciona tu modelo</span></div>
                    <div className="relative">
                      <select
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[#1d1d1f] focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {product.models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors.length > 0 && (
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
                          className={`size-12 rounded-full relative shadow-sm transition-all hover:scale-105 ${selectedColor === c.name ? 'ring-2 ring-offset-2 ring-black scale-105' : ''}`}
                          style={{ backgroundColor: c.hex } as React.CSSProperties}
                          title={c.name}
                        >
                          {selectedColor === c.name && c.name === 'Blanco' && (
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Action - Hidden on mobile in favor of sticky bar */}
                <div className="hidden md:flex flex-col gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#1d1d1f] hover:bg-[#a5be31] hover:text-[#1d1d1f] text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined group-hover:animate-bounce">shopping_bag</span> Añadir a la Bolsa
                  </button>

                  <div className="flex items-center justify-center gap-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      Envío en 24h
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-[18px]">replay</span>
                      Devoluciones Gratis
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- New Section: Visual Features (Bento Grid) --- */}
      <section className="bg-[#f5f5f7] py-20 px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-[#1d1d1f]">Diseñado al detalle.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[250px]">
            {/* Card 1: MagSafe */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow min-h-[250px]">
              <div className="relative z-10 max-w-[70%] md:max-w-[60%]">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Magia MagSafe.</h3>
                <p className="text-gray-500 font-medium">Imanes alineados a la perfección para una carga inalámbrica rápida y un acople instantáneo.</p>
              </div>
              <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-green-50 rounded-full blur-3xl opacity-50"></div>
              {/* Decorative MagSafe Ring */}
              <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 border-[12px] border-gray-100 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
            </div>

            {/* Card 2: Material */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow min-h-[220px]">
              <div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <span className="material-symbols-outlined">touch_app</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Tacto de seda.</h3>
              </div>
              <p className="text-gray-500 font-medium text-sm">El acabado de silicona ofrece un agarre premium y antideslizante.</p>
            </div>

            {/* Card 3: Protection */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow min-h-[220px]">
              <div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Protección Total.</h3>
              </div>
              <p className="text-gray-500 font-medium text-sm">Interior de microfibra y bordes elevados para proteger la pantalla y cámaras.</p>
            </div>

            {/* Card 4: Compatibility */}
            <div className="lg:col-span-2 bg-[#1d1d1f] text-white rounded-[2rem] p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden min-h-[250px]">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Encaja como un guante.</h3>
                <p className="text-gray-400 font-medium max-w-md mx-auto">Diseñado meticulosamente para no añadir volumen extra a tu dispositivo.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-[#1d1d1f] to-gray-800"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- New Section: Tech Specs & Compatibility List --- */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[800px] mx-auto grid md:grid-cols-2 gap-12">

          {/* Tech Specs */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-2">Especificaciones</h3>
            <div className="space-y-4">
              {product.specs.length > 0 ? product.specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium text-sm">{spec.label}</span>
                  <span className="text-[#1d1d1f] font-bold text-sm">{spec.value}</span>
                </div>
              )) : (
                <p className="text-gray-400 text-sm">No hay especificaciones adicionales.</p>
              )}
            </div>
          </div>

          {/* Compatibility List */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-2">Compatibilidad</h3>
            <ul className="space-y-2">
              {product.compatibility.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">smartphone</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* --- What's in the box --- */}
      <section className="bg-[#fafafa] py-20 px-6 border-t border-gray-100 pb-40">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12 text-[#1d1d1f]">Contenido de la caja</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white shadow-sm rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                <img src={product.images[0]} className="h-24 md:h-32 object-contain mix-blend-multiply" alt={product.name} />
              </div>
              <span className="font-bold text-gray-900 text-sm">{product.name}</span>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white shadow-sm rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl text-gray-300">description</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Documentación</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pt-4 pb-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Total</span>
            <span className="text-2xl font-black text-[#1d1d1f] leading-none">S/ {product.price}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#111811] text-white h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Añadir
          </button>
        </div>
      </div>

      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div >
  );
};

export default ProductDetailAccessory;