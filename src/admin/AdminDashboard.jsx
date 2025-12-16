import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import DashboardOverview from "./DashboardOverview";
import OrderManagement from "./OrderManagement";
import Settings from "./Settings";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("Error fetching products:", error);
      else setProductCount(data.length);
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderView = () => {
    switch (activeView) {
      case "products":
        return <ProductManagement />;
      case "users":
        return <UserManagement />;
      case "orders":
        return <OrderManagement />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview productCount={productCount} />;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <ul className="admin-menu">
          <li
            className={activeView === "dashboard" ? "active" : ""}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard Overview
          </li>
          <li
            className={activeView === "products" ? "active" : ""}
            onClick={() => setActiveView("products")}
          >
            Manage Products
          </li>
          <li
            className={activeView === "users" ? "active" : ""}
            onClick={() => setActiveView("users")}
          >
            Manage Users
          </li>
          <li
            className={activeView === "orders" ? "active" : ""}
            onClick={() => setActiveView("orders")}
          >
            Orders
          </li>
          <li
            className={activeView === "settings" ? "active" : ""}
            onClick={() => setActiveView("settings")}
          >
            Settings
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">{renderView()}</main>
    </div>
  );
}
