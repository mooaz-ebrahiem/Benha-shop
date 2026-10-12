import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';

const StoreContext = createContext();

const CART_KEY = 'tech-components-cart';
const WISHLIST_KEY = 'tech-components-wishlist';

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: Math.min(quantity, product.stock) }];
    });

    setToast(`${product.name} added to cart`);
  };

  const buyNow = (product, quantity = 1) => {
    if (product.stock <= 0) {
      setToast(`${product.name} is out of stock`);
      return false;
    }

    const orderQuantity = Math.max(1, Math.min(quantity, product.stock));
    setCart([{ ...product, quantity: orderQuantity }]);
    return true;
  };

  const updateCartQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) return item;
          const nextQuantity = item.quantity + change;
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (productId) => {
    setWishlist((currentWishlist) => {
      if (currentWishlist.includes(productId)) return currentWishlist;
      return [...currentWishlist, productId];
    });
    setToast('Saved to wishlist');
  };

  const removeFromWishlist = (productId) => {
    setWishlist((currentWishlist) => currentWishlist.filter((id) => id !== productId));
  };

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const wishlistCount = wishlist.length;

  const getProductById = (productId) => products.find((product) => product.id === productId);

  const value = {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    toast,
    addToCart,
    buyNow,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    getProductById,
    setToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
