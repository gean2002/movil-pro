import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TrustBadges from '../components/TrustBadges';

const NewListing: React.FC = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const products = [
    { name: 'iPhone 15 Pro Max', price: 'S/ 1.199', color: 'Titanio Natural', availableStorages: ['256GB', '512GB', '1TB'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwmC_NBvwTsL1PbMtaaZ6x2BbCUJx7OYmWTB9CRgQOCauZkTd1eNCKnwgRY6cuogkSzWwLCjsu7OsZIC7GmsCzSTHqvCr9RfqkBnHE546qWx1ruLGtAMCwAoXqmCWjMqDiwfbFo-MvfbGaVXtK6yuUUSl8Otf_ou4d11_jeVXBAGbU58lFc40-dcraZwgRg3ncl3UN_go51xDY8diwUhqaQgyFE6OR3iBMA1rVvfl_C0iL5ly53SyC0OSAm1YIaAFzXfLYF3lsCREw', tag: 'Nuevo', status: 'En Stock', colors: ['#8E8D8A', '#1F2C45'], link: '/product/new/15-pro-max' },
    { name: 'Samsung Galaxy S24 Ultra', price: 'S/ 1.459', color: 'Titanium Gray', availableStorages: ['256GB', '512GB', '1TB'], image: 'https://images.samsung.com/is/image/samsung/p6pim/es/2401/gallery/es-galaxy-s24-s928-sm-s928bztpeub-539343015?$650_519_PNG$', tag: 'Nuevo', status: 'En Stock', colors: ['#5C5B57', '#F2F1EC'], link: '#' },
    { name: 'Samsung Galaxy Z Fold6', price: 'S/ 2.009', color: 'Silver Shadow', availableStorages: ['256GB', '512GB'], image: 'https://images.samsung.com/is/image/samsung/p6pim/es/sm-f956bzkbeub/gallery/es-galaxy-z-fold6-f956-sm-f956bzkbeub-542385619?$1300_1038_PNG$', tag: 'Nuevo', status: 'Preventa', colors: ['#BCC1C5', '#1A5DA4'], link: '#' },
    { name: 'iPhone 15 Pro', price: 'S/ 999', color: 'Titanio Azul', availableStorages: ['128GB', '256GB', '512GB', '1TB'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQ4scAAXPYJZx4Q96dezYYlBb69bqBzaxSJ43VNQKxHN76oR4UyMC9uSaMkdT17n_LdUVdYk6qNl4FsfNmc8KmsPisbvKG92rIhsyJZMnqQm8hTwizpRuI8t7wfGGq5y3UtWXwf6ERrDP05QKkgIvCz_U1Ild_BOJIJR-Kbeq36ktUxYm1004_R8ZQvYcadf5jT5lv_X0jsKp1zS2Aq-uFIVBDnsH58QQXquNCZLcLmjdjb1OEFeS2dN0PWPyWNVnQ18jPOtZ-aql', tag: 'Nuevo', status: 'En Stock', colors: ['#1F2C45', '#3C3C3D'], link: '/product/new/15-pro' },
    { name: 'iPhone 14 Plus', price: 'S/ 799', color: 'Amarillo', availableStorages: ['128GB', '256GB', '512GB'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFg8kQ0SBbseEcq2eA-dHwV2lDHKvWOxM_SRfu4EETI1EZV3HyddWYAvi9rJnUmrd8t8b7p2bREUmCY7uFUBVK2smZrbVVbA7z-7FXUfHmk4jAdflx-1Kiai_-2Uo-n69n0rpPoGid2cQevz1ctlwyft6UByMUZUi6ujCw7KJuMu3yHVQxUTHMu8ZgvoYj_v2ORwLI3yO3WCKSQB7wHRiCabxfIN6q8f4eN5loenW66RlOTr5k-xHatt9iNxIkCXF8CQrytrCzZ_E3', tag: 'Nuevo', status: 'En Stock', colors: ['#FBF7CD', '#222222', '#F2F1EC'], link: '/product/new/14-plus' },
    { name: 'iPhone SE', price: 'S/ 429', color: 'Blanco Estrella', availableStorages: ['64GB', '128GB', '256GB'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-swZedSO92Nqjx4L7C7vKDNocCBN0ZwoToB-b4gN0B7fq41Xix6NKEXEHPmOOATl9G1did8gRnTlya_UlNktLhYvtcQBHajmTCJ08DQ7MQlCnfuBOBfiu535ZU-CsapoehE1sAltleRbeev5BeAzkPMsfBqcn1EZr3r8BXsNLYjlBfxafVaCmQO8IpjfbCiqqY8xRakgORMgKE-94bNe5D1Wvr62I01IC23NkoJLADaiVa7duRwGqWl0ZYfckkiKkOsBj8yZB9FeX', tag: 'Nuevo', status: 'En Stock', colors: ['#F2F1EC', '#222222', '#BF0010'], link: '/product/new/se' },
  ];

  const FiltersContent = () => (
    <>
      <div className="flex justify-between items-baseline md:hidden mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-[#111811]">Filtrar por</h2>
        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex justify-between items-baseline hidden md:flex">
        <h2 className="text-lg font-bold text-[#111811]">Filtros</h2>
        <button className="text-sm text-gray-400 underline decoration-1 underline-offset-2 hover:text-black transition-colors">
          Borrar Todo
        </button>
      </div>

      {/* Model Filter */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Modelo</h3>
        <div className="space-y-3">
          {['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14'].map((model, idx) => (
            <label key={model} className="flex items-center gap-3 cursor-pointer group py-1 md:py-0">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  defaultChecked={idx === 0}
                  className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-[#a5be31] checked:border-[#a5be31] transition-colors cursor-pointer"
                />
                <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
              </div>
              <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors flex-1">{model}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Almacenamiento</h3>
        <div className="flex flex-wrap gap-2">
          {['128GB', '256GB', '512GB', '1TB'].map((storage, idx) => (
            <button
              key={storage}
              className={`px-4 py-2 md:py-1.5 rounded-full text-xs font-bold border transition-all ${idx === 0 ? 'bg-[#a5be31] border-[#a5be31] text-[#111811]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {['#3C3C3D', '#F2F1EC', '#1F2C45', '#8E8D8A', '#E5DDEA', '#FBF7CD', '#D4F0E0', '#C7DBEB'].map(color => (
            <button
              key={color}
              className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-[#111811]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-black text-white font-bold py-4 rounded-xl mt-8 md:hidden">
        Ver 62 Productos
      </button>
    </>
  );

  return (
    <div className="w-full bg-[#fafafa] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
              <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-black">iPhone Nuevos</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#111811] mb-2 md:mb-4 tracking-tight leading-none">
              iPhone Nuevos
            </h1>
            <p className="text-gray-500 text-sm md:text-lg max-w-2xl">
              Explora la última tecnología de Apple. Totalmente nuevos, precintados y con garantía oficial.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#f0f9ff] text-[#0369a1] px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-sm border border-[#e0f2fe] shrink-0 self-start md:self-auto">
            <span className="material-symbols-outlined text-[18px] md:text-[20px] filled">verified</span>
            Garantía Movil Pro
          </div>
        </div>

        <TrustBadges />

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden flex gap-3 mb-4 sticky top-[60px] z-20">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 bg-white border border-gray-200 text-[#111811] font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">tune</span> Filtros
            </button>
            <button className="bg-white border border-gray-200 text-[#111811] font-bold py-3 px-4 rounded-xl shadow-sm">
              <span className="material-symbols-outlined">sort</span>
            </button>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
            <FiltersContent />
          </aside>

          {/* Mobile Filters Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
              <div className="bg-white w-full max-w-[320px] h-full p-6 overflow-y-auto animate-[slideLeft_0.3s_ease-out]">
                <FiltersContent />
              </div>
            </div>
          )}

          {/* Grid */}
          <main className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <span className="font-bold text-[#111811]">62 productos encontrados</span>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Ordenar por:</span>
                <select className="border-none bg-transparent font-bold text-[#111811] text-sm focus:ring-0 p-0 cursor-pointer">
                  <option>Destacados</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-12">
              {products.map((product, idx) => (
                <div key={idx} className="bg-white rounded-xl md:rounded-2xl p-3 relative hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                    <span className={`text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${product.tag === 'Oferta' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'}`}>
                      {product.tag}
                    </span>
                  </div>

                  {/* Image */}
                  <Link to={product.link} className="aspect-[4/5] w-full flex items-center justify-center mb-3 bg-[#f8fafc] rounded-xl relative overflow-hidden mt-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent)] opacity-60"></div>
                    <img src={product.image} alt={product.name} className="h-[80%] md:h-[85%] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                  </Link>

                  {/* Info */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-[#111811] leading-tight group-hover:text-[#a5be31] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex -space-x-1 shrink-0 pl-1">
                      {product.colors && product.colors.map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2 md:mb-4 flex-wrap">
                    {product.availableStorages && product.availableStorages.map((storage) => (
                      <span key={storage} className="text-[9px] md:text-[10px] text-gray-400 font-medium py-0.5 bg-gray-50 px-1.5 rounded border border-gray-100 uppercase">
                        {storage}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-base md:text-lg font-black text-[#111811] tracking-tight">{product.price}</span>
                    </div>
                    <Link to={product.link} className="h-7 w-7 md:h-8 md:w-8 bg-[#111811] rounded-full flex items-center justify-center text-white hover:bg-[#a5be31] hover:text-[#111811] transition-all shadow-md active:scale-95">
                      <span className="material-symbols-outlined text-[14px] md:text-[16px]">shopping_cart</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button className="w-full md:w-auto bg-white border border-gray-200 text-[#111811] font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                Cargar Más Productos
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </main>
        </div>
      </div>
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default NewListing;