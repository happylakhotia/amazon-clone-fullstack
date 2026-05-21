import { createContext, useContext, useReducer, useEffect } from "react";
import {
  loadCart,
  addToCart as apiAddToCart,
  updateQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  saveCartOffline,
  loadWishlist,
  saveWishlist,
} from "../services/cartService";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cartItems: action.payload };

    case "ADD_TO_CART": {
      const existing = state.cartItems.find((i) => i.id === action.payload.id || i.productId === action.payload.id);
      let updatedCart;
      if (existing) {
        updatedCart = state.cartItems.map((i) =>
          (i.id === action.payload.id || i.productId === action.payload.id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Formulate a cart-compatible object
        const newCartItem = {
          id: action.payload.id,
          productId: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          originalPrice: action.payload.originalPrice,
          images: action.payload.images,
          stock: action.payload.stock,
          soldBy: action.payload.soldBy,
          quantity: 1,
        };
        updatedCart = [...state.cartItems, newCartItem];
      }
      return { ...state, cartItems: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const updatedCart = state.cartItems.filter(
        (i) => i.id !== action.payload && i.productId !== action.payload
      );
      return { ...state, cartItems: updatedCart };
    }

    case "UPDATE_QUANTITY": {
      const updatedCart = state.cartItems.map((i) =>
        (i.id === action.payload.id || i.productId === action.payload.id)
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      return { ...state, cartItems: updatedCart };
    }

    case "CLEAR_CART":
      return { ...state, cartItems: [] };

    case "TOGGLE_WISHLIST": {
      const isInWishlist = state.wishlistItems.find(
        (i) => i.id === action.payload.id
      );
      const updatedWishlist = isInWishlist
        ? state.wishlistItems.filter((i) => i.id !== action.payload.id)
        : [...state.wishlistItems, action.payload];
      return { ...state, wishlistItems: updatedWishlist };
    }

    case "REMOVE_FROM_WISHLIST": {
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (i) => i.id !== action.payload
        ),
      };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [], // Initialize empty; loadCart will populate asynchronously
    wishlistItems: loadWishlist(),
  });

  // Load database cart items asynchronously on mount
  useEffect(() => {
    const fetchCart = async () => {
      const dbCart = await loadCart();
      dispatch({ type: "SET_CART", payload: dbCart });
    };
    fetchCart();
  }, []);

  // Persist current state to localStorage as cache fallback
  useEffect(() => {
    saveCartOffline(state.cartItems);
  }, [state.cartItems]);

  useEffect(() => {
    saveWishlist(state.wishlistItems);
  }, [state.wishlistItems]);

  const addToCart = async (product) => {
    // 1. Optimistic UI update
    dispatch({ type: "ADD_TO_CART", payload: product });
    
    // 2. Synchronize with database in background
    await apiAddToCart(product.id);
  };

  const removeFromCart = async (productId) => {
    // 1. Optimistic UI update
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
    
    // 2. Synchronize with database in background
    await apiRemoveFromCart(productId);
  };

  const updateQuantity = async (productId, quantity) => {
    // 1. Optimistic UI update
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
    
    // 2. Synchronize with database in background
    await apiUpdateQuantity(productId, quantity);
  };

  const clearCart = async () => {
    // 1. Optimistic UI update
    dispatch({ type: "CLEAR_CART" });
    
    // 2. Synchronize with database in background
    await apiClearCart();
  };

  const toggleWishlist = (product) =>
    dispatch({ type: "TOGGLE_WISHLIST", payload: product });

  const removeFromWishlist = (productId) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });

  const isInCart = (productId) =>
    state.cartItems.some((i) => i.productId === productId || i.id === productId);

  const isInWishlist = (productId) =>
    state.wishlistItems.some((i) => i.id === productId);

  const cartCount = state.cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        isInCart,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
};

export default CartContext;
