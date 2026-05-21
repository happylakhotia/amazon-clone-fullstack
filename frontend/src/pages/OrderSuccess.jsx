import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdLocalShipping } from "react-icons/md";
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

  return (
    <div className="order-success-page" id="order-success-page">
      <div className="container">
        <div className="os-card">
          {/* Success header */}
          <div className="os-header">
            <MdCheckCircle size={60} className="os-check-icon" />
            <div>
              <h1 className="os-headline">Order placed, thank you!</h1>
              <p className="os-sub">Confirmation will be sent to your email.</p>
            </div>
          </div>

          <div className="os-divider-line" />

          {/* Order details */}
          <div className="os-details-grid">
            <div className="os-detail-block">
              <h2 className="os-detail-title">Order Details</h2>
              <table className="os-detail-table">
                <tbody>
                  <tr>
                    <td>Order #</td>
                    <td className="os-order-id" id="order-id">{order.id}</td>
                  </tr>
                  <tr>
                    <td>Placed on</td>
                    <td>{placedDate}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td className="os-status">{order.status}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td className="os-total">{formatCurrency(order.totals.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="os-detail-block">
              <h2 className="os-detail-title">Delivery Information</h2>
              <div className="os-delivery-info">
                <MdLocalShipping size={24} className="os-delivery-icon" />
                <div>
                  <p className="os-delivery-label">Estimated Delivery</p>
                  <p className="os-delivery-date">{deliveryDate}</p>
                </div>
              </div>
              <div className="os-address-block">
                <p className="os-address-label">Shipping to:</p>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.address}</p>
                <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
              </div>
            </div>
          </div>

          <div className="os-divider-line" />

          {/* Items */}
          <div className="os-items-section">
            <h2 className="os-detail-title">Items Ordered</h2>
            <div className="os-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="os-order-item">
                  <div className="os-order-item-img-wrap">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="os-order-item-img"
                      onError={(e) => {
                        e.target.src = IMAGE_PLACEHOLDER;
                      }}
                    />
                    <span className="os-order-item-qty">{item.quantity}</span>
                  </div>
                  <div className="os-order-item-info">
                    <p className="os-order-item-name">{item.name}</p>
                    <p className="os-order-item-price">{formatCurrency(item.price)} each</p>
                  </div>
                  <p className="os-order-item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="os-actions">
            <Link to="/" className="os-continue-btn" id="continue-shopping-btn">
              Continue Shopping
            </Link>
            <Link to="/orders" className="os-orders-btn" id="view-orders-btn">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
