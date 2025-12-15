import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import "../../user/UserDashboard.css";

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Redux State
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInCart = cartItems.some((item) => item.product_id === product.id);
  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === product.id
  );

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.tagName === "BUTTON") return;
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    dispatch(addToCart({ userId: user.id, productId: product.id }));
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    dispatch(toggleWishlist({ userId: user.id, productId: product.id }));
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <button
        className={`like-btn ${isInWishlist ? "liked" : ""}`}
        onClick={handleToggleWishlist}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? "❤️" : "🤍"}
      </button>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">₹{product.price}</p>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        {isInCart ? "✓ In Cart" : "🛒 Add to Cart"}
      </button>
    </div>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
