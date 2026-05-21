import { Link } from "react-router-dom";
import { FaAmazon } from "react-icons/fa";
import "./Footer.css";

const footerLinks = [
  {
    title: "Get to Know Us",
    links: ["Careers", "Blog", "About Amazon", "Investor Relations", "Amazon Devices", "Amazon Science"],
  },
  {
    title: "Make Money with Us",
    links: ["Sell products on Amazon", "Sell on Amazon Business", "Sell apps on Amazon", "Become an Affiliate", "Advertise Your Products", "Self-Publish with Us"],
  },
  {
    title: "Amazon Payment Products",
    links: ["Amazon Business Card", "Shop with Points", "Reload Your Balance", "Amazon Currency Converter"],
  },
  {
    title: "Let Us Help You",
    links: ["Amazon and COVID-19", "Your Account", "Your Orders", "Shipping Rates & Policies", "Returns & Replacements", "Manage Your Content and Devices", "Help"],
  },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer" aria-label="Footer">
      {/* Back to top */}
      <button className="footer-top-btn" onClick={scrollToTop} id="footer-top">
        Back to top
      </button>

      {/* Main links */}
      <div className="footer-main">
        <div className="footer-cols">
          {footerLinks.map((section) => (
            <div key={section.title} className="footer-col">
              <h3 className="footer-col-title">{section.title}</h3>
              <ul className="footer-col-links">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link to="/" className="footer-link">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom */}
      <div className="footer-bottom">
        <Link to="/" className="footer-logo" aria-label="Amazon Home">
          <FaAmazon size={28} color="white" />
          <span>amazon</span>
        </Link>

        <div className="footer-bottom-links">
          <Link to="/" className="footer-bottom-link">Conditions of Use</Link>
          <Link to="/" className="footer-bottom-link">Privacy Notice</Link>
          <Link to="/" className="footer-bottom-link">Your Ads Privacy Choices</Link>
        </div>

        <p className="footer-copyright">
          © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
};

export default Footer;
