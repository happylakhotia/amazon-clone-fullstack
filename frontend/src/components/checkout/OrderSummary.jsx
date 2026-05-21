import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateOrderTotals } from "../../utils/calculateTotal";
import { IMAGE_PLACEHOLDER } from "../../utils/constants";
import "./OrderSummary.css";

const OrderSummary = ({ cartItems = [], address = null }) => {
  const { subtotal, tax, shipping, total } = calculateOrderTotals(cartItems);
  const itemCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="order-summary" id="order-summary">
      <h2 className="os-title">Order Summary</h2>

      {/* Items */}
      <div className="os-items">
        {cartItems.map((item) => (
          <div key={item.id} className="os-item">
            <div className="os-item-img-wrap">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="os-item-img"
                onError={(e) => {
                  e.target.src = IMAGE_PLACEHOLDER;
                }}
              />
              <span className="os-item-qty">{item.quantity}</span>
            </div>
            <div className="os-item-details">
              <p className="os-item-name">
                {item.name.length > 45 ? item.name.slice(0, 45) + "…" : item.name}
              </p>
              <p className="os-item-price">{formatCurrency(item.price)}</p>
            </div>
            <span className="os-item-total">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="os-divider" />

      {/* Totals */}
      <div className="os-totals">
        <div className="os-row">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="os-row">
          <span>Shipping</span>
          <span className={shipping === 0 ? "os-free" : ""}>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
        </div>
        <div className="os-row">
          <span>Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="os-divider" />

      <div className="os-total-row">
        <span>Order Total</span>
        <span className="os-grand-total">{formatCurrency(total)}</span>
      </div>

      {/* Shipping address */}
      {address && address.firstName && (
        <>
          <div className="os-divider" />
          <div className="os-address">
            <p className="os-address-title">Ships to:</p>
            <p>{address.firstName} {address.lastName}</p>
            <p>{address.address}{address.apartment ? `, ${address.apartment}` : ""}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p>{address.phone}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
