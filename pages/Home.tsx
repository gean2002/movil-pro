import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CategoryBrowser from '../components/CategoryBrowser';
import Hero from '../components/Hero';
import { fetchCollectionWithProducts } from '../lib/shopify';

// Componente auxiliar para animar elementos cuando entran en pantalla
const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = "",
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const delayStyle = { transitionDelay: `${delay}ms` };

  return (
    <div
      ref={ref}
      style={delayStyle}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${className}`}
    >
      {children}
    </div>
  );
};

interface SimpleProduct {
  id: string;
  name: string;
  handle: string;
  price: string;
  compareAtPrice: string | null;
  image: string;
  category: string;
  tag: string;
}

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [newModels, setNewModels] = useState<SimpleProduct[]>([]);
  const [refurbishedModels, setRefurbishedModels] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        setLoading(true);

        // Fetch "New Models" - Try a specific collection or fallback to smartphones
        // Using 'smartphones' for now as the main category, assuming newest are first or we slice
        const newCollection = await fetchCollectionWithProducts('smartphones');

        // Fetch "Refurbished"
        const refurbCollection = await fetchCollectionWithProducts('reacondicionados');

        if (newCollection && newCollection.products) {
          // Take first 6 products for the grid, ideally sorted by date or a "featured" tag manually if needed
          // For now, we take the first 6 from the collection
          const mappedNew = newCollection.products.slice(0, 6).map((p: any) => mapToSimpleProduct(p, 'Smartphone'));
          setNewModels(mappedNew);
        }

        if (refurbCollection && refurbCollection.products) {
          // Take first 4 for the refined grid
          const mappedRefurb = refurbCollection.products.slice(0, 4).map((p: any) => mapToSimpleProduct(p, 'Reacondicionado', true));
          setRefurbishedModels(mappedRefurb);
        }

      } catch (error) {
        console.error("Failed to load home products", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeProducts();
  }, []);

  const mapToSimpleProduct = (p: any, defaultCategory: string, isRefurb: boolean = false): SimpleProduct => {
    const priceAmount = parseFloat(p.variants?.[0]?.price?.amount || '0');
    // Using currency code from response or defaulting to S/
    const currencyCode = p.variants?.[0]?.price?.currencyCode === 'PEN' ? 'S/' : (p.variants?.[0]?.price?.currencyCode || 'S/');

    // Check if there is a compare at price (offer)
    // Note: shopify-buy might wrap this differently depending on query, but usually variants have compareAtPrice
    // However, in our simple lib/shopify query we might need to ensure we fetch it. 
    // If our lib/shopify.ts doesn't fetch compareAtPriceV2, we might not get it. 
    // Assuming standard price for now. 

    // Determine tag based on availability or manual tags
    // For demo, standardizing tags
    let tag = '';
    if (!p.availableForSale) tag = 'Agotado';
    else if (isRefurb) tag = 'Reacondicionado';
    else if (priceAmount > 3000) tag = 'Gama Alta';

    return {
      id: p.id,
      name: p.title,
      handle: p.handle,
      price: `${currencyCode} ${priceAmount.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`,
      compareAtPrice: null, // Would need updating query in shopify.ts to get this
      image: p.images?.[0]?.src || '',
      category: defaultCategory,
      tag: tag
    };
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-white">
      {/* Hero Section */}
      {/* Mobile Design: Image stack + Content below */}
      {/* Hero Section */}
      <Hero />


      {/* Category Browser */}
      <CategoryBrowser />

      {/* New Models Section */}
      <section className="bg-white pt-8 pb-12 px-6">
        <div className="mx-auto max-w-[1200px]">
          <RevealOnScroll className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#1d1d1f]">La nueva generación.</h2>
              <p className="text-xl text-gray-500 mt-2 font-medium">Tecnología que redefine lo posible.</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[560px] bg-gray-100 rounded-[2rem] animate-pulse"></div>
              ))
            ) : newModels.length > 0 ? (
              newModels.map((product, index) => (
                <RevealOnScroll key={product.id} delay={index * 100} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f5f5f7] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                    <span className="text-xs font-bold text-blue-600 mb-3 block tracking-wide uppercase">{product.tag || 'NUEVO'}</span>
                    <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">{product.name}</h3>
                    <p className="text-base text-gray-500 font-medium line-clamp-2 md:max-w-[80%]">{/* Description placeholder or fetch if needed */}Lo último en tecnología.</p>
                    <div className="mt-6">
                      <Link to={`/smartphones/${product.handle}`} className="inline-block rounded-xl bg-[#1d1d1f] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[65%] flex justify-center items-end pb-8">
                    <div
                      className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${product.image || '/images/placeholder-phone.png'}')` }}
                    ></div>
                  </div>
                </RevealOnScroll>
              ))
            ) : (
              <>
                {/* Fallback Hardcoded Products if Fetch Fails or is Empty */}
                <RevealOnScroll className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f5f5f7] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                    <span className="text-xs font-bold text-blue-600 mb-3 block tracking-wide uppercase">NUEVO</span>
                    <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">Samsung S25 Ultra</h3>
                    <p className="text-base text-gray-500 font-medium line-clamp-2 md:max-w-[80%]">Diseño de titanio, nueva cámara y potencia sin límites.</p>
                    <div className="mt-6">
                      <Link to="/smartphones/samsung-galaxy-s25-ultra" className="inline-block rounded-xl bg-[#1d1d1f] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[75%] flex justify-center items-end pb-12">
                    <div
                      className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: "url('/images/samsung-s25-ultra-final.png')" }}
                    ></div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={100} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-black p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0 text-white">
                    <span className="text-xs font-bold text-[#a5be31] mb-3 block tracking-wide uppercase">PREMIUM</span>
                    <h3 className="text-3xl font-bold mb-2">iPhone 17 <br />Pro Max</h3>
                    <p className="text-base text-gray-400 font-medium line-clamp-2 md:max-w-[80%]">El iPhone definitivo.</p>
                    <div className="mt-6">
                      <Link to="/smartphones/iphone-17-pro-max" className="inline-block rounded-xl bg-white text-black px-5 py-2 text-sm font-bold hover:bg-[#a5be31] transition-colors">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[55%] flex justify-center items-end pb-6">
                    <div
                      className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: "url('/images/iphone-17-pro-max.png')" }}
                    ></div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f5f5f7] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                    <span className="text-xs font-bold text-orange-500 mb-3 block tracking-wide uppercase">OFERTA</span>
                    <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">AirPods Max</h3>
                    <p className="text-base text-gray-500 font-medium line-clamp-2 md:max-w-[80%]">Sonido de alta fidelidad. Cancelación Activa de Ruido. Magia pura.</p>
                    <div className="mt-6">
                      <Link to="/audio/airpods-max" className="inline-block rounded-xl bg-[#1d1d1f] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[55%] flex justify-center items-end pb-6">
                    <div
                      className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: "url('/images/airpods-max-new.png')" }}
                    ></div>
                  </div>
                </RevealOnScroll>
              </>
            )}
          </div>
        </div>
      </section>


      {/* Refurbished Section - Premium Redesign */}
      <section className="relative py-16 px-6 overflow-hidden bg-white">
        {/* Abstract Background - Subtle & Premium */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fcd34d20_0%,transparent_40%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#f3f4f6_0%,transparent_40%)] pointer-events-none"></div>

        <div className="mx-auto max-w-[1240px] relative z-10">
          <RevealOnScroll className="flex flex-col items-center text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black/5 text-black/70 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm border border-black/5">
              <span className="w-2 h-2 rounded-full bg-[#faaf00] animate-pulse"></span>
              Garantía Movil Pro
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#1d1d1f] mb-6 tracking-tight tight-shadow">
              Como nuevo.<br />
              <span className="text-gray-400">Mejor para todos.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Dispositivos rigurosamente inspeccionados y restaurados por expertos.
              Misma calidad, garantía de 1 año y un precio irrepetible.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse"></div>
              ))
            ) : refurbishedModels.length > 0 ? (
              refurbishedModels.map((product, index) => (
                <RevealOnScroll key={product.id} delay={index * 100} className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#faaf00]/30 hover:-translate-y-2">
                  <div className="absolute top-4 right-4 z-10">
                    {/* Dynamic discount badge could go here if we had compareAtPrice */}
                    <span className="bg-[#faaf00] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">OFERTA</span>
                  </div>
                  <Link to={`/reacondicionados/${product.handle}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gray-50 group-hover:bg-[#faaf00]/5 transition-colors duration-500 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </Link>
                  <div className="space-y-2">
                    <Link to={`/reacondicionados/${product.handle}`}>
                      <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#faaf00] transition-colors line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-[#1d1d1f]">{product.price}</span>
                      {/* Placeholder for compare price */}
                      {/* <span className="text-sm text-gray-400 line-through decoration-1">S/ 1.319</span> */}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price.replace(/[^0-9.]/g, '')), // Basic parse
                          image: product.image,
                          color: 'Default', // Would need variant selection used in ProductCard
                          storage: '128GB',
                          condition: 'Reacondicionado'
                        });
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-[#a5be31] hover:text-black transition-colors shadow-md"
                    >
                      Añadir
                    </button>
                  </div>
                </RevealOnScroll>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-lg font-medium text-gray-400">No hay productos reacondicionados disponibles en este momento.</p>
              </div>
            )}
          </div>

          <RevealOnScroll className="mt-16 flex justify-center">
            <Link to="/reacondicionados" className="group inline-flex items-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#faaf00] transition-all duration-300 hover:shadow-lg hover:shadow-[#faaf00]/30 hover:-translate-y-1">
              Ver todos los reacondicionados
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </RevealOnScroll>


        </div>
      </section >

      {/* Accessories Bento Grid - Compact & Expert Tips */}
      < section className="bg-[#f5f5f7] py-16 px-4 md:px-6" >
        <div className="mx-auto max-w-[1100px]">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1d1d1f] mb-8 md:mb-10 text-center md:text-left">Esenciales del Experto.</h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[320px]">
            {/* Large Card - MagSafe - Reduced padding */}
            <RevealOnScroll delay={100} className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white p-6 flex flex-col justify-center shadow-sm group hover:shadow-xl transition-all duration-500">
              <div className="z-10 max-w-[50%] transition-transform duration-500 group-hover:-translate-y-1">
                <span className="text-[#007aff] text-xs font-bold uppercase tracking-wider mb-2 block">Carga Inalámbrica</span>
                <h3 className="text-2xl md:text-4xl font-bold mb-2 text-[#1d1d1f]">MagSafe.</h3>
                <p className="text-gray-500 mb-4 font-medium text-sm md:text-base leading-tight">La forma más rápida y segura de cargar tu iPhone.</p>
                <Link to="/accesorios" className="inline-flex items-center gap-1 text-[#007aff] font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                  Ver colección <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="absolute right-[-20px] top-0 bottom-0 w-[55%] bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-magsafe-202309?wid=800&hei=1000&fmt=jpeg&qlt=90&.v=1692895066929')" }}></div>
            </RevealOnScroll>

            {/* Replacement Card - Full Bleed Photo Card */}
            <RevealOnScroll delay={200} className="lg:row-span-2 relative overflow-hidden rounded-[2rem] shadow-sm group hover:shadow-xl transition-all duration-500">
              <Link to="/blog/photography-tips" className="block w-full h-full relative cursor-pointer">
                <img
                  src="/images/camera-tips.jpg"
                  alt="Tips de Cámara Experts"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </Link>
            </RevealOnScroll>

            {/* Expert Tips Card - NEW */}
            <RevealOnScroll delay={300} className="relative overflow-hidden rounded-[2rem] bg-[#1d1d1f] p-8 flex flex-col justify-center shadow-sm hover:shadow-xl transition-all duration-300 group text-white">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">battery_charging_full</span>
              </div>
              <div className="z-10 relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#a5be31] animate-pulse">tips_and_updates</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Consejo Experto</span>
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">Cuida tu batería 🔋</h3>
                <ul className="text-gray-300 text-sm space-y-2 mb-4 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#a5be31] text-xs mt-1">●</span> Evita cargar hasta el 100% siempre.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#a5be31] text-xs mt-1">●</span> No dejes que baje del 20%.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#a5be31] text-xs mt-1">●</span> Usa cables certificados.
                  </li>
                </ul>
                <Link to="/blog/battery-tips" className="text-[#a5be31] text-sm font-bold hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1">
                  Leer guía completa <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </Link>
              </div>
            </RevealOnScroll>

            {/* Financing Card - Replaces Plan Renove */}
            <RevealOnScroll delay={400} className="relative overflow-hidden rounded-[2rem] bg-[#effef5] p-8 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="z-10 transition-transform duration-300 group-hover:translate-x-1">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm text-[#006e38]">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#004d27]">Financiación</h3>
                <p className="text-[#005c30] text-sm mb-6 font-medium leading-relaxed opacity-90 max-w-[90%]">
                  Paga a tu ritmo. Divide tu compra en cuotas cómodas y sin sorpresas.
                </p>
                <Link to="/financing" className="text-[#005c30] hover:text-[#003d20] font-black text-xs uppercase tracking-widest border-b-[2px] border-[#005c30] pb-1 hover:border-[#003d20] transition-all inline-block">
                  VER OPCIONES
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section >

      {/* Global Styles for Animations */}
      < style > {`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style >
    </div >
  );
};

export default Home;