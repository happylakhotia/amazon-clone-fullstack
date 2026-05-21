import "./Loader.css";

export const Spinner = ({ size = 40 }) => (
  <div className="spinner" style={{ width: size, height: size }} />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title short" />
      <div className="skeleton skeleton-stars" />
      <div className="skeleton skeleton-price" />
      <div className="skeleton skeleton-btn" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="page-loader">
    <Spinner size={50} />
    <p className="page-loader-text">Loading...</p>
  </div>
);

const Loader = ({ variant = "page" }) => {
  if (variant === "spinner") return <Spinner />;
  if (variant === "skeleton") return <SkeletonCard />;
  return <PageLoader />;
};

export default Loader;
