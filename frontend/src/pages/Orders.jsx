import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdLocalShipping } from "react-icons/md";
import { loadOrders } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { IMAGE_PLACEHOLDER } from "../utils/constants";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await loadOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "1.2rem", color: "#666" }}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <MdLocalShipping size={70} className="orders-empty-icon" />
            <h2>No orders yet</h2>
            <p>When you place orders, they'll appear here so you can track them.</p>
            <Link to="/" className="orders-shop-btn" id="start-shopping-orders">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card" id={`order-${order.id}`}>
                <div className="order-card-header">
                  <div className="order-meta">
                    <div>
                      <span className="order-meta-label">ORDER PLACED</span>
                      <span className="order-meta-value">
                        {new Date(order.placedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="order-meta-label">TOTAL</span>
                      <span className="order-meta-value">
                        {formatCurrency(order.totals.total)}
                      </span>
                    </div>
                    <div>
                      <span className="order-meta-label">SHIP TO</span>
                      <span className="order-meta-value order-ship-to">
                        {order.address.firstName} {order.address.lastName}
                      </span>
                    </div>
                  </div>
                  <div className="order-id-block">
                    <span className="order-meta-label">ORDER # {order.id}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-status">
                    <MdLocalShipping size={18} className="order-status-icon" />
                    <span>
                      {order.status} – Estimated delivery:{" "}
                      <strong>
                        {new Date(order.estimatedDelivery).toLocaleDateString(
                          "en-US",
                          { weekday: "short", month: "short", day: "numeric" }
                        )}
                      </strong>
                    </span>
                  </div>

                  <div className="order-items-row">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-thumb">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="order-item-img"
                          onError={(e) => {
                            e.target.src = IMAGE_PLACEHOLDER;
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="order-item-names">
                    {order.items.map((item) => (
                      <p key={item.id} className="order-item-name">
                        {item.name.length > 60
                          ? item.name.slice(0, 60) + "…"
                          : item.name}{" "}
                        ×{item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
