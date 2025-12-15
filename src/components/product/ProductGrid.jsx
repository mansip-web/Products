import React from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

const ProductGrid = React.memo(({ products }) => {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
