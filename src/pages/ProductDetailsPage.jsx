import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { useGetProductByIdQuery } from "../store/api/productsApi";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import "../user/UserDashboard.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  // RTK Query
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  // Redux State
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Check if item is in cart/wishlist
  const isInCart = cartItems.some((item) => item.product_id === parseInt(id));
  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === parseInt(id)
  );

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    dispatch(addToCart({ userId: user.id, productId: parseInt(id) }));
  };

  const handleToggleWishlist = () => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    dispatch(toggleWishlist({ userId: user.id, productId: parseInt(id) }));
  };

  if (isLoading) {
    return (
      <div className="user-container">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="user-container">
        <div className="no-products">
          <h2>Product not found</h2>
          <button
            className="browse-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="product-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-details-content">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-info">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">₹{product.price}</p>

            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                {isInCart ? "✓ In Cart" : "🛒 Add to Cart"}
              </button>

              <button
                className={`wishlist-action-btn ${
                  isInWishlist ? "active" : ""
                }`}
                onClick={handleToggleWishlist}
              >
                {isInWishlist ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
              </button>
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>
                {product.description ||
                  `This is a high-quality ${product.name} in the ${product.category} category. 
                  Perfect for your needs with excellent features and great value for money.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
