import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import Login from './Login';
import SignUp from './SignUp';

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="auth-hero">
        <div className="auth-logo-container">
          <div className="shopping-logo">🛍️</div>
          <h1>ShopEase</h1>
          <p>Your one-stop shopping destination</p>
        </div>
        <div className="auth-features">
          <div className="feature">
            <span>🌟</span>
            <h3>Exclusive Deals</h3>
            <p>Get access to member-only discounts and offers</p>
          </div>
          <div className="feature">
            <span>🚚</span>
            <h3>Fast Delivery</h3>
            <p>Quick shipping right to your doorstep</p>
          </div>
          <div className="feature">
            <span>🛡️</span>
            <h3>Secure Checkout</h3>
            <p>Your payment info is always protected</p>
          </div>
        </div>
      </div>
      
      <div className="auth-forms-container">
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        <div className="auth-form-wrapper">
          {isLogin ? <Login /> : <SignUp />}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>
          <div className="social-auth">
            <button className="social-btn google">
              <span className="social-icon">G</span>
              Google
            </button>
            <button className="social-btn facebook">
              <span className="social-icon">f</span>
              Facebook
            </button>
          </div>
        </div>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              className="auth-toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
          <p className="terms">
            By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
