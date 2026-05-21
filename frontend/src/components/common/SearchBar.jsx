import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { CATEGORIES } from "../../utils/constants";
import "./SearchBar.css";

const SearchBar = ({ onSearch, initialQuery = "", initialCategory = "All" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim(), category);
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit} role="search">
      <select
        className="searchbar-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Search category"
        id="search-category"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="search"
        className="searchbar-input"
        placeholder="Search Amazon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search products"
        id="search-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        aria-label="Submit search"
        id="search-submit"
      >
        <MdSearch size={22} />
      </button>
    </form>
  );
};

export default SearchBar;
