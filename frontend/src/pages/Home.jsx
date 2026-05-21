import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/product/ProductGrid";
import CategoryFilter from "../components/product/CategoryFilter";
import { CATEGORIES } from "../utils/constants";
import {
  MdLaptopMac,
  MdCheckroom,
  MdMenuBook,
  MdWeekend,
  MdSportsBasketball,
  MdExtension,
} from "react-icons/md";
import "./Home.css";

// Banner data
const banners = [
  {
    id: 1,
    title: "Up to 40% off Electronics",
    subtitle: "Shop the latest tech deals",
    cta: "Shop Now",
    category: "Electronics",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  },
  {
    id: 2,
    title: "Fashion Sale",
    subtitle: "New arrivals starting at ₹999",
    cta: "Explore Now",
    category: "Clothing",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  },
  {
    id: 3,
    title: "Home & Kitchen Deals",
    subtitle: "Transform your living space",
    cta: "Discover",
    category: "Home & Kitchen",
    bg: "linear-gradient(135deg, #0d1b2a 0%, #1b4332 100%)",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
  },
];

const categoryIcons = {
  Electronics:      { icon: MdLaptopMac,        color: "#0f3460", bg: "#e8f0fe" },
  Clothing:         { icon: MdCheckroom,         color: "#7b2d8e", bg: "#f3e5f5" },
  Books:            { icon: MdMenuBook,          color: "#c45500", bg: "#fff3e0" },
  "Home & Kitchen": { icon: MdWeekend,           color: "#1b7742", bg: "#e6f4ea" },
  Sports:           { icon: MdSportsBasketball,  color: "#c62828", bg: "#fce4ec" },
  Toys:             { icon: MdExtension,         color: "#1565c0", bg: "#e3f2fd" },
};

const HeroBanner = ({ onCategoryChange }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <div className="hero-banner" style={{ background: banner.bg }}>
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-title">{banner.title}</h2>
          <p className="hero-subtitle">{banner.subtitle}</p>
          <button
            className="hero-cta"
            onClick={() => onCategoryChange(banner.category)}
            id={`hero-cta-${banner.id}`}
          >
            {banner.cta} →
          </button>
        </div>
        <div className="hero-image-wrap">
          <img
            src={banner.image}
            alt={banner.title}
            className="hero-image"
            loading="eager"
          />
        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredProducts, loading, handleSearch, handleCategoryChange, selectedCategory, clearFilters } =
    useProducts();

  // Sync URL params → context
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat") || "All";
    handleSearch(q);
    handleCategoryChange(cat);
  }, [searchParams]);

  const changeCategory = (cat) => {
    const params = new URLSearchParams();
    if (cat && cat !== "All") params.set("cat", cat);
    setSearchParams(params);
  };

  const searchQuery = searchParams.get("q");
  const categoryParam = searchParams.get("cat");
  const isFiltered = searchQuery || (categoryParam && categoryParam !== "All");

  return (
    <div className="home-page">
      {/* Hero Banner - only show when not filtered */}
      {!isFiltered && (
        <>
          <HeroBanner onCategoryChange={changeCategory} />

          {/* Category Quick Links */}
          <section className="category-quick-links" aria-label="Shop by category">
            <div className="container">
              <h2 className="section-title">Shop by Category</h2>
              <div className="cql-grid">
                {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                  const { icon: Icon, color, bg } = categoryIcons[cat] || {};
                  return (
                    <button
                      key={cat}
                      className="cql-card"
                      onClick={() => changeCategory(cat)}
                      id={`cat-link-${cat.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <div
                        className="cql-icon"
                        style={{ background: bg, color: color }}
                      >
                        {Icon && <Icon size={28} />}
                      </div>
                      <span className="cql-name">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Main Content: Filter + Products */}
      <section className="home-main container">
        {/* Active filters banner */}
        {isFiltered && (
          <div className="filter-banner">
            <p>
              {searchQuery && (
                <>
                  Results for: <strong>"{searchQuery}"</strong>
                </>
              )}
              {categoryParam && categoryParam !== "All" && (
                <>
                  {searchQuery ? " in " : "Category: "}
                  <strong>{categoryParam}</strong>
                </>
              )}
              &nbsp;({filteredProducts.length} results)
            </p>
            <button
              className="filter-banner-clear"
              onClick={() => {
                clearFilters();
                setSearchParams({});
              }}
              id="clear-filters"
            >
              Clear Filters ✕
            </button>
          </div>
        )}

        <div className="home-content-row">
          {/* Sidebar */}
          <CategoryFilter />

          {/* Products */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            title={isFiltered ? undefined : "All Products"}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
