import { useProducts } from "../../hooks/useProducts";
import { CATEGORIES } from "../../utils/constants";
import "./CategoryFilter.css";

const CategoryFilter = () => {
  const { selectedCategory, handleCategoryChange, filteredProducts, allProducts } = useProducts();

  // Count per category from all products
  const getCategoryCount = (cat) => {
    if (cat === "All") return allProducts.length;
    return allProducts.filter((p) => p.category === cat).length;
  };

  return (
    <aside className="category-filter" aria-label="Filter products">
      <div className="cf-section">
        <h2 className="cf-title">Department</h2>
        <ul className="cf-list">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                className={`cf-item ${selectedCategory === cat ? "cf-item--active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
                id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                aria-pressed={selectedCategory === cat}
              >
                <span className="cf-name">{cat}</span>
                <span className="cf-count">({getCategoryCount(cat)})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
};

export default CategoryFilter;
