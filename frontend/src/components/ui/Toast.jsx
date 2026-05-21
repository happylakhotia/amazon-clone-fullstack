import { useState, useEffect, useCallback } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";
import "./Toast.css";

// Toast context singleton
let addToastFn = null;

export const toast = {
  success: (msg, opts) => addToastFn?.({ type: "success", message: msg, ...opts }),
  error: (msg, opts) => addToastFn?.({ type: "error", message: msg, ...opts }),
  info: (msg, opts) => addToastFn?.({ type: "info", message: msg, ...opts }),
};

const ICONS = {
  success: <MdCheckCircle size={20} />,
  error: <MdError size={20} />,
  info: <MdInfo size={20} />,
};

const ToastItem = ({ id, type, message, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  const remove = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(remove, 3500);
    return () => clearTimeout(timer);
  }, [remove]);

  return (
    <div className={`toast toast--${type} ${exiting ? "toast--exit" : ""}`}>
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={remove} aria-label="Close">
        <MdClose size={16} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  addToastFn = useCallback((toastData) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toastData }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
