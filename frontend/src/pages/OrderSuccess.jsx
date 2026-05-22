import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import { formatCurrency } from "../utils/formatCurrency";
import { IMAGE_PLACEHOLDER } from "../utils/constants";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  const placedDate = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate totals defensively to ensure visual reliability
  const subtotal = order.totals?.subtotal ?? (order.totals?.total - (order.totals?.shipping ?? 0) - (order.totals?.tax ?? 0)) ?? order.totals?.total;
  const shipping = order.totals?.shipping ?? 0;
  const tax = order.totals?.tax ?? 0;
  const total = order.totals?.total;

  return (
    <div className="order-success-page" id="order-success-page">
      <div className="container">
        <div className="os-grid-layout">
          {/* Left Column: Details & Items */}
          <div className="os-left-col">
            {/* Banner card */}
            <div className="os-card os-banner-card">
              <div className="os-banner-header">
                <div className="os-checkmark-circle">
                  <MdCheck size={28} className="os-checkmark-icon" />
                </div>
                <div className="os-banner-text">
                  <h1 className="os-headline" id="order-placed-heading">Order placed, thank you!</h1>
                  <p className="os-sub-text">
                    Confirmation will be sent to your email.
                  </p>
                  <p className="os-info-note">
                    You can manage your order, track shipping, or request returns in the <Link to="/orders" className="os-inline-link">Your Orders</Link> section.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Package Card */}
            <div className="os-card os-delivery-card">
              <div className="os-delivery-header">
                <h2 className="os-delivery-title">
                  Delivery Estimate: <span className="os-delivery-date">{deliveryDate}</span>
                </h2>
                <div className="os-package-badge">Package 1 of 1</div>
              </div>

              <div className="os-delivery-items-list">
                {order.items.map((item) => (
                  <div key={item.id} className="os-delivery-item">
                    <div className="os-item-image-wrapper">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="os-item-image"
                        onError={(e) => {
                          e.target.src = IMAGE_PLACEHOLDER;
                        }}
                      />
                      {item.quantity > 1 && (
                        <span className="os-item-qty-badge">{item.quantity}</span>
                      )}
                    </div>
                    <div className="os-item-content">
                      <Link to={`/product/${item.id}`} className="os-item-name-link">
                        {item.name}
                      </Link>
                      <div className="os-item-meta-info">
                        <span className="os-item-price-tag">
                          {formatCurrency(item.price)} each
                        </span>
                        {item.quantity > 1 && (
                          <span className="os-item-qty-text">
                            &middot; Qty: {item.quantity}
                          </span>
                        )}
                      </div>
                      <p className="os-item-shipping-speed">
                        Eligible for FREE Shipping
                      </p>
                    </div>
                    <div className="os-item-row-total">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details & Summary Invoice */}
            <div className="os-card os-details-card">
              <div className="os-details-grid">
                {/* Shipping info */}
                <div className="os-details-section">
                  <h3 className="os-details-section-title">Shipping Address</h3>
                  <div className="os-shipping-address-content">
                    <p className="os-recipient-name">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="os-address-line">{order.address.address}</p>
                    {order.address.apartment && (
                      <p className="os-address-line">{order.address.apartment}</p>
                    )}
                    <p className="os-address-line">
                      {order.address.city}, {order.address.state} {order.address.zipCode}
                    </p>
                    {order.address.phone && (
                      <p className="os-address-phone">Phone: {order.address.phone}</p>
                    )}
                  </div>
                </div>

                {/* Billing Summary / Invoice */}
                <div className="os-details-section">
                  <h3 className="os-details-section-title">Order Summary</h3>
                  <div className="os-invoice-table">
                    <div className="os-invoice-row">
                      <span className="os-invoice-label">Items Subtotal:</span>
                      <span className="os-invoice-value">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="os-invoice-row">
                      <span className="os-invoice-label">Shipping & Handling:</span>
                      <span className="os-invoice-value">
                        {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="os-invoice-divider" />
                    <div className="os-invoice-row">
                      <span className="os-invoice-label">Total before tax:</span>
                      <span className="os-invoice-value">
                        {formatCurrency(subtotal + shipping)}
                      </span>
                    </div>
                    <div className="os-invoice-row">
                      <span className="os-invoice-label">Estimated tax to be collected:</span>
                      <span className="os-invoice-value">{formatCurrency(tax)}</span>
                    </div>
                    <div className="os-invoice-divider os-divider-thick" />
                    <div className="os-invoice-row os-invoice-grand-total">
                      <span className="os-invoice-label">Grand Total:</span>
                      <span className="os-invoice-value">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="os-card-footer-info">
                <span className="os-order-id-label">Order ID: </span>
                <span className="os-order-id-val" id="order-id">{order.id}</span>
                <span className="os-footer-dot">&middot;</span>
                <span className="os-placed-time-label">Placed on: </span>
                <span className="os-placed-time-val">{placedDate}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Promos */}
          <div className="os-right-col">
            {/* Action Box */}
            <div className="os-card os-actions-card">
              <h3 className="os-actions-header">What's next?</h3>
              <div className="os-actions-buttons">
                <Link to="/" className="os-amazon-primary-btn" id="continue-shopping-btn">
                  Continue Shopping
                </Link>
                <Link to="/orders" className="os-amazon-secondary-btn" id="view-orders-btn">
                  Go to your Orders
                </Link>
              </div>
              <p className="os-actions-policy">
                You can cancel or change your items before they enter shipping status. Check your order progress for options.
              </p>
            </div>

            {/* Prime Banner Promo */}
            <div className="os-prime-promo-card">
              <div className="os-prime-logo-wrapper">
                <span className="os-prime-logo-text">amazon</span>
                <span className="os-prime-logo-prime">prime</span>
              </div>
              <p className="os-prime-promo-bold">
                Get unlimited FREE Fast Delivery with Prime
              </p>
              <p className="os-prime-promo-text">
                Enjoy fast delivery, exclusive deals, and popular award-winning movies & TV shows.
              </p>
              <a
                href="https://www.amazon.com/prime"
                target="_blank"
                rel="noopener noreferrer"
                className="os-prime-try-btn"
              >
                Try Prime FREE for 30 Days
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
