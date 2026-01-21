import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CategoryBrowser from '../components/CategoryBrowser';
import ProductCard from '../components/ProductCard';

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

const Home: React.FC = () => {
  const { addToCart } = useCart();
  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-white">


      {/* Hero Section */}
      {/* Hero Section */}
      {/* Mobile Design: Image stack + Content below */}
      {/* Hero Section */}
      {/* Mobile Design: Image stack + Content below */}
      <div className="block md:hidden w-full bg-[#f5f5f7]">
        <img
          src="/images/hero-new.jpg"
          alt="Movil Pro Tienda"
          className="w-full h-auto object-contain shadow-sm"
        />
        <div className="px-6 py-8 text-center bg-[#f5f5f7] text-[#1d1d1f] -mt-2 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#a5be31]/20 border border-[#a5be31] text-[#6d8015] font-bold text-[10px] uppercase tracking-widest mb-4 backdrop-blur-md">
            Garantía Móvil Pro
          </span>
          <h1 className="text-4xl font-black mb-4 leading-tight text-[#1d1d1f]">
            Tecnología <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ba125] to-[#a5be31]">en tus manos</span>
          </h1>
          <p className="text-gray-500 font-medium mb-8 text-sm">
            Tu destino premium para smartphones y servicio técnico especializado.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/smartphones"
              className="inline-flex items-center justify-center gap-2 bg-[#a5be31] text-black px-6 py-3 rounded-xl font-bold text-base shadow-lg w-full active:scale-95 transition-transform"
            >
              Ver Catálogo
              <span className="material-symbols-outlined filled text-[20px]">grid_view</span>
            </Link>
            <Link
              to="/service"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1f] border border-gray-200 px-6 py-3 rounded-xl font-bold text-base shadow-sm w-full active:scale-95 transition-transform hover:bg-gray-50"
            >
              Servicio Técnico
              <span className="material-symbols-outlined text-[20px]">build</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Design: Immersive Background Cover */}
      <section className="hidden md:block relative w-full h-[550px] overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-new.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-6 flex flex-col justify-center items-start text-[#1d1d1f]">
          <RevealOnScroll>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#a5be31]/20 border border-[#a5be31] text-[#a5be31] font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
              Garantía Móvil Pro
            </span>
            <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
              Tecnología <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a5be31] to-emerald-400">en tus manos</span>
            </h1>
            <p className="text-xl lg:text-2xl font-medium max-w-xl mb-10 text-gray-700 leading-relaxed">
              Tu destino premium para smartphones, tablets y servicio técnico especializado.
            </p>
            <div className="flex gap-4">
              <Link
                to="/smartphones"
                className="inline-flex items-center gap-2 bg-[#a5be31] text-black px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:scale-105 transition-all shadow-lg"
              >
                Ver Catálogo
                <span className="material-symbols-outlined filled text-[20px]">grid_view</span>
              </Link>
              <Link
                to="/service"
                className="inline-flex items-center gap-2 bg-white/10 text-white backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl font-bold text-base hover:bg-white/20 transition-all hover:border-white/40"
              >
                Servicio Técnico
                <span className="material-symbols-outlined text-[20px]">build</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>


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
            {/* Card 1 - Updated to 17 Pro Max Orange */}
            <RevealOnScroll delay={300} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-black p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="text-xs font-bold text-[#ff6b00] mb-3 block tracking-wide animate-pulse">EL FUTURO ES NARANJA</span>
                <h3 className="text-3xl font-bold text-white mb-2">iPhone 17 Pro Max</h3>
                <p className="text-base text-gray-400 font-medium">Cámara 200MP. Titanio grado aeroespacial.</p>
                <div className="mt-6">
                  <Link to="/smartphones/iphone/iphone-17-pro-max" className="inline-block rounded-xl bg-[#ff6b00] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-all hover:scale-105 active:scale-95">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-0 top-32 flex justify-center items-end">
                {/* Abstract image representing the orange titanium finish */}
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110" style={{ backgroundImage: "url('/images/iphone17promax_card.jpg')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
            </RevealOnScroll>

            {/* Card 2 - Updated to Samsung S24 Ultra */}
            <RevealOnScroll delay={100} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f5f5f7] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                <span className="text-xs font-bold text-blue-600 mb-3 block tracking-wide uppercase">Galaxy AI is here</span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">Samsung Galaxy S24 Ultra</h3>
                <p className="text-base text-gray-500 font-medium">El smartphone más avanzado con potencia de IA.</p>
                <div className="mt-6">
                  <Link to="/smartphones/samsung/samsung-s24-ultra" className="inline-block rounded-xl bg-[#1d1d1f] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[65%] flex justify-center items-end pb-8">
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/images/samsung-s24-ultra.png')" }}></div>
              </div>
            </RevealOnScroll>

            {/* Card 3 - MacBook Pro M3 */}
            <RevealOnScroll delay={200} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#fafafa] border border-gray-100 p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                <span className="text-xs font-bold text-purple-600 mb-3 block tracking-wide uppercase">Potencia Desatada</span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">MacBook Pro 14" M3</h3>
                <p className="text-base text-gray-500 font-medium">El chip más avanzado en una laptop pro.</p>
                <div className="mt-6">
                  <Link to="/computadoras/macbook-pro/macbook-pro-14-m3" className="inline-block rounded-xl bg-black text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[60%] flex justify-center items-end pb-8">
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/images/macbook-pro-m3.png')" }}></div>
              </div>
            </RevealOnScroll>

            {/* Card 4 - Apple Watch Ultra 2 */}
            <RevealOnScroll delay={300} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f2f2f2] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                <span className="text-xs font-bold text-orange-600 mb-3 block tracking-wide uppercase">Aventura Extrema</span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">Apple Watch Ultra 2</h3>
                <p className="text-base text-gray-500 font-medium">El reloj definitivo para deportistas.</p>
                <div className="mt-6">
                  <Link to="/relojes/apple/apple-watch-ultra-2" className="inline-block rounded-xl border border-gray-300 text-[#1d1d1f] px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black hover:border-[#a5be31] transition-colors">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[60%] flex justify-center items-end pb-8">
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/images/apple-watch-ultra-2.png')" }}></div>
              </div>
            </RevealOnScroll>

            {/* Card 5 - AirPods Pro 2 */}
            <RevealOnScroll delay={400} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                <span className="text-xs font-bold text-green-600 mb-3 block tracking-wide uppercase">Sonido Mágico</span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">AirPods Pro 2ª Gen</h3>
                <p className="text-base text-gray-500 font-medium">Cancelación Activa de Ruido de vanguardia.</p>
                <div className="mt-6">
                  <Link to="/audio/apple/airpods-pro-2" className="inline-block rounded-xl bg-[#1d1d1f] text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[60%] flex justify-center items-end pb-8">
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/images/airpods-pro-2.png')" }}></div>
              </div>
            </RevealOnScroll>

            {/* Card 6 - iPad Air */}
            <RevealOnScroll delay={500} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f0f9ff] p-10 h-[560px] cursor-pointer shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-active:-translate-y-0">
                <span className="text-xs font-bold text-blue-500 mb-3 block tracking-wide uppercase">Ligero y Potente</span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-2">iPad Air</h3>
                <p className="text-base text-gray-500 font-medium">Diseño todo pantalla. Belleza que se nota.</p>
                <div className="mt-6">
                  <Link to="/tablets/apple/ipad-air" className="inline-block rounded-xl bg-black text-white px-5 py-2 text-sm font-bold hover:bg-[#a5be31] hover:text-black transition-colors">Reservar</Link>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[70%] flex justify-center items-end pb-8">
                <div className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out scale-[1.5] group-hover:scale-[1.6] origin-bottom" style={{ backgroundImage: "url('/images/ipad-air.png')" }}></div>
              </div>
            </RevealOnScroll>
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
            {/* Card 1 */}
            <RevealOnScroll delay={100} className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#faaf00]/30 hover:-translate-y-2">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#faaf00] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">AHORRA S/ 330</span>
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gray-50 group-hover:bg-[#faaf00]/5 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd9-FWZQD33v-L-xGQ_-q51m8C5U5uVKRzN6yf0AW5Yj5PyMp5Aaw9DVjd3NUf3Cb-4Kwole2A5on0Wv9J4x0SGEafIS189TgSu0ubZuoeh11FxlXMEOzqlJJ3pD74j-PiF3OcXdTyarlgwljIwj_Ds-CeG1iMeRdn92E1_8WdZ6egv8nt4lZa673Um4J3lrWnGypWV92nnEl-sZ0RiznNv-PrLNyrakv852xt42rZKNvy6dEr28I4G9Wg8u18BEemuE5311I8k19l"
                  alt="iPhone 14 Pro"
                  className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#faaf00] transition-colors">iPhone 14 Pro</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#1d1d1f]">S/ 989</span>
                  <span className="text-sm text-gray-400 line-through decoration-1">S/ 1.319</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); addToCart({ id: 'iphone-14-pro-refurb', name: 'iPhone 14 Pro (Reacondicionado)', price: 989, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9-FWZQD33v-L-xGQ_-q51m8C5U5uVKRzN6yf0AW5Yj5PyMp5Aaw9DVjd3NUf3Cb-4Kwole2A5on0Wv9J4x0SGEafIS189TgSu0ubZuoeh11FxlXMEOzqlJJ3pD74j-PiF3OcXdTyarlgwljIwj_Ds-CeG1iMeRdn92E1_8WdZ6egv8nt4lZa673Um4J3lrWnGypWV92nnEl-sZ0RiznNv-PrLNyrakv852xt42rZKNvy6dEr28I4G9Wg8u18BEemuE5311I8k19l', color: 'Deep Purple', storage: '128GB', condition: 'Reacondicionado' }); }} className="w-full mt-2 py-2 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-[#a5be31] hover:text-black transition-colors shadow-md">Añadir</button>
              </div>
            </RevealOnScroll>

            {/* Card 2 */}
            <RevealOnScroll delay={200} className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#faaf00]/30 hover:-translate-y-2">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">POPULAR</span>
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gray-50 group-hover:bg-[#faaf00]/5 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2MKSoFYqDJXSQujOPjKrRCjUGMdfBWzqnJN_0XWvNoh0AbWTxZqggfiWAkQiNjz7UQq7bicYKcKld25Y_-xAw-kOM6ndchpPdQfD6ec6C21yNCva99SRUYdSKnzlxQcuMTQ7wQ_UYVfsuB5J2eJBMexLvIDkBBmNPZFd2gsDklXvRbrUc5y7ECeB47RWEklPRhINa_cgyZO-b74doNFx0zza6D8451Yo01HjmzUXoOSHWw1rc6CtSbLlaGz69P8448YOILFKJLhV0"
                  alt="iPhone 13"
                  className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#faaf00] transition-colors">iPhone 13</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#1d1d1f]">S/ 549</span>
                  <span className="text-sm text-gray-400 line-through decoration-1">S/ 899</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); addToCart({ id: 'iphone-13-refurb', name: 'iPhone 13 (Reacondicionado)', price: 549, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2MKSoFYqDJXSQujOPjKrRCjUGMdfBWzqnJN_0XWvNoh0AbWTxZqggfiWAkQiNjz7UQq7bicYKcKld25Y_-xAw-kOM6ndchpPdQfD6ec6C21yNCva99SRUYdSKnzlxQcuMTQ7wQ_UYVfsuB5J2eJBMexLvIDkBBmNPZFd2gsDklXvRbrUc5y7ECeB47RWEklPRhINa_cgyZO-b74doNFx0zza6D8451Yo01HjmzUXoOSHWw1rc6CtSbLlaGz69P8448YOILFKJLhV0', color: 'Midnight', storage: '128GB', condition: 'Reacondicionado' }); }} className="w-full mt-2 py-2 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-[#a5be31] hover:text-black transition-colors shadow-md">Añadir</button>
              </div>
            </RevealOnScroll>

            {/* Card 3 */}
            <RevealOnScroll delay={300} className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#faaf00]/30 hover:-translate-y-2">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#faaf00] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">-40%</span>
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gray-50 group-hover:bg-[#faaf00]/5 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCh5jg8-fAIbQsF1oIqzLKTrusVirHcdtevI6vBUpKZrGNZxosZs19KgeYcwkDAD0LF1jCPiWKLJgO8reLmXvbo9fPPwlX-4L_UaDvavQ9jbnyo7jMSjIePEe7wJVhiH0KcB-SCzkxCbGclnA3ggYpg48SUMYtL4AhEef5l2sClWpb0sM82kR-eCu9ltOD7cCCcLL6vW9LMenkwQQ4R69UQv2Rxx5psOoI9quMpKHrrUok4sp283ByTCFlF9mSz1j3peheDXzAv0C9"
                  alt="iPhone 13 Mini"
                  className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#faaf00] transition-colors">iPhone 13 Mini</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#1d1d1f]">S/ 499</span>
                  <span className="text-sm text-gray-400 line-through decoration-1">S/ 809</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); addToCart({ id: 'iphone-13-mini-refurb', name: 'iPhone 13 Mini (Reacondicionado)', price: 499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCh5jg8-fAIbQsF1oIqzLKTrusVirHcdtevI6vBUpKZrGNZxosZs19KgeYcwkDAD0LF1jCPiWKLJgO8reLmXvbo9fPPwlX-4L_UaDvavQ9jbnyo7jMSjIePEe7wJVhiH0KcB-SCzkxCbGclnA3ggYpg48SUMYtL4AhEef5l2sClWpb0sM82kR-eCu9ltOD7cCCcLL6vW9LMenkwQQ4R69UQv2Rxx5psOoI9quMpKHrrUok4sp283ByTCFlF9mSz1j3peheDXzAv0C9', color: 'Blue', storage: '128GB', condition: 'Reacondicionado' }); }} className="w-full mt-2 py-2 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-[#a5be31] hover:text-black transition-colors shadow-md">Añadir</button>
              </div>
            </RevealOnScroll>

            {/* Card 4 */}
            <RevealOnScroll delay={400} className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#faaf00]/30 hover:-translate-y-2">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-200">BÁSICO</span>
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gray-50 group-hover:bg-[#faaf00]/5 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw8XkQ_1ARRb0_aJxZmbHyhxv_mjc9emcJ8ofZqDmOAQo-7E-sLt30ajOeoCr3tT12DxDhbZoQC0lbe0581Z3aVkERGhIfz8fl2Pa9MIClwjH3ZLcOUU-Wfs7_ACcYVkQymlgEMMiGVft-hqyD-KyHfaK7AWPyKWT-mjZm9nZSHy3JHmDtf9p8McLIbs7XLFJoEgjiGCVs70Pgmc6bZbbq5zGUi6uvvEBtQz_z6dy_qnEe5g-VCy8_lwsBvwk_-Ksiqz7vcvjcgFlt"
                  alt="iPhone 12"
                  className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1d1d1f] group-hover:text-[#faaf00] transition-colors">iPhone 12</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#1d1d1f]">S/ 399</span>
                  <span className="text-sm text-gray-400 line-through decoration-1">S/ 759</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); addToCart({ id: 'iphone-12-refurb', name: 'iPhone 12 (Reacondicionado)', price: 399, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw8XkQ_1ARRb0_aJxZmbHyhxv_mjc9emcJ8ofZqDmOAQo-7E-sLt30ajOeoCr3tT12DxDhbZoQC0lbe0581Z3aVkERGhIfz8fl2Pa9MIClwjH3ZLcOUU-Wfs7_ACcYVkQymlgEMMiGVft-hqyD-KyHfaK7AWPyKWT-mjZm9nZSHy3JHmDtf9p8McLIbs7XLFJoEgjiGCVs70Pgmc6bZbbq5zGUi6uvvEBtQz_z6dy_qnEe5g-VCy8_lwsBvwk_-Ksiqz7vcvjcgFlt', color: 'Purple', storage: '64GB', condition: 'Reacondicionado' }); }} className="w-full mt-2 py-2 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-[#a5be31] hover:text-black transition-colors shadow-md">Añadir</button>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll className="mt-16 flex justify-center">
            <Link to="/reacondicionados" className="group inline-flex items-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#faaf00] transition-all duration-300 hover:shadow-lg hover:shadow-[#faaf00]/30 hover:-translate-y-1">
              Ver todos los reacondicionados
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </RevealOnScroll>


        </div>
      </section>

      {/* Accessories Bento Grid - Compact & Expert Tips */}
      <section className="bg-[#f5f5f7] py-16 px-4 md:px-6">
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
      </section>

      {/* Global Styles for Animations */}
      <style>{`
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
      `}</style>
    </div>
  );
};

export default Home;