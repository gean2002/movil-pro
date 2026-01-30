import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shopifyClient, createCheckout } from '../lib/shopify';

interface ShopifyContextType {
    checkout: any;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItemToCheckout: (variantId: string, quantity: number) => Promise<void>;
    removeItemFromCheckout: (lineItemId: string) => Promise<void>;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider = ({ children }: { children: ReactNode }) => {
    const [checkout, setCheckout] = useState<any>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        // Initialize checkout on load
        const initCheckout = async () => {
            // Check for existing checkout ID in localStorage
            const existingCheckoutId = localStorage.getItem('shopify_checkout_id');
            if (existingCheckoutId) {
                try {
                    const checkout = await shopifyClient.checkout.fetch(existingCheckoutId);
                    if (!checkout.completedAt) {
                        setCheckout(checkout);
                        return;
                    }
                } catch (e) {
                    console.log('Expired or invalid checkout, creating new one');
                }
            }

            const newCheckout = await createCheckout();
            if (newCheckout) {
                setCheckout(newCheckout);
                localStorage.setItem('shopify_checkout_id', newCheckout.id);
            }
        };

        initCheckout();
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addItemToCheckout = async (variantId: string, quantity: number) => {
        if (!checkout) return;
        const lineItemsToAdd = [{ variantId, quantity }];
        const newCheckout = await shopifyClient.checkout.addLineItems(checkout.id, lineItemsToAdd);
        setCheckout(newCheckout);
        openCart();
    };

    const removeItemFromCheckout = async (lineItemId: string) => {
        if (!checkout) return;
        const newCheckout = await shopifyClient.checkout.removeLineItems(checkout.id, [lineItemId]);
        setCheckout(newCheckout);
    }

    return (
        <ShopifyContext.Provider value={{
            checkout,
            isCartOpen,
            openCart,
            closeCart,
            addItemToCheckout,
            removeItemFromCheckout
        }}>
            {children}
        </ShopifyContext.Provider>
    );
};

export const useShopify = () => {
    const context = useContext(ShopifyContext);
    if (context === undefined) {
        throw new Error('useShopify must be used within a ShopifyProvider');
    }
    return context;
};
