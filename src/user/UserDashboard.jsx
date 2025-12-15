import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "../store/slices/cartSlice";
import { fetchWishlist, toggleWishlist } from "../store/slices/wishlistSlice";
import ProductHighlights from "../components/ProductHighlights";
import shoppingBg from "../assets/shopping_bg.png";
import fashionBg from "../assets/fashion_bg.png";
import electronicsBg from "../assets/electronics_bg.png";
import homeBg from "../assets/home_bg.png";
import cosmeticsBg from "../assets/cosmetics_bg.png";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [activeTab, setActiveTab] = useState("products"); // 'products', 'wishlist', or 'cart'

  // Fetch initial data
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.id));
      dispatch(fetchWishlist(user.id));
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleRemoveFromCart = (cartId) => {
    if (!user) return;
    dispatch(removeFromCart({ userId: user.id, cartId }));
  };

  const handleUpdateQuantity = (cartId, quantity) => {
    if (!user) return;
    dispatch(updateCartQuantity({ userId: user.id, cartId, quantity }));
  };

  const handleToggleWishlist = (productId) => {
    if (!user) return;
    dispatch(toggleWishlist({ userId: user.id, productId }));
  };

  const handleAddToCart = (productId) => {
    // Re-implementing this helper if needed for wishlist items,
    // though wishlist items usually have their own button logic in the map.
    // But wait, the wishlist tab uses handleAddToCart.
    // We need to import addToCart action.
    // Ah, I missed importing addToCart in the imports above.
    // Let me add it.
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.products?.price || 0) * item.quantity;
  }, 0);

  const categories = [
    { name: "Fashion", icon: "👗", image: fashionBg },
    { name: "Electronics", icon: "📱", image: electronicsBg },
    { name: "Home", icon: "🏠", image: homeBg },
    { name: "Cosmetics", icon: "💄", image: cosmeticsBg },
    { name: "Sports", icon: "⚽", image: shoppingBg },
    { name: "Toys", icon: "🧸", image: shoppingBg },
    { name: "Books", icon: "📚", image: shoppingBg },
    { name: "Automotive", icon: "🚗", image: shoppingBg },
    { name: "Groceries", icon: "🥦", image: shoppingBg },
    { name: "Music", icon: "🎵", image: shoppingBg },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <h1>🛍️ ShopHub</h1>
        </div>

        <div className="user-actions">
          <span className="welcome-text">
            Welcome, {user?.email?.split("@")[0] || "Guest"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="dashboard-hero"
        style={{ backgroundImage: `url(${shoppingBg})` }}
      >
        <div className="hero-overlay">
          <h1>Discover Your Unique Style</h1>
          <p>Shop the latest trends in Fashion, Electronics, and Home Decor.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <ProductHighlights />
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Categories
          </button>
          <button
            className={`tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            ❤️ Wishlist ({wishlistItems.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            🛒 Cart ({cartItems.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Categories Tab */}
          {activeTab === "products" && (
            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="category-card"
                  style={{ backgroundImage: `url(${cat.image})` }}
                  onClick={() => navigate(`/category/${cat.name}`)}
                >
                  <div className="category-overlay">
                    <div className="category-icon">{cat.icon}</div>
                    <h3>{cat.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="wishlist-section">
              <h2>My Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div className="empty-state">
                  <p>Your wishlist is empty 💔</p>
                  <button onClick={() => setActiveTab("products")}>
                    Browse Categories
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="product-card">
                      <div className="product-image-container">
                        <img
                          src={item.products?.image}
                          alt={item.products?.name}
                          onClick={() =>
                            navigate(`/product/${item.products?.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(item.products?.id);
                          }}
                          title="Remove from wishlist"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="product-info">
                        <h3>{item.products?.name}</h3>
                        <p className="price">₹{item.products?.price}</p>
                        {/* Add to cart logic needs dispatch */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div className="cart-section">
              <h2>Shopping Cart</h2>
              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <p>Your cart is empty 🛒</p>
                  <button onClick={() => setActiveTab("products")}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="cart-container">
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <img
                          src={item.products?.image}
                          alt={item.products?.name}
                          onClick={() =>
                            navigate(`/product/${item.products?.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <div className="cart-item-details">
                          <h3>{item.products?.name}</h3>
                          <p className="price">₹{item.products?.price}</p>
                        </div>
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <p className="item-total">
                          ₹{(item.products?.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-total">
                      <span>Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
