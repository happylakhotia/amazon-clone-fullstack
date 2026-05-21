import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IMAGE_PLACEHOLDER } from "../../utils/constants";
import "./ProductCarousel.css";

const ProductCarousel = ({ images = [], productName = "" }) => {
  const [mainIndex, setMainIndex] = useState(0);

  const prev = () =>
    setMainIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setMainIndex((i) => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="carousel">
      {/* Thumbnails */}
      <div className="carousel-thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`carousel-thumb ${i === mainIndex ? "carousel-thumb--active" : ""}`}
            onClick={() => setMainIndex(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${i + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.src = IMAGE_PLACEHOLDER;
              }}
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="carousel-main">
        {images.length > 1 && (
          <button
            className="carousel-nav carousel-nav--prev"
            onClick={prev}
            aria-label="Previous image"
          >
            <MdChevronLeft size={28} />
          </button>
        )}

        <div className="carousel-main-img-wrap">
          <img
            key={mainIndex}
            src={images[mainIndex]}
            alt={`${productName} - image ${mainIndex + 1}`}
            className="carousel-main-img"
            onError={(e) => {
              e.target.src = IMAGE_PLACEHOLDER;
            }}
          />
        </div>

        {images.length > 1 && (
          <button
            className="carousel-nav carousel-nav--next"
            onClick={next}
            aria-label="Next image"
          >
            <MdChevronRight size={28} />
          </button>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === mainIndex ? "carousel-dot--active" : ""}`}
                onClick={() => setMainIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
