import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AnnouncementBar from './AnnouncementBar';
import { searchProducts } from '../lib/shopify';

// Search results type based on Shopify response
type SearchResult = {
  id: string;
  name: string;
  category: string;
  price: string;
  link: string;
  image: string;
  available: boolean;
};

const navLinks = [
  {
    name: 'SMARTPHONES',
    path: '/smartphones',
    subcategories: [
      { name: 'iPhone', path: '/smartphones/iphone' },
      { name: 'Samsung', path: '/smartphones/samsung' },
    ]
  },
  {
    name: 'TABLETS',
    path: '/tablets',
    subcategories: [
      { name: 'iPad', path: '/tablets/ipad' },
    ]
  },
  {
    name: 'COMPUTADORAS',
    path: '/computadoras',
    subcategories: [
      { name: 'MacBook Air', path: '/computadoras/macbook-air' },

    ]
  },
  {
    name: 'AURICULARES',
    path: '/audio',
    subcategories: [
      { name: 'AirPods', path: '/audio/airpods' },
    ]
  },
  {
    name: 'ACCESORIOS',
    path: '/accesorios',
  },
  {
    name: 'REACONDICIONADOS',
    path: '/reacondicionados',
  },
  {
    name: 'PROMOCIONES',
    path: '/promociones',
  },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine active state
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/smartphones' && (location.pathname === '/smartphones' || location.pathname.includes('/product/new'))) return true;
    if (path === '/refurbished' && (location.pathname === '/refurbished' || location.pathname.includes('/product/refurb'))) return true;
    if (path === '/accessories' && location.pathname.includes('accessories')) return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClass = (path: string) => {
    if (path === '/promociones') {
      return isActive(path)
        ? "text-[rgb(239,68,68)] text-sm md:text-xs font-bold transition-colors"
        : "text-[rgb(239,68,68)] hover:text-red-700 text-sm md:text-xs font-medium transition-colors";
    }
    return isActive(path)
      ? "text-black text-sm md:text-xs font-bold transition-colors"
      : "text-[#86868b] hover:text-black text-sm md:text-xs font-medium transition-colors";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedMobileCategory(prev => prev === categoryName ? null : categoryName);
  };

  // Search Logic
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // Debounce for 400ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        navigate(searchResults[0].link);
        handleSearchClose();
      }
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e5e5e5]">
          <div className="relative mx-auto flex h-[56px] md:h-[64px] max-w-[1200px] items-center justify-between px-4 md:px-6">

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden z-10">
              <button
                className="p-2 -ml-2 text-[#1d1d1f]"
                onClick={toggleMenu}
                aria-label="Menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-4 md:gap-4 md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 z-0">
              <Link to="/" className="flex items-center cursor-pointer group shrink-0" onClick={() => setIsMenuOpen(false)}>
                <img src="/logo.png" alt="Movil Pro Logo" className="h-[40px] md:h-[56px] object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 justify-center gap-4 xl:gap-6 px-4 h-full items-center">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group h-full flex items-center">
                  {link.subcategories ? (
                    <span className={`${getLinkClass(link.path)} flex items-center gap-1 py-4 cursor-default`}>
                      {link.name}
                    </span>
                  ) : (
                    <Link to={link.path} className={`${getLinkClass(link.path)} flex items-center gap-1 py-4`}>
                      {link.name}
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  {link.subcategories && (
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-[220px]">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 flex flex-col">
                        {link.subcategories.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="px-5 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors font-medium text-left"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-3 z-10">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#1d1d1f] hover:text-[#a5be31] transition-colors flex items-center justify-center"
                aria-label="Buscar"
              >
                <span className="material-symbols-outlined text-[24px] md:text-[22px]">search</span>
              </button>

              <Link to="/service" className="p-2 text-[#1d1d1f] hover:text-[#a5be31] transition-colors flex items-center justify-center" aria-label="Soporte Técnico">
                <span className="material-symbols-outlined text-[24px] md:text-[22px]">support_agent</span>
              </Link>

              <Link to={isAuthenticated ? "/account" : "/login"} className="hidden sm:flex text-[11px] font-bold text-[#1d1d1f] hover:text-black uppercase tracking-wide">
                {isAuthenticated ? (user ? user.firstName : "Mi Cuenta") : "Iniciar sesión"}
              </Link>
              <Link to="/cart" className="relative flex items-center justify-center p-2 text-[#1d1d1f] hover:text-[#a5be31] transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span className="material-symbols-outlined text-[24px] md:text-[22px]">shopping_bag</span>
                {items.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-[#a5be31] border border-white">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-[800px] mx-auto pt-6 px-4 md:px-6">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-gray-400 text-2xl">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar iPhone, fundas, cargadores..."
                className="flex-1 bg-transparent text-2xl md:text-3xl font-bold text-[#1d1d1f] placeholder-gray-300 outline-none border-none p-0 focus:ring-0"
              />
              {isSearching ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#a5be31] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <button
                  onClick={handleSearchClose}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-500 text-lg">close</span>
                </button>
              )}
            </div>

            {/* Results Grid */}
            <div className="overflow-y-auto max-h-[80vh] pb-20">
              {searchQuery.trim() !== '' && searchResults.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>No se encontraron resultados para "{searchQuery}"</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {searchResults.length > 0 && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resultados</span>
                  )}
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={handleSearchClose}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-1 border border-gray-100 flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base font-bold text-[#1d1d1f] group-hover:text-blue-600 transition-colors">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <span className="text-sm font-bold text-[#1d1d1f]">{item.price}</span>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-600">chevron_right</span>
                    </Link>
                  ))}

                  {/* Quick Links Suggestions when empty */}
                  {searchQuery === '' && (
                    <div className="flex flex-col gap-4 mt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Búsquedas Rápidas</span>
                      <div className="flex flex-wrap gap-2">
                        {['iPhone 15 Pro', 'Funda MagSafe', 'Reacondicionados', 'AirPods'].map(term => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} pt-[80px]`}>
        <nav className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Navegación</span>
            {navLinks.map((link) => (
              <div key={link.name} className={`flex flex-col ${link.name === 'PROMOCIONES' || link.name === 'REACONDICIONADOS' ? 'mt-4' : link.name === 'ACCESORIOS' ? 'mt-3' : ''}`}>
                <div className="flex items-center justify-between">
                  <div
                    className="flex-1 text-xl font-black text-[#1d1d1f] cursor-pointer"
                    onClick={() => {
                      if (link.subcategories) {
                        toggleMobileCategory(link.name);
                      } else {
                        // If no subcategories, navigate and close menu
                        // But since we are using a div, we need to manually trigger navigation or use Link
                        toggleMenu();
                        // This is a bit hacky with the div. Let's use Link if no subs, or just button if subs.
                      }
                    }}
                  >
                    {!link.subcategories ? (
                      <Link to={link.path} onClick={toggleMenu} className="block w-full">
                        {link.name}
                      </Link>
                    ) : (
                      <span>{link.name}</span>
                    )}
                  </div>
                  {link.subcategories && (
                    <button
                      onClick={() => toggleMobileCategory(link.name)}
                      className="p-2 -mr-2 text-gray-50"
                    >
                      <span className={`material-symbols-outlined transition-transform duration-300 ${expandedMobileCategory === link.name ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                  )}
                </div>

                {/* Mobile Subcategories */}
                {link.subcategories && (
                  <div className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${expandedMobileCategory === link.name ? 'max-h-[500px] mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {link.subcategories.map(sub => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="text-base font-medium text-gray-600 hover:text-black"
                        onClick={toggleMenu}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cuenta</span>
            <Link to={isAuthenticated ? "/account" : "/login"} className="flex items-center gap-3 text-lg font-bold text-[#1d1d1f]" onClick={toggleMenu}>
              <span className="material-symbols-outlined">account_circle</span>
              {isAuthenticated ? (user ? user.firstName : "Mi Cuenta") : "Iniciar sesión"}
            </Link>
            <Link to="/cart" className="flex items-center gap-3 text-lg font-bold text-[#1d1d1f]" onClick={toggleMenu}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Mi Carrito ({items.length})
            </Link>
          </div>


        </nav>
      </div>
    </>
  );
};

export default Navbar;