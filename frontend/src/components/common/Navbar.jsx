import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdShoppingCart,
  MdLocationOn,
  MdMenu,
  MdClose,
  MdPerson,
} from "react-icons/md";
import { FaAmazon } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useCart } from "../../hooks/useCart";
import { DEFAULT_USER, CATEGORIES } from "../../utils/constants";
import { loadOrders } from "../../services/orderService";
import { getUserProfile, logoutUser } from "../../services/userService";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("Mumbai 400001");
  const [userName, setUserName] = useState("Happy");
  const [userFullName, setUserFullName] = useState("Happy Lakhotia");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    logoutUser();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoggedIn(!!localStorage.getItem("amazon_user"));
        // Fetch user profile first
        const profile = await getUserProfile();
        if (profile) {
          setUserFullName(profile.name || "Happy Lakhotia");
          setUserName((profile.name || "Happy").split(" ")[0]);
        }

        // Fetch latest order for delivery location header
        const ordersList = await loadOrders();
        const latest = ordersList?.[0];
        if (latest) {
          setDeliveryLocation(`${latest.address.city} ${latest.address.zipCode}`);
        } else if (profile && profile.city && profile.zipCode) {
          setDeliveryLocation(`${profile.city} ${profile.zipCode}`);
        }
      } catch (err) {
        console.warn("Failed to fetch user data for Navbar:", err.message);
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = (query, category) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "All") params.set("cat", category);
    navigate(`/?${params.toString()}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="navbar-wrapper">
      {/* ── Main Nav ────────────────────────────────────────────── */}
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="Amazon Home" id="navbar-logo">
            <FaAmazon size={28} color="white" />
            <span className="navbar-logo-text">amazon</span>
          </Link>

          {/* Delivery Location */}
          <div className="navbar-location">
            <MdLocationOn size={16} color="#ccc" />
            <div>
              <span className="navbar-location-label">Deliver to</span>
              <span className="navbar-location-value">{deliveryLocation}</span>
            </div>
          </div>

          {/* Search */}
          <div className="navbar-search">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Account & Lists */}
          <div
            className="navbar-account"
            ref={dropdownRef}
            onMouseEnter={() => setAccountDropdown(true)}
            onMouseLeave={() => setAccountDropdown(false)}
          >
            <div className="navbar-account-trigger">
              <span className="navbar-label">Hello, {userName}</span>
              <span className="navbar-value">Account & Lists ▾</span>
            </div>
            {accountDropdown && (
              <div className="navbar-account-dropdown">
                <div className="dropdown-header">
                  {isLoggedIn ? (
                    <div className="dropdown-user-info">
                      <span className="dropdown-greet">Hello, {userFullName}</span>
                      <button onClick={handleSignOut} className="dropdown-btn dropdown-signout-btn">Sign Out</button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-btn">Sign In</Link>
                      <p>New customer? <Link to="/login?mode=register">Start here</Link></p>
                    </>
                  )}
                </div>
                <div className="dropdown-columns">
                  <div className="dropdown-col">
                    <p className="dropdown-col-title">Your Lists</p>
                    <Link to="/wishlist">Wish List</Link>
                    <Link to="/orders">Order History</Link>
                  </div>
                  <div className="dropdown-col">
                    <p className="dropdown-col-title">Your Account</p>
                    <Link to="/orders">Account</Link>
                    <Link to="/orders">Returns & Orders</Link>
                    <Link to="/">Recommendations</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link to="/orders" className="navbar-orders">
            <span className="navbar-label">Returns</span>
            <span className="navbar-value">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="navbar-cart" id="navbar-cart" aria-label={`Cart with ${cartCount} items`}>
            <div className="navbar-cart-icon">
              <MdShoppingCart size={30} color="white" />
              <span className="cart-count" aria-live="polite">{cartCount}</span>
            </div>
            <span className="navbar-value navbar-cart-label">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <MdClose size={24} color="white" /> : <MdMenu size={24} color="white" />}
          </button>
        </div>
      </nav>

      {/* ── Category Sub-Nav ──────────────────────────────────── */}
      <nav className="subnav" aria-label="Category navigation">
        <div className="subnav-inner">
          <button className="subnav-item subnav-all">
            <MdMenu size={18} />
            All
          </button>
          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <Link
              key={cat}
              to={`/?cat=${encodeURIComponent(cat)}`}
              className="subnav-item"
            >
              {cat}
            </Link>
          ))}
          <Link to="/" className="subnav-item">Today's Deals</Link>
          <Link to="/" className="subnav-item subnav-prime">Try Prime</Link>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <MdPerson size={20} color="white" />
            <span>Hello, {userFullName}</span>
          </div>
          <div className="mobile-menu-search">
            <SearchBar onSearch={(q, c) => { handleSearch(q, c); setMobileMenuOpen(false); }} />
          </div>
          <nav className="mobile-menu-nav">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={cat === "All" ? "/" : `/?cat=${encodeURIComponent(cat)}`}
                className="mobile-menu-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <hr className="mobile-divider" />
            <Link to="/cart" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              🛒 Cart ({cartCount})
            </Link>
            <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              ❤️ Wishlist
            </Link>
            <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              📦 Orders
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
