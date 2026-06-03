import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();
const CART_KEY = 'mf_cart';

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i),
          isOpen: true
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }], isOpen: true };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { items: [], isOpen: false };
    default:
      return state;
  }
};

function initCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return { items: Array.isArray(items) ? items : [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  // Persist cart items (not the open/closed UI state) across reloads.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [state.items]);

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  );
};
