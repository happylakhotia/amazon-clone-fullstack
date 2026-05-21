import { Link } from "react-router-dom";
import { MdShoppingCart, MdFavorite, MdFavoriteBorder, MdStar } from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { formatCurrency, formatDiscount } from "../../utils/formatCurrency";
import { FREE_SHIPPING_THRESHOLD, IMAGE_PLACEHOLDER } from "../../utils/constants";
import { toast } from "../ui/Toast";
import "./ProductCard.css";

const StarRating = ({ rating, reviewCount }) => {
  const filled = Math.round(rating);
  return (
    <div className="pc-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <MdStar
          key={i}
          size={16}
          className={i < filled ? "star-filled" : "star-empty"}
        />
      ))}
      <span className="pc-review-count">({reviewCount?.toLocaleString()})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart();
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const discount = formatDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`"${product.name.slice(0, 30)}..." added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (inWishlist) {
      toast.info("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist ❤️");
    }
  };

  return (
    <article className="product-card" id={`product-${product.id}`}>
      <Link to={`/product/${product.id}`} className="pc-link">
        {/* Badge */}
        {product.badge && (
          <span
            className={`badge ${
              product.badge.includes("Best") || product.badge.includes("#1")
                ? "badge-bestseller"
                : product.badge.includes("Choice")
                ? "badge-choice"
                : "badge-deal"
            } pc-badge`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          className={`pc-wishlist ${inWishlist ? "pc-wishlist--active" : ""}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Remove from Wish List" : "Add to Wish List"}
        >
          {inWishlist ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
        </button>

        {/* Product Image */}
        <div className="pc-image-wrap">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="pc-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = IMAGE_PLACEHOLDER;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="pc-body">
          <h3 className="pc-name">{product.name}</h3>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          {/* Price */}
          <div className="pc-price-row">
            <div className="price-block">
              <span className="price-main">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <div className="pc-price-meta">
                  <span className="price-original">
                    List: {formatCurrency(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="price-discount">{discount}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stock */}
          <p className={`pc-stock ${product.stock < 10 ? "pc-stock--low" : ""}`}>
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 10
              ? `Only ${product.stock} left in stock`
              : "In Stock"}
          </p>

          {/* Shipping */}
          <p className="pc-shipping">FREE delivery on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</p>
        </div>
      </Link>

      {/* Add to Cart */}
      <button
        className={`pc-add-cart ${inCart ? "pc-add-cart--added" : ""}`}
        onClick={handleAddToCart}
        id={`add-to-cart-${product.id}`}
        aria-label={`Add ${product.name} to cart`}
        disabled={product.stock === 0}
      >
        <MdShoppingCart size={16} />
        {inCart ? "Added to Cart ✓" : "Add to Cart"}
      </button>
    </article>
  );
};

export default ProductCard;
