import "./QuantitySelector.css";

const QuantitySelector = ({ quantity, onChange, min = 1, max = 10, productId }) => {
  return (
    <div className="qty-selector" role="group" aria-label="Quantity">
      <button
        className="qty-btn"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        id={`qty-dec-${productId}`}
      >
        −
      </button>
      <span className="qty-value" aria-live="polite" aria-label={`Quantity: ${quantity}`}>
        {quantity}
      </span>
      <button
        className="qty-btn"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        id={`qty-inc-${productId}`}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
