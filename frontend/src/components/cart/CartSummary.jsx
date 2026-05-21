import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateOrderTotals } from "../../utils/calculateTotal";
import Button from "../ui/Button";
import "./CartSummary.css";

const CartSummary = ({ showCheckoutBtn = true }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { subtotal, tax, shipping, total } = calculateOrderTotals(cartItems);
  const itemCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="cart-summary" id="cart-summary">
      <div className="cs-promo">
        <span className="cs-promo-check">✓</span>
        <span>
        Your order qualifies for{" "}
        <strong>FREE Shipping</strong>
      </span>
      </div>

      <div className="cs-body">
        <div className="cs-row cs-subtotal">
          <span>
            Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):
          </span>
          <span className="cs-subtotal-price">{formatCurrency(subtotal)}</span>
        </div>

        <div className="cs-row">
          <span>Shipping & handling:</span>
          <span className={shipping === 0 ? "cs-free" : ""}>
            {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </span>
        </div>

        <div className="cs-row">
          <span>GST (18%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <div className="cs-divider" />

        <div className="cs-row cs-total">
          <span>Order total:</span>
          <span className="cs-total-price">{formatCurrency(total)}</span>
        </div>
      </div>

      {showCheckoutBtn && (
        <Button
          id="proceed-to-checkout"
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/checkout")}
          disabled={cartItems.length === 0}
          className="cs-checkout-btn"
        >
          <MdLock size={16} />
          Proceed to checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
