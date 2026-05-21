import { Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { formatCurrency } from "../utils/formatCurrency";
import "./Cart.css";

const Cart = () => {
  const { cartItems, clearCart } = useCart();

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <MdShoppingCart size={80} className="cart-empty-icon" />
            <h2>Your Amazon Cart is empty</h2>
            <p>Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics, and more.</p>
            <Link to="/" className="cart-empty-btn" id="continue-shopping">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-col">
              <div className="cart-items-card">
                <div className="cart-header">
                  <h2 className="cart-items-title">Shopping Cart</h2>
                  <button
                    className="cart-deselect-link"
                    onClick={clearCart}
                    id="clear-cart"
                  >
                    Clear Cart
                  </button>
                  <span className="cart-price-header">Price</span>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="cart-subtotal-row">
                  <span className="cart-subtotal-label">
                    Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items):
                  </span>
                  <span className="cart-subtotal-amount">
                    {formatCurrency(cartItems.reduce((a, i) => a + i.price * i.quantity, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-col">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
