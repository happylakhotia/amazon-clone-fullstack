import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaAmazon } from "react-icons/fa";
import { MdWarning, MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { loginUser, registerUser } from "../services/userService";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // Check if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("amazon_user");
    if (savedUser) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect]);

  // Tab state: 'signin' or 'register'
  const initialMode = searchParams.get("mode") === "register" ? "register" : "signin";
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setFieldErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!email.trim()) {
      errors.email = "Enter your email";
    } else if (!validateEmail(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Enter your password";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      setSuccess("Successfully signed in!");
      setTimeout(() => {
        // Trigger a page refresh or simply navigate to cause headers to reload
        window.location.href = redirect;
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!name.trim()) {
      errors.name = "Enter your name";
    }

    if (!email.trim()) {
      errors.email = "Enter your email";
    } else if (!validateEmail(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Enter a password";
    } else if (password.length < 6) {
      errors.password = "Passwords must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await registerUser(name, email, password);
      setSuccess("Account successfully created!");
      setTimeout(() => {
        window.location.href = redirect;
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed. Email might already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="amazon-auth-container">
      {/* Amazon Logo Header */}
      <header className="auth-logo-header">
        <Link to="/" className="auth-logo-link">
          <FaAmazon className="auth-amazon-logo-icon" />
          <span className="auth-logo-text">amazon</span>
          <span className="auth-logo-tld">.in</span>
        </Link>
      </header>
      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          <div className="auth-alert-icon">
            <MdErrorOutline size={28} />
          </div>
          <div className="auth-alert-content">
            <h4 className="auth-alert-title">There was a problem</h4>
            <p className="auth-alert-message">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert-success" role="alert">
          <div className="auth-alert-icon">
            <MdCheckCircleOutline size={28} />
          </div>
          <div className="auth-alert-content">
            <h4 className="auth-alert-title">Success</h4>
            <p className="auth-alert-message">{success}</p>
          </div>
        </div>
      )}
      <main className="auth-card">
        {mode === "signin" ? (
          <div className="auth-card-body">
            <h1 className="auth-card-title">Sign in</h1>
            <form onSubmit={handleSignIn} noValidate>
              <div className={`auth-form-group ${fieldErrors.email ? "has-error" : ""}`}>
                <label htmlFor="signin-email">Email</label>
                <input
                  type="email"
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
                {fieldErrors.email && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.email}
                  </span>
                )}
              </div>
              <div className={`auth-form-group ${fieldErrors.password ? "has-error" : ""}`}>
                <label htmlFor="signin-password">Password</label>
                <input
                  type="password"
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                {fieldErrors.password && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.password}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-terms">
              By continuing, you agree to Amazon's{" "}
              <Link to="/">Conditions of Use</Link> and{" "}
              <Link to="/">Privacy Notice</Link>.
            </p>

            <details className="auth-help-details">
              <summary>Need help?</summary>
              <div className="auth-help-links">
                <Link to="/">Forgot your password?</Link>
                <Link to="/">Other issues with Sign-In</Link>
              </div>
            </details>
          </div>
        ) : (
          <div className="auth-card-body">
            <h1 className="auth-card-title">Create Account</h1>
            <form onSubmit={handleRegister} noValidate>
              <div className={`auth-form-group ${fieldErrors.name ? "has-error" : ""}`}>
                <label htmlFor="reg-name">Your name</label>
                <input
                  type="text"
                  id="reg-name"
                  placeholder="First and last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                />
                {fieldErrors.name && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.name}
                  </span>
                )}
              </div>
              <div className={`auth-form-group ${fieldErrors.email ? "has-error" : ""}`}>
                <label htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.email}
                  </span>
                )}
              </div>
              <div className={`auth-form-group ${fieldErrors.password ? "has-error" : ""}`}>
                <label htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {fieldErrors.password && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.password}
                  </span>
                )}
              </div>
              <div className={`auth-form-group ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
                <label htmlFor="reg-confirm-password">Re-enter password</label>
                <input
                  type="password"
                  id="reg-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {fieldErrors.confirmPassword && (
                  <span className="auth-field-error">
                    <MdWarning size={14} /> {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create your Amazon account"}
              </button>
            </form>

            <p className="auth-terms">
              By creating an account, you agree to Amazon's{" "}
              <Link to="/">Conditions of Use</Link> and{" "}
              <Link to="/">Privacy Notice</Link>.
            </p>

            <div className="auth-divider-horizontal"></div>

            <p className="auth-switch-mode-text">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => handleModeChange("signin")}
              >
                Sign in ▾
              </button>
            </p>
          </div>
        )}
      </main>
      {mode === "signin" && (
        <div className="auth-new-to-amazon">
          <div className="new-to-amazon-divider">
            <h5>New to Amazon?</h5>
          </div>
          <button
            type="button"
            className="auth-secondary-btn"
            onClick={() => handleModeChange("register")}
            disabled={loading}
          >
            Create your Amazon account
          </button>
        </div>
      )}
      <footer className="auth-footer">
        <div className="auth-footer-divider"></div>
        <div className="auth-footer-links">
          <Link to="/">Conditions of Use</Link>
          <Link to="/">Privacy Notice</Link>
          <Link to="/">Help</Link>
        </div>
        <span className="auth-footer-copyright">
          © 1996-2026, Amazon.com, Inc. or its affiliates
        </span>
      </footer>
    </div>
  );
};

export default Login;
