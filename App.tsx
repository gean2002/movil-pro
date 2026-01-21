import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NewListing from './pages/NewListing';
import RefurbishedListing from './pages/RefurbishedListing';
import AccessoriesListing from './pages/AccessoriesListing';
import ProductDetailNew from './pages/ProductDetailNew';
import ProductDetailRefurb from './pages/ProductDetailRefurb';
import ProductDetailAccessory from './pages/ProductDetailAccessory';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryListing from './pages/CategoryListing';
import TechnicalService from './pages/TechnicalService';
import ExpertTips from './pages/ExpertTips';
import Financing from './pages/Financing';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import Warranty from './pages/Legal/Warranty';
import Shipping from './pages/Legal/Shipping';
import Returns from './pages/Legal/Returns';
import Disclaimer from './pages/Legal/Disclaimer';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';



// A wrapper to handle conditional rendering of Header/Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    // Automatically scroll to top whenever the pathname changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // FIX: Handle cases where email clients strip the '#' from the URL
    useEffect(() => {
        const path = window.location.pathname;
        if (path.startsWith('/reset-password') && !window.location.hash) {
            // Redirect from /reset-password/... to /#/reset-password/...
            window.location.href = `${window.location.origin}/#${path}`;
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <WhatsAppButton />

            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <HashRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/smartphones" element={<CategoryListing categoryType="smartphones" />} />
                            <Route path="/reacondicionados" element={<RefurbishedListing />} />
                            <Route path="/accesorios" element={<AccessoriesListing />} />
                            <Route path="/smartphones/:handle" element={<ProductDetailNew />} />
                            <Route path="/computadoras/:handle" element={<ProductDetailNew />} />
                            <Route path="/relojes/:handle" element={<ProductDetailNew />} />
                            <Route path="/tablets/:handle" element={<ProductDetailNew />} />
                            <Route path="/audio/:handle" element={<ProductDetailNew />} />
                            <Route path="/reacondicionados/:brand/:id" element={<ProductDetailRefurb />} />
                            <Route path="/accesorios/:category/:id" element={<ProductDetailAccessory />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                            <Route path="/account" element={<Account />} />

                            {/* Subcategory Routes */}
                            <Route path="/smartphones/iphone" element={<CategoryListing categoryType="iphone" />} />
                            <Route path="/smartphones/samsung" element={<CategoryListing categoryType="samsung" />} />

                            <Route path="/tablets" element={<CategoryListing categoryType="tablets" />} />
                            <Route path="/tablets/ipad" element={<CategoryListing categoryType="ipad" />} />

                            <Route path="/computadoras" element={<CategoryListing categoryType="computadoras" />} />
                            <Route path="/computadoras/macbook-air" element={<CategoryListing categoryType="macbook-air" />} />
                            <Route path="/computadoras/macbook-pro" element={<CategoryListing categoryType="macbook-pro" />} />

                            <Route path="/relojes" element={<CategoryListing categoryType="relojes" />} />
                            <Route path="/relojes/apple-watch" element={<CategoryListing categoryType="apple-watch" />} />
                            <Route path="/relojes/galaxy-watch" element={<CategoryListing categoryType="galaxy-watch" />} />

                            <Route path="/audio" element={<CategoryListing categoryType="audio" />} />
                            <Route path="/audio/airpods" element={<CategoryListing categoryType="airpods" />} />
                            <Route path="/audio/samsung-buds" element={<CategoryListing categoryType="samsung-buds" />} />

                            <Route path="/promociones" element={<CategoryListing categoryType="promociones" />} />

                            {/* Blog / Content Routes */}
                            <Route path="/blog/battery-tips" element={<ExpertTips />} />
                            <Route path="/service" element={<TechnicalService />} />
                            <Route path="/financing" element={<Financing />} />

                            {/* Legal Routes */}
                            <Route path="/legal/privacy" element={<Privacy />} />
                            <Route path="/legal/terms" element={<Terms />} />
                            <Route path="/legal/warranty" element={<Warranty />} />
                            <Route path="/legal/shipping" element={<Shipping />} />
                            <Route path="/legal/returns" element={<Returns />} />
                            <Route path="/legal/disclaimer" element={<Disclaimer />} />
                        </Routes>
                    </Layout>
                </HashRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;