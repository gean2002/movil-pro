import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  variantId: string; // Shopify Variant ID
  name: string;
  price: number;
  image: string;
  color: string;
  storage: string;
  condition: 'Nuevo' | 'Reacondicionado';
  selectedOptions?: { name: string; value: string }[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Determine storage key
  const getStorageKey = () => {
    if (user && user.email) {
      return `cart_${user.email}`;
    }
    return 'cart_guest';
  };

  // Load items from local storage whenever the user changes (or on mount)
  useEffect(() => {
    const key = getStorageKey();
    const storedItems = localStorage.getItem(key);
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Failed to parse cart items:', error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [user]); // Re-run when user changes

  // Save items to local storage whenever items change
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, user]);

  // Calculate total price
  const cartTotal = items.reduce((total, item) => total + item.price, 0);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    // Generate a unique ID for the cart instance (internal use)
    // We keep variantId separate for Shopify checkout
    const uniqueItem = { ...item, id: `${item.variantId}-${Date.now()}` };
    setItems((prev) => [...prev, uniqueItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};