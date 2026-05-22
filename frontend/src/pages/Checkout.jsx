import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import AddressForm from "../components/checkout/AddressForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentButton from "../components/checkout/PaymentButton";
import PaymentModal from "../components/checkout/PaymentModal";
import { placeOrder } from "../services/orderService";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { calculateOrderTotals } from "../utils/calculateTotal";
import { formatCurrency } from "../utils/formatCurrency";
import { IMAGE_PLACEHOLDER } from "../utils/constants";
import "./Checkout.css";

const STEPS = ["Shipping", "Payment", "Review"];

const validateAddress = (data) => {
  const errors = {};
  if (!data.firstName?.trim()) errors.firstName = "First name is required";
  if (!data.lastName?.trim()) errors.lastName = "Last name is required";
  if (!data.address?.trim()) errors.address = "Address is required";
  if (!data.city?.trim()) errors.city = "City is required";
  if (!data.state?.trim()) errors.state = "State is required";
  if (!data.zipCode?.trim()) errors.zipCode = "PIN code is required";
  else if (!/^\d{6}$/.test(data.zipCode)) errors.zipCode = "Enter a valid 6-digit PIN code";
  if (!data.phone?.trim()) errors.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(data.phone)) errors.phone = "Enter a valid 10-digit mobile number";
  return errors;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({});
  const [errors, setErrors] = useState({});

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [publishableKey, setPublishableKey] = useState("");

  const totals = calculateOrderTotals(cartItems);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          const nameParts = (profile.name || "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setAddress({
            firstName,
            lastName,
            phone: profile.phone || "",
            address: profile.address || "",
            apartment: profile.apartment || "",
            city: profile.city || "",
            state: profile.state || "",
            zipCode: profile.zipCode || "",
          });
        }
      } catch (err) {
        console.warn("Failed to load user profile in checkout:", err.message);
      }
    };
    loadProfile();

    const fetchConfig = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/config`);
        if (res.ok) {
          const data = await res.json();
          setPublishableKey(data.publishableKey);
        }
      } catch (err) {
        console.warn("Failed to fetch Stripe config from backend, falling back:", err.message);
      }
    };
    fetchConfig();
  }, []);

  const handleAddressNext = () => {
    const errs = validateAddress(address);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorField = document.getElementById(Object.keys(errs)[0]);
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsPaymentLoading(true);
    try {
      await updateUserProfile({
        name: `${address.firstName} ${address.lastName}`.trim(),
        phone: address.phone,
        address: address.address,
        apartment: address.apartment,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/create-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": localStorage.getItem("amazon_user")
              ? JSON.parse(localStorage.getItem("amazon_user"))?.id || "user-001"
              : "user-001",
          },
        }
      );

      let intentData = { isSimulated: true, clientSecret: "pi_sim_secret_offline" };
      if (response.ok) {
        intentData = await response.json();
      }

      setPaymentIntent(intentData);
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.warn("Payment intent generation offline fallback:", err.message);
      setPaymentIntent({ isSimulated: true, clientSecret: "pi_sim_secret_offline" });
      setIsPaymentModalOpen(true);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsPaymentModalOpen(false);
    try {
      const order = await placeOrder({ address, cartItems, totals });
      clearCart();
      navigate("/order-success", { state: { order, paymentDetails } });
    } catch (err) {
      console.error("Failed to place order after successful payment:", err);
    }
  };

  if (cartItems.length === 0 && step !== 2) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-steps" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`checkout-step ${i === step ? "checkout-step--active" : ""} ${i < step ? "checkout-step--done" : ""}`}
            >
              <div className="checkout-step-num">
                {i < step ? "✓" : i + 1}
              </div>
              <span className="checkout-step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 0 && (
              <div className="checkout-section">
                <AddressForm
                  formData={address}
                  errors={errors}
                  onChange={setAddress}
                />
                <div className="checkout-nav-btns">
                  <button className="checkout-back" onClick={() => navigate("/cart")}>
                    ← Return to Cart
                  </button>
                  <button
                    className="checkout-next"
                    onClick={handleAddressNext}
                    id="continue-to-payment"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="checkout-section">
                <div className="payment-section">
                  <h2 className="checkout-section-title">Payment Method</h2>
                  <p className="payment-info">
                    This is a demo app. No real payment will be processed.
                  </p>
                  <PaymentButton
                    onPlaceOrder={() => setStep(2)}
                    disabled={false}
                  />
                </div>
                <div className="checkout-nav-btns">
                  <button className="checkout-back" onClick={() => setStep(0)}>
                    ← Back to Shipping
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="checkout-section">
                <div className="review-section">
                  <h2 className="checkout-section-title">Review Your Order</h2>
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>Shipping Address</h3>
                      <button className="review-edit" onClick={() => setStep(0)}>Edit</button>
                    </div>
                    <p>{address.firstName} {address.lastName}</p>
                    <p>{address.address}{address.apartment ? `, ${address.apartment}` : ""}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.phone}</p>
                  </div>
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>Items ({cartItems.length})</h3>
                    </div>
                    {cartItems.map((item) => (
                      <div key={item.id} className="review-item">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="review-item-img"
                          onError={(e) => {
                            e.target.src = IMAGE_PLACEHOLDER;
                          }}
                        />
                        <div className="review-item-info">
                          <p className="review-item-name">{item.name}</p>
                          <p className="review-item-qty">Qty: {item.quantity}</p>
                        </div>
                        <p className="review-item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    className="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={isPaymentLoading}
                    id="confirm-place-order"
                  >
                    {isPaymentLoading ? "Preparing Secure Payment..." : "✓ Place Order"}
                  </button>
                </div>
                <div className="checkout-nav-btns">
                  <button className="checkout-back" onClick={() => setStep(1)}>
                    ← Back to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="checkout-sidebar">
            <OrderSummary cartItems={cartItems} address={step >= 1 ? address : null} />
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        clientSecret={paymentIntent?.clientSecret}
        isSimulated={paymentIntent?.isSimulated ?? true}
        publishableKey={publishableKey}
        orderTotal={totals.total}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Checkout;
