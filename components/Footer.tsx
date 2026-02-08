import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#e5e5e5] pt-16 pb-8 text-[#86868b] text-xs">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* 1. Información de la Empresa */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="block w-32">
              <img src="/logo.png" alt="Movil Pro" className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="leading-relaxed max-w-sm">
              Movil Pro es una tienda independiente de tecnología premium en Perú, que vende productos originales de Apple y Samsung, con garantía propia y envíos a todo el país.
            </p>
            <div className="flex gap-4 mt-2">
              {/* Social Icons */}
              <a href="https://www.facebook.com/movil.prope/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all duration-300 text-gray-600 border border-gray-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/movilpro.peru/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all duration-300 text-gray-600 border border-gray-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.981-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.981 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@movil.pro" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all duration-300 text-gray-600 border border-gray-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.01.23 2.06.94 2.76 1.02 1.02 2.65 1.25 3.91.56 1.05-.53 1.69-1.61 1.83-2.76.11-2.92.03-5.85.03-8.77l-.02-9.28z" />
                </svg>
              </a>
              <a href="https://wa.me/51989000015" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all duration-300 text-gray-600 border border-gray-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Navegación Rápida */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-bold text-[#1d1d1f] text-sm uppercase tracking-wide">Explorar</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="hover:text-[#1d1d1f] hover:underline transition-colors">Inicio</Link>
              <Link to="/smartphones" className="hover:text-[#1d1d1f] hover:underline transition-colors">Smartphones</Link>
              <Link to="/tablets" className="hover:text-[#1d1d1f] hover:underline transition-colors">Tablets</Link>
              <Link to="/laptops" className="hover:text-[#1d1d1f] hover:underline transition-colors">Computadoras</Link>

              <Link to="/audio" className="hover:text-[#1d1d1f] hover:underline transition-colors">Auriculares</Link>
              <Link to="/accessories" className="hover:text-[#1d1d1f] hover:underline transition-colors">Accesorios</Link>
              <Link to="/promociones" className="hover:text-[#1d1d1f] hover:underline transition-colors font-medium text-[#e63946]">Promociones</Link>
            </div>
          </div>

          {/* 3. Soporte y Contacto */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-bold text-[#1d1d1f] text-sm uppercase tracking-wide">Soporte</h4>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#1d1d1f]">Atención al Cliente</span>
                <a href="mailto:movilpro120@gmail.com" className="hover:text-[#1d1d1f] transition-colors">movilpro120@gmail.com</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#1d1d1f]">WhatsApp (Soporte)</span>
                <a href="https://wa.me/51989000015" target="_blank" rel="noreferrer" className="hover:text-[#a5be31] transition-colors font-medium flex items-center gap-1">
                  +51 989 000 015
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#1d1d1f]">Horario</span>
                <span className="leading-relaxed">Lun - Sáb: 10:00 am - 9:00 pm<br />Dom: 10:00 am - 2:00 pm</span>
              </div>
              <div className="mt-2 group">
                <span className="font-semibold text-[#1d1d1f] block mb-2 uppercase text-[10px] tracking-widest">Ubícanos</span>
                <a
                  href="https://www.google.com/maps/place/MovilPro/@-8.1308952,-79.0364153,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d000b0ef767:0x2f36504f390d7627!8m2!3d-8.1308952!4d-79.0338404!16s%2Fg%2F11v_59dl0s?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="block relative w-full h-24 rounded-xl overflow-hidden border border-gray-200 group-hover:border-[#a5be31] transition-all duration-300 bg-gray-100"
                >
                  {/* CSS Map Placeholder */}
                  <div className="w-full h-full flex items-center justify-center relative bg-[#f0f0f0]">
                    <div className="absolute inset-0 opacity-[0.08]" style={{
                      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                      backgroundSize: '8px 8px'
                    }}></div>
                    <span className="material-symbols-outlined text-[32px] text-red-500 drop-shadow-sm transform -translate-y-1 group-hover:scale-110 transition-transform">location_on</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-[9px] text-white p-1 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    VER EN GOOGLE MAPS
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Newsetter */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-bold text-[#1d1d1f] text-sm uppercase tracking-wide">Novedades</h4>
            <p className="leading-relaxed mb-2">Recibe promociones y novedades exclusivas de Movil Pro.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
              />
              <button className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-lg font-semibold hover:bg-black transition-colors w-full">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* 4. Legal / Políticas */}
        <div className="border-t border-[#d2d2d7] pt-8 flex flex-col gap-6">
          <div className="p-4 bg-gray-100 rounded-lg text-[11px] leading-relaxed text-gray-500 border border-gray-200">
            <strong className="text-gray-700 block mb-1">Nota Legal:</strong>
            Movil Pro es una tienda independiente. Apple, iPhone, iPad, MacBook, Apple Watch y Samsung son marcas registradas de sus respectivos propietarios. Movil Pro no está afiliado ni respaldado por estas marcas. Las imágenes mostradas en este sitio web son referenciales.
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
            <p>Copyright © {new Date().getFullYear()} Movil Pro. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/legal/privacy" className="hover:text-[#1d1d1f] hover:underline transition-colors">Política de privacidad</Link>
              <Link to="/legal/terms" className="hover:text-[#1d1d1f] hover:underline transition-colors">Términos y condiciones</Link>
              <Link to="/legal/warranty" className="hover:text-[#1d1d1f] hover:underline transition-colors">Garantía Movil Pro</Link>
              <Link to="/legal/shipping" className="hover:text-[#1d1d1f] hover:underline transition-colors">Política de envíos</Link>
              <Link to="/legal/returns" className="hover:text-[#1d1d1f] hover:underline transition-colors">Cambios y devoluciones</Link>
              <Link to="/legal/disclaimer" className="hover:text-[#1d1d1f] hover:underline transition-colors">Aviso de Imágenes</Link>
            </div>
          </div>

          {/* Credits */}
          <div className="border-t border-[#d2d2d7] mt-8 pt-8 text-center">
            <p className="text-[10px] text-gray-400">
              Sitio web creado por <a href="https://digitalab.app" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-black font-semibold transition-colors">DigitaLab.app</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;