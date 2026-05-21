import { useState } from "react";
import { MdStar, MdStarHalf, MdShoppingCart, MdFlashOn } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCurrency, formatDiscount } from "../../utils/formatCurrency";
import { toast } from "../ui/Toast";
import Button from "../ui/Button";
import "./ProductInfo.css";

const StarRating = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="pi-rating">
      <div className="pi-stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <MdStar key={`f${i}`} className="star-filled" />
        ))}
        {hasHalf && <MdStarHalf className="star-filled" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <MdStar key={`e${i}`} className="star-empty" />
        ))}
      </div>
      <span className="pi-review-count">{reviewCount?.toLocaleString()} ratings</span>
    </div>
  );
};

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const discount = formatDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    toast.success("Item added to cart!");
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (inWishlist) {
      toast.info("Removed from Wish List");
    } else {
      toast.success("Added to Wish List ❤️");
    }
  };

  return (
    <div className="product-info">
      {/* Badge */}
      {product.badge && (
        <span className={`badge badge-choice pi-badge`}>{product.badge}</span>
      )}

      {/* Title */}
      <h1 className="pi-title" id="product-title">{product.name}</h1>

      {/* Brand */}
      <p className="pi-brand">
        Brand: <span className="pi-brand-name">{product.soldBy}</span>
      </p>

      {/* Rating row */}
      <StarRating rating={product.rating} reviewCount={product.reviewCount} />

      <div className="pi-divider" />

      {/* Price block */}
      <div className="pi-price-section">
        <div className="pi-price-row">
          <span className="pi-price-label">Price:</span>
          <div>
            <span className="pi-price">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <div className="pi-price-details">
                <span>List Price: </span>
                <span className="pi-original-price">{formatCurrency(product.originalPrice)}</span>
                {discount && (
                  <span className="pi-discount"> &nbsp;{discount}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="pi-free-returns">FREE Returns</p>

        {/* Delivery */}
        <div className="pi-delivery">
          <span className="pi-delivery-label">FREE delivery</span>{" "}
          <strong>{new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
          <br />
          <span className="pi-delivery-sub">Or fastest delivery Tomorrow</span>
        </div>
      </div>

      <div className="pi-divider" />

      {/* Stock status */}
      <div className="pi-stock">
        {product.stock === 0 ? (
          <span className="pi-stock--out">Out of Stock</span>
        ) : product.stock < 10 ? (
          <span className="pi-stock--low">
            Only {product.stock} left in stock – order soon.
          </span>
        ) : (
          <span className="pi-stock--in">In Stock</span>
        )}
      </div>

      {/* Sold by */}
      <p className="pi-sold-by">
        Ships from and sold by <span className="pi-sold-by-name">{product.soldBy}</span>
      </p>

      {/* Action buttons */}
      <div className="pi-actions">
        <Button
          id="add-to-cart-detail"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="pi-btn-cart"
        >
          <MdShoppingCart size={18} />
          {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
        </Button>

        <Button
          id="buy-now"
          variant="orange"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="pi-btn-buy"
        >
          <MdFlashOn size={18} />
          Buy Now
        </Button>

        <button
          className={`pi-wishlist-btn ${inWishlist ? "pi-wishlist-btn--active" : ""}`}
          onClick={handleWishlist}
          id="wishlist-btn"
          aria-label={inWishlist ? "Remove from Wish List" : "Add to Wish List"}
        >
          {inWishlist ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          {inWishlist ? "Added to Wish List" : "Add to Wish List"}
        </button>
      </div>

      {/* Description */}
      <div className="pi-divider" />
      <div className="pi-description">
        <h2 className="pi-section-title">About this item</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
