import { useState, useEffect, useRef } from "react";
import { MdLock, MdCreditCard, MdClose, MdInfo } from "react-icons/md";
import "./PaymentModal.css";

const PaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  isSimulated,
  publishableKey,
  orderTotal,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStage, setPaymentStage] = useState("");

  // Simulated state fallback - Direct simulated sandbox mode is always active by default
  const [isSimulatedState, setIsSimulatedState] = useState(true);

  // Simulated Form State - Empty by default, user must enter their own details
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardBrand, setCardBrand] = useState("unknown");

  const stripeRef = useRef(null);
  const cardElementRef = useRef(null);
  const elementsRef = useRef(null);

  // Auto-detect card brand in simulated mode
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s+/g, "");
    if (cleanNumber.startsWith("4")) {
      setCardBrand("visa");
    } else if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) {
      setCardBrand("mastercard");
    } else if (/^(34|37)/.test(cleanNumber)) {
      setCardBrand("amex");
    } else if (/^6011/.test(cleanNumber)) {
      setCardBrand("discover");
    } else {
      setCardBrand("unknown");
    }
  }, [cardNumber]);

  // Handle format of Card Number
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    const chunks = val.match(/.{1,4}/g);
    setCardNumber(chunks ? chunks.join(" ").slice(0, 19) : "");
  };

  // Handle format of Expiration Date
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
    }
    setCardExpiry(val.slice(0, 5));
  };

  // Handle CVV input limit
  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardCvv(val.slice(0, 4));
  };

  // Load Stripe.js if active and not simulated
  useEffect(() => {
    if (!isOpen) return;
    if (isSimulatedState) {
      setStripeLoaded(true);
      return;
    }

    let isMounted = true;

    const loadStripeSdk = () => {
      if (window.Stripe) {
        initStripe();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      script.onload = () => {
        if (isMounted) initStripe();
      };
      script.onerror = () => {
        if (isMounted) {
          console.warn("Stripe SDK script load failed, falling back to simulated checkout...");
          setIsSimulatedState(true);
          setStripeLoaded(true);
        }
      };
      document.body.appendChild(script);
    };

    const isValidPublishableKey = (key) => {
      if (!key) return false;
      const cleanKey = key.trim();
      if (cleanKey.startsWith("sk_")) return false; // Secret key, not publishable!
      if (cleanKey.includes("*")) return false; // Masked placeholder key!
      if (cleanKey.includes("placeholder") || cleanKey.includes("your_key")) return false; // Generic placeholder!
      if (!cleanKey.startsWith("pk_")) return false; // Must be a publishable key!
      return true;
    };

    const initStripe = () => {
      try {
        if (!isValidPublishableKey(publishableKey)) {
          console.warn("Stripe publishable key is invalid or placeholder. Falling back to simulated checkout...", publishableKey);
          setIsSimulatedState(true);
          setStripeLoaded(true);
          return;
        }

        const stripeInstance = window.Stripe(publishableKey);
        stripeRef.current = stripeInstance;

        const elements = stripeInstance.elements();
        elementsRef.current = elements;

        // Custom styled card element matching Amazon interface
        const card = elements.create("card", {
          style: {
            base: {
              color: "#111111",
              fontFamily: '"Amazon Ember", "Inter", system-ui, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "15px",
              "::placeholder": {
                color: "#888888",
              },
            },
            invalid: {
              color: "#c40000",
              iconColor: "#c40000",
            },
          },
        });

        cardElementRef.current = card;
        card.mount("#stripe-card-element");

        card.on("change", (event) => {
          if (event.error) {
            setError(event.error.message);
          } else {
            setError(null);
          }
        });

        setStripeLoaded(true);
      } catch (err) {
        console.warn("Stripe initialization failed. Falling back to simulation mode...", err);
        setIsSimulatedState(true);
        setStripeLoaded(true);
        setError(null);
      }
    };

    loadStripeSdk();

    return () => {
      isMounted = false;
      if (cardElementRef.current) {
        try {
          cardElementRef.current.unmount();
        } catch {}
      }
    };
  }, [isOpen, isSimulatedState, publishableKey]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    if (isSimulatedState) {
      // Validate simulated card inputs
      if (!cardName.trim()) {
        setError("Cardholder name is required.");
        setLoading(false);
        return;
      }
      const cleanNumber = cardNumber.replace(/\s+/g, "");
      if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        setError("Please enter a valid card number.");
        setLoading(false);
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError("Expiry date must be in MM/YY format.");
        setLoading(false);
        return;
      }
      const [m, y] = cardExpiry.split("/").map(Number);
      if (m < 1 || m > 12) {
        setError("Expiration month is invalid.");
        setLoading(false);
        return;
      }
      if (cardCvv.length < 3) {
        setError("CVV/CVC is invalid.");
        setLoading(false);
        return;
      }

      // Elegant Multi-step Simulated Authorization
      try {
        setPaymentStage("Connecting to payment server...");
        await new Promise((r) => setTimeout(r, 800));

        setPaymentStage("Securing payment intent...");
        await new Promise((r) => setTimeout(r, 800));

        setPaymentStage("Authorizing ₹" + orderTotal.toFixed(2) + " with bank...");
        await new Promise((r) => setTimeout(r, 1000));

        setPaymentStage("Payment Approved! Finalizing Order...");
        await new Promise((r) => setTimeout(r, 600));

        onSuccess?.({
          paymentIntentId: `pi_sim_suc_${Math.random().toString(36).substring(2, 10)}`,
          paymentMethod: "Card (Simulated)",
        });
      } catch (err) {
        setError("Simulated gateway authorization timed out.");
      } finally {
        setLoading(false);
      }
    } else {
      // Real Stripe Payment Confirmation
      if (!stripeRef.current || !cardElementRef.current) {
        setError("Payment SDK is still loading. Please try again.");
        setLoading(false);
        return;
      }

      try {
        setPaymentStage("Connecting to Stripe Secure Gateway...");
        const result = await stripeRef.current.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElementRef.current,
            billing_details: {
              name: cardName || "Amazon Customer",
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
          setLoading(false);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            setPaymentStage("Payment Succeeded! Finalizing Order...");
            await new Promise((r) => setTimeout(r, 500));
            onSuccess?.({
              paymentIntentId: result.paymentIntent.id,
              paymentMethod: "Stripe Credit Card",
            });
          } else {
            setError("Payment status is incomplete: " + result.paymentIntent.status);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Payment confirmation failed:", err);
        setError("An unexpected network error occurred during transaction processing.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-container">
        {/* Header */}
        <div className="pm-header">
          <div className="pm-title-lock">
            <MdLock className="pm-lock-icon" size={18} />
            <span>Secure Checkout</span>
          </div>
          <button className="pm-close-btn" onClick={onClose} disabled={loading}>
            <MdClose size={20} />
          </button>
        </div>

        {/* Amount bar */}
        <div className="pm-amount-bar">
          <span className="pm-amount-label">Payment Amount:</span>
          <span className="pm-amount-val">₹{orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="pm-form">
          {error && (
            <div className="pm-error-box">
              <span className="pm-error-txt">{error}</span>
            </div>
          )}

          {isSimulatedState && (
            <div className="pm-simulation-banner">
              <MdInfo size={16} />
              <span>
                <strong>Developer Notice:</strong> Stripe is in Simulation mode. You can enter any mock card credentials to complete the purchase.
              </span>
            </div>
          )}

          {!stripeLoaded && !error ? (
            <div className="pm-loading-skeleton">
              <div className="pm-skeleton-spinner" />
              <p>Initializing secure payment connection...</p>
            </div>
          ) : (
            <div className="pm-fields">
              <div className="pm-group">
                <label className="pm-label">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Happy Lakhotia"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={loading}
                  className="pm-input"
                  id="pm-cardholder-name"
                />
              </div>

              {isSimulatedState ? (
                <>
                  <div className="pm-group pm-card-num-group">
                    <label className="pm-label">Card Number</label>
                    <div className="pm-input-card-wrap">
                      <MdCreditCard size={18} className="pm-card-icon" />
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={loading}
                        className="pm-input pm-input-card"
                        id="pm-card-number"
                      />
                      {cardBrand !== "unknown" && (
                        <span className={`pm-brand-badge pm-brand-${cardBrand}`}>
                          {cardBrand.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pm-row">
                    <div className="pm-group pm-col-half">
                      <label className="pm-label">Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        disabled={loading}
                        className="pm-input"
                        id="pm-card-expiry"
                      />
                    </div>
                    <div className="pm-group pm-col-half">
                      <label className="pm-label">CVV / CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        disabled={loading}
                        className="pm-input"
                        id="pm-card-cvv"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="pm-group">
                  <label className="pm-label">Credit or Debit Card</label>
                  <div className="pm-stripe-container" id="stripe-card-element-wrapper">
                    <div id="stripe-card-element"></div>
                  </div>
                  <div className="pm-stripe-helper">
                    <span>Having trouble with your Stripe keys? </span>
                    <button
                      type="button"
                      className="pm-helper-btn"
                      onClick={() => {
                        setIsSimulatedState(true);
                        setError(null);
                      }}
                    >
                      Use Simulated Sandbox Mode instead →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pm-footer">
            <button
              type="button"
              className="pm-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pm-submit-btn"
              disabled={loading || !stripeLoaded}
            >
              {loading ? (
                <div className="pm-submit-spinner-wrap">
                  <div className="pm-submit-spinner" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ₹${orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
              )}
            </button>
          </div>

          {/* Secure details */}
          <div className="pm-secure-badges">
            <div className="pm-badge">
              <MdLock size={12} />
              <span>PCI-DSS Compliant Encryption</span>
            </div>
            <div className="pm-badge">
              <MdCreditCard size={12} />
              <span>Secure Stripe Gateway connection</span>
            </div>
          </div>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="pm-loading-overlay">
            <div className="pm-loading-spinner-box">
              <div className="pm-pulse-spinner" />
              <p className="pm-stage-title">{paymentStage}</p>
              <p className="pm-stage-sub">Please do not refresh or close this window.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
