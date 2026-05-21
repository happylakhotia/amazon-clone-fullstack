import { Link } from "react-router-dom";
import { MdFavorite, MdShoppingCart } from "react-icons/md";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { toast } from "../components/ui/Toast";
import { IMAGE_PLACEHOLDER } from "../utils/constants";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
    toast.success("Moved to cart!");
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="wl-title">
          <MdFavorite size={28} className="wl-heart-icon" />
          Your Wish List
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="wl-empty">
            <MdFavorite size={70} className="wl-empty-icon" />
            <h2>Your Wish List is empty</h2>
            <p>Save items you love and want to buy later.</p>
            <Link to="/" className="wl-shop-btn" id="wl-start-shopping">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="wl-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wl-card" id={`wl-item-${item.id}`}>
                <Link to={`/product/${item.id}`} className="wl-image-link">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="wl-image"
                    onError={(e) => {
                      e.target.src = IMAGE_PLACEHOLDER;
                    }}
                  />
                </Link>
                <div className="wl-card-body">
                  <Link to={`/product/${item.id}`} className="wl-name">
                    {item.name}
                  </Link>
                  <span className="wl-price">{formatCurrency(item.price)}</span>
                  <p className="wl-category">{item.category}</p>
                  <div className="wl-actions">
                    <button
                      className="wl-add-cart"
                      onClick={() => handleMoveToCart(item)}
                      id={`wl-add-to-cart-${item.id}`}
                    >
                      <MdShoppingCart size={15} />
                      Add to Cart
                    </button>
                    <button
                      className="wl-remove"
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.info("Removed from Wish List");
                      }}
                      id={`wl-remove-${item.id}`}
                    >
                      Remove
                    </button>
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

export default Wishlist;
