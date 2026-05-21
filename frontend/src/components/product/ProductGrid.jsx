import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "../common/Loader";
import "./ProductGrid.css";

const ITEMS_PER_PAGE = 10;

const ProductGrid = ({ products = [], loading = false, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [progressiveItems, setProgressiveItems] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const gridTopRef = useRef(null);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when product list changes (e.g. filter/search)
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // Progressive loading animation when page changes
  useEffect(() => {
    if (loading) return;

    setIsPageLoading(true);
    setProgressiveItems([]);

    // Short initial delay to show the spinner
    const initialTimer = setTimeout(() => {
      const timers = [];
      currentProducts.forEach((product, index) => {
        const timer = setTimeout(() => {
          setProgressiveItems((prev) => [...prev, product.id]);
          // Clear spinner after last item starts loading
          if (index === currentProducts.length - 1) {
            setIsPageLoading(false);
          }
        }, 80 * (index + 1)); // 80ms stagger per card
        timers.push(timer);
      });

      return () => timers.forEach(clearTimeout);
    }, 400);

    return () => clearTimeout(initialTimer);
  }, [currentPage, loading, products]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    // Scroll to top of grid
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="product-grid-wrapper">
        {title && <h2 className="product-grid-title">{title}</h2>}
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <div className="empty-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="product-grid-wrapper" ref={gridTopRef}>
      {title && (
        <div className="product-grid-header">
          <h2 className="product-grid-title">{title}</h2>
          <span className="product-grid-count">{products.length} results</span>
        </div>
      )}

      {/* Results info bar */}
      <div className="product-grid-info-bar">
        <span className="product-grid-showing">
          Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} of {products.length} results
        </span>
      </div>

      {/* Progressive loading spinner */}
      {isPageLoading && (
        <div className="progressive-loader">
          <div className="progressive-spinner">
            <div className="progressive-spinner-ring"></div>
          </div>
          <span className="progressive-loader-text">Loading products...</span>
        </div>
      )}

      <div className={`product-grid ${isPageLoading ? "product-grid--loading" : ""}`}>
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className={`product-grid-item ${progressiveItems.includes(product.id) ? "product-grid-item--visible" : ""}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Product pagination">
          <button
            className="pagination-btn pagination-prev"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-btn pagination-num ${page === currentPage ? "pagination-num--active" : ""}`}
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            className="pagination-btn pagination-next"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
};

export default ProductGrid;
