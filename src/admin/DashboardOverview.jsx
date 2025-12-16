import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./DashboardOverview.css";
import RecentActivity from "../components/RecentActivity";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const salesData = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 2000, orders: 12 },
  { name: "Thu", sales: 2780, orders: 20 },
  { name: "Fri", sales: 1890, orders: 15 },
  { name: "Sat", sales: 2390, orders: 16 },
  { name: "Sun", sales: 3490, orders: 22 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Fashion", value: 300 },
  { name: "Home", value: 300 },
  { name: "Beauty", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardOverview({ productCount }) {
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Step 1: Get all profiles
      const { data: allProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      // Step 2: Get admin IDs
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) {
        console.error("Error fetching admin roles:", rolesError);
        return;
      }

      const adminIds = new Set(adminRoles.map((r) => r.user_id));

      // Step 3: Filter out admins
      const regularUsers = allProfiles.filter((user) => !adminIds.has(user.id));

      setUsers(regularUsers);
      setTotalUsers(regularUsers.length);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    }
  };

  const [pendingOrders, setPendingOrders] = useState(0);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [pendingOrdersList, setPendingOrdersList] = useState([]);

  const fetchPendingOrdersList = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pending orders list:", error);
        return;
      }
      setPendingOrdersList(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (error) {
          // Handle missing table error (PGRST205)
          if (
            error.code === "PGRST205" ||
            error.code === "404" ||
            error.message.includes("404")
          ) {
            console.warn("Orders table not found, using mock data/0.");
            return;
          }
          console.error("Error fetching pending orders:", error);
          return;
        }
        setPendingOrders(count || 0);
      } catch (err) {
        console.warn("Failed to fetch orders (table might be missing).");
      }
    };

    fetchPendingOrders();
  }, []);

  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("total")
          .eq("status", "completed");

        if (error) {
          if (
            error.code === "PGRST205" ||
            error.code === "404" ||
            error.message.includes("404")
          ) {
            return; // Suppress missing table error
          }
          console.error("Error fetching sales:", error);
          return;
        }

        const sum = data?.reduce((acc, order) => {
          return acc + (order.total || 0);
        }, 0);

        setTotalSales(sum || 0);
      } catch (err) {
        console.warn("Failed to fetch sales.");
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="dashboard-overview">
      <h1 className="admin-title">Dashboard Overview</h1>

      <div className="admin-stats">
        <div className="card">
          <h3>Total Products</h3>
          <p>{productCount}</p>
        </div>

        <div
          className="card"
          onClick={() => {
            setShowUsers(!showUsers);
            if (!showUsers) fetchUsers();
          }}
          style={{ cursor: "pointer" }}
        >
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>

        <div className="card">
          <h3>Total Sales</h3>
          <p>{totalSales}</p>
        </div>

        <div
          className="card"
          onClick={() => {
            if (!showPendingOrders) fetchPendingOrdersList();
            setShowPendingOrders(!showPendingOrders);
          }}
          style={{ cursor: "pointer" }}
        >
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>

        {showUsers && (
          <div className="users-list-container">
            <div className="users-list">
              <h4>Users List</h4>
              {users.length === 0 && <p>No users found</p>}
              {users.map((user) => (
                <div key={user.id} className="user-item">
                  <p>
                    <b>{user.name}</b>
                  </p>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPendingOrders && (
          <div className="users-list-container">
            <div className="users-list">
              <h4>Pending Orders</h4>
              {pendingOrdersList.length === 0 && <p>No pending orders</p>}
              {pendingOrdersList.map((order) => (
                <div key={order.id} className="user-item">
                  <p>
                    <b>Order #{order.order_number}</b>
                  </p>
                  <p>Total: ${order.total}</p>
                  <p>
                    <small>
                      {new Date(order.created_at).toLocaleDateString()}
                    </small>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Weekly Sales Overview</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Sales by Category</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Activity</h2>
        <RecentActivity />
      </div>
    </div>
  );
}
