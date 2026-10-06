import { createContext, useContext, useReducer, useEffect, useState } from 'react';


const CartContext = createContext();

const initialState = {
  cartItems: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'LOAD_CART':
      return {
        ...state,
        cartItems: action.payload,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [settings, setSettings] = useState({
    deliveryFee: 3.99,
    taxPercentage: 8,
    currency: 'USD',
  });

  // Load cart
  useEffect(() => {
    const saved = localStorage.getItem('savorhub_cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch (err) {
        console.error('Failed to load cart', err);
      }
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('savorhub_cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Load settings
  const loadSettings = () => {
    const saved = localStorage.getItem('savorhub_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({
          deliveryFee: parsed.deliveryFee ?? 3.99,
          taxPercentage: parsed.taxPercentage ?? 8,
          currency: parsed.currency ?? 'USD',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  const addToCart = (item, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
      },
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? settings.deliveryFee : 0;
  const tax = subtotal * (settings.taxPercentage / 100);
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        tax,
        grandTotal,
        currency: settings.currency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}