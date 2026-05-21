import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getProducts,
  searchProducts,
  filterByCategory,
} from "../services/productService";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Re-filter whenever search/category changes
  useEffect(() => {
    let result = allProducts;
    result = filterByCategory(selectedCategory, result);
    result = searchProducts(searchQuery, result);
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, allProducts]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
  }, []);

  return (
    <ProductContext.Provider
      value={{
        allProducts,
        filteredProducts,
        searchQuery,
        selectedCategory,
        loading,
        error,
        handleSearch,
        handleCategoryChange,
        clearFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProductContext must be used within ProductProvider");
  return ctx;
};

export default ProductContext;
