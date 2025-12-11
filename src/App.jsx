import { useState, useEffect, useRef } from "react";
import ProductList from "./components/ProductList";
import Newsletter from "./components/Newsletter";

function App() {
  const productListRef = useRef();
  const handleParentReset = () => {
    productListRef.current.resetFilters();
  };

  return (
    <div className="container">
      <h1 className="title-hero">Product Filter Dashboard</h1>
      <button onClick={handleParentReset}>Reset All Filters (Parent)</button>
      <ProductList ref={productListRef} />
      <Newsletter />
    </div>
  );
}

export default App;
