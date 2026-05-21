import "./Button.css";

/**
 * Amazon-style Button component
 * @param {string} variant - "primary" | "secondary" | "danger" | "ghost" | "link"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} loading
 * @param {boolean} fullWidth
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  id,
  ...props
}) => {
  return (
    <button
      id={id}
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""} ${loading ? "btn--loading" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
