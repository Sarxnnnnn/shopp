// src/contexts/CartContext.jsx
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // โหลดตะกร้าจาก backend เมื่อ login สำเร็จ
  useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn && user) {
        try {
          const res = await axios.get('http://localhost:5000/api/cart');
          setCartItems(res.data.cartItems || []);
        } catch (err) {
          console.error('Error fetching cart:', err);
        }
      }
    };
    fetchCart();
  }, [isLoggedIn, user]);

  const syncCartToServer = async (updatedCart) => {
    if (isLoggedIn) {
      try {
        await axios.post('http://localhost:5000/api/cart', { cartItems: updatedCart });
      } catch (err) {
        console.error('Error syncing cart:', err);
      }
    }
  };

  const clearCart = () => {
    const newCart = [];
    setCartItems(newCart);
    syncCartToServer(newCart);
  };

  const addToCart = (product) => {
    let newCart;
    const existingItem = cartItems.find(item => item.name === product.name);
    if (existingItem) {
      newCart = cartItems.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(newCart);
    syncCartToServer(newCart);
  };

  const removeFromCart = (name) => {
    const newCart = cartItems.filter(item => item.name !== name);
    setCartItems(newCart);
    syncCartToServer(newCart);
  };

  const increaseQuantity = (name) => {
    const newCart = cartItems.map(item =>
      item.name === name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(newCart);
    syncCartToServer(newCart);
  };

  const decreaseQuantity = (name) => {
    const newCart = cartItems.map(item =>
      item.name === name
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    setCartItems(newCart);
    syncCartToServer(newCart);
  };

  const getTotalPrice = useMemo(() => {
    return () => {
      return cartItems.reduce((total, item) => {
        const priceNumber = parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
        return total + priceNumber * item.quantity;
      }, 0);
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
