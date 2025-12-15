import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabaseClient";
import "./ProductHighlights.css";

const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*").limit(5); // Fetching top 5 products as highlights

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const ProductHighlights = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["productHighlights"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div className="highlights-loading">Loading highlights...</div>;
  }

  if (isError) {
    return (
      <div className="highlights-error">
        Error loading highlights: {error.message}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="highlights-empty">No highlights found.</div>;
  }

  return (
    <div className="product-highlights">
      <h2>Product Highlights</h2>
      <div className="highlights-grid">
        {products.map((product) => (
          <div key={product.id} className="highlight-card">
            <img
              src={product.image}
              alt={product.name}
              className="highlight-image"
            />
            <div className="highlight-info">
              <h3>{product.name}</h3>
              <p className="highlight-price">${product.price}</p>
              <p className="highlight-category">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlights;
