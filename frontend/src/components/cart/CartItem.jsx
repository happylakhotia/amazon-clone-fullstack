import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import QuantitySelector from "./QuantitySelector";
import { toast } from "../ui/Toast";
import { IMAGE_PLACEHOLDER } from "../../utils/constants";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(item.id);

  const handleRemove = () => {
    removeFromCart(item.id);
    toast.info("Item removed from cart");
  };

  const handleSaveForLater = () => {
    if (!inWishlist) {
      toggleWishlist(item);
      toast.success("Saved to Wish List");
    }
    removeFromCart(item.id);
  };

  return (
    <div className="cart-item" id={`cart-item-${item.id}`}>
      {/* Product Image */}
      <Link to={`/product/${item.id}`} className="ci-image-link">
        <div className="ci-image-wrap">
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="ci-image"
            onError={(e) => {
              e.target.src = IMAGE_PLACEHOLDER;
            }}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="ci-details">
        <Link to={`/product/${item.id}`} className="ci-name">
          {item.name}
        </Link>

        <p className="ci-sold-by">
          Sold by: <span>{item.soldBy}</span>
        </p>

        <p className="ci-stock">In Stock</p>

        {/* Quantity & Actions */}
        <div className="ci-actions-row">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            productId={item.id}
          />

          <div className="ci-action-btns">
            <button
              className="ci-action-btn"
              onClick={handleRemove}
              id={`remove-${item.id}`}
              aria-label="Remove item"
            >
              <MdDelete size={14} />
              Delete
            </button>
            <span className="ci-separator">|</span>
            <button
              className="ci-action-btn"
              onClick={handleSaveForLater}
              id={`save-later-${item.id}`}
              aria-label="Save for later"
            >
              <FaHeart size={12} />
              Save for later
            </button>
          </div>
        </div>
      </div>

      {/* Item Price */}
      <div className="ci-price-col">
        <span className="ci-price">
          {formatCurrency(item.price * item.quantity)}
        </span>
        {item.quantity > 1 && (
          <span className="ci-unit-price">
            {formatCurrency(item.price)} each
          </span>
        )}
      </div>
    </div>
  );
};

export default CartItem;
