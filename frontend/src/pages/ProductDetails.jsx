import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../services/productService";
import ProductCarousel from "../components/product/ProductCarousel";
import ProductInfo from "../components/product/ProductInfo";
import ProductCard from "../components/product/ProductCard";
import { PageLoader } from "../components/common/Loader";
import { formatCurrency } from "../utils/formatCurrency";
import "./ProductDetails.css";

const SpecsTable = ({ specifications }) => {
  if (!specifications || !Object.keys(specifications).length) return null;
  return (
    <div className="specs-section">
      <h2 className="specs-title">Technical Specifications</h2>
      <table className="specs-table">
        <tbody>
          {Object.entries(specifications).map(([key, val]) => (
            <tr key={key} className="specs-row">
              <td className="specs-key">{key}</td>
              <td className="specs-val">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await getProductById(id);
        setProduct(p);
        setRelated(getRelatedProducts(p, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <PageLoader />;

  if (error || !product) {
    return (
      <div className="pd-error">
        <h2>Product not found</h2>
        <p>{error}</p>
        <Link to="/" className="pd-error-link">← Back to Shopping</Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <nav className="pd-breadcrumb container" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="pd-crumb-sep">›</span>
        <Link to={`/?cat=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span className="pd-crumb-sep">›</span>
        <span className="pd-crumb-current" aria-current="page">
          {product.name.length > 50 ? product.name.slice(0, 50) + "…" : product.name}
        </span>
      </nav>

      {/* Main product section */}
      <div className="container">
        <div className="pd-main">
          {/* Left: Carousel */}
          <div className="pd-carousel-col">
            <ProductCarousel images={product.images} productName={product.name} />
          </div>

          {/* Middle: Info */}
          <div className="pd-info-col">
            <ProductInfo product={product} />
          </div>

          {/* Right: Buy Box */}
          <div className="pd-buy-box">
            <div className="buy-box-card">
              <div className="buy-box-price">
                <span className="buy-box-label">Price: </span>
                <span className="buy-box-amount">
                  {formatCurrency(product.price)}
                </span>
              </div>
              {product.stock > 0 ? (
                <p className="buy-box-in-stock">In Stock</p>
              ) : (
                <p className="buy-box-out-stock">Out of Stock</p>
              )}
              <p className="buy-box-ships">Ships from and sold by:</p>
              <p className="buy-box-seller">{product.soldBy}</p>
              <p className="buy-box-delivery">
                FREE delivery{" "}
                <strong>
                  {new Date(Date.now() + 2 * 86400000).toLocaleDateString(
                    "en-US",
                    { weekday: "short", month: "short", day: "numeric" }
                  )}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="container">
        <SpecsTable specifications={product.specifications} />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="container">
          <section className="pd-related" aria-label="Related products">
            <h2 className="pd-related-title">Customers also viewed</h2>
            <div className="pd-related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
