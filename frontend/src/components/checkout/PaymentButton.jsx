import { useState } from "react";
import { MdLock, MdCreditCard } from "react-icons/md";
import Button from "../ui/Button";
import "./PaymentButton.css";

const PaymentButton = ({ onPlaceOrder, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    onPlaceOrder?.();
  };

  return (
    <div className="payment-button-wrap">
      <div className="pb-secure">
        <MdLock size={14} />
        <span>Your information is secure and encrypted</span>
      </div>

      {/* Simulated payment method */}
      <div className="pb-payment-method">
        <MdCreditCard size={20} />
        <div>
          <p className="pb-pm-title">Pay with card</p>
          <p className="pb-pm-sub">Visa, Mastercard, Amex, Discover</p>
        </div>
      </div>

      <Button
        id="place-order-btn"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleClick}
        loading={loading}
        disabled={disabled || loading}
        className="pb-btn"
      >
        {!loading && <MdLock size={16} />}
        {loading ? "Processing..." : "Place your order"}
      </Button>

      <p className="pb-terms">
        By placing your order, you agree to Amazon's{" "}
        <span className="pb-link">Privacy Notice</span> and{" "}
        <span className="pb-link">Conditions of Use</span>.
      </p>
    </div>
  );
};

export default PaymentButton;
