import {
  useReducer,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
  useTransition,
  useDeferredValue,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { filterReducer, initialFilterState } from "../reducers/FilterReducer";
import { ThemeContext } from "../context/ThemeContext";

const ProductList = forwardRef((props, ref) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/Products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Focus search input on load
  const searchRef = useRef();
  useLayoutEffect(() => {
    searchRef.current.focus();
  }, []);

  // Responsive grid columns
  const [columns, setColumns] = useState(3);
  useLayoutEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Deferred search for performance
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(filterState.search);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(deferredSearch.toLowerCase()) &&
        (filterState.category === "All" ||
          p.category === filterState.category) &&
        p.price >= filterState.priceRange[0] &&
        p.price <= filterState.priceRange[1]
      );
    });
  }, [products, deferredSearch, filterState.category, filterState.priceRange]);

  // Handlers
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    startTransition(() => {
      dispatch({ type: "SET_SEARCH", payload: value });
    });
  }, []);

  const handleCategory = useCallback((e) => {
    dispatch({ type: "SET_CATEGORY", payload: e.target.value });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  // Expose resetFilters to parent
  useImperativeHandle(ref, () => ({
    resetFilters: handleReset,
  }));

  return (
    <div className={theme}>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      <div className="filter-bar">
        <input
          ref={searchRef}
          placeholder="Search products..."
          value={filterState.search}
          onChange={handleSearch}
        />
        <select value={filterState.category} onChange={handleCategory}>
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
        </select>
        <button onClick={handleReset} className="btn-secondary">
          Reset Filters
        </button>
      </div>

      {isPending && (
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          Updating results...
        </p>
      )}

      <div
        className="product-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-image-container">
              <img src={p.image} alt={p.name} className="product-image" />
            </div>
            <div className="product-info">
              <p className="product-category">{p.category}</p>
              <h3 className="product-title">{p.name}</h3>
              <p className="product-price">${p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProductList;
