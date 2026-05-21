import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found" id="not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Oops! Page not found.</h1>
        <p className="not-found-sub">
          We're sorry. The web address you entered is not a functioning page on
          our site.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-home-btn" id="go-home">
            Go to Amazon Homepage
          </Link>
        </div>

        <div className="not-found-suggestions">
          <p>You might also try:</p>
          <ul>
            <li><Link to="/?cat=Electronics">Browse Electronics</Link></li>
            <li><Link to="/?cat=Books">Explore Books</Link></li>
            <li><Link to="/cart">View Cart</Link></li>
            <li><Link to="/orders">Your Orders</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
