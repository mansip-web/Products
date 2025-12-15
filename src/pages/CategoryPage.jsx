import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../store/api/productsApi";
import ProductGrid from "../components/product/ProductGrid";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // RTK Query
  const { data: productsData, isLoading, error } = useGetProductsQuery();

  const products = productsData || [];

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {categoryName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading products: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      <header className="category-header">
        <button
          className="back-btn"
          onClick={() => navigate("/user-dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h1>{categoryName}</h1>
      </header>

      <main className="category-content">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found in {categoryName}</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  );
}
