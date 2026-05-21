import "./Input.css";

const Input = ({
  label,
  id,
  error,
  required,
  className = "",
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? "input-field--error" : ""}`}
        required={required}
        {...props}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
