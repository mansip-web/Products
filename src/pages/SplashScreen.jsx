import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-animation">
          <span className="logo-icon">🛍️</span>
        </div>
        <h1 className="splash-title">ShopHub</h1>
        <p className="splash-subtitle">Your Premium Shopping Experience</p>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
}
