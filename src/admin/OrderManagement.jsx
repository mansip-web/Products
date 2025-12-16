import React, { useState } from "react";
import "./OrderManagement.css";
import { supabase } from "../utils/supabaseClient";
import { useEffect } from "react";

const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2024-12-14",
    total: 120.5,
    status: "Pending",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2024-12-13",
    total: 450.0,
    status: "Shipped",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    date: "2024-12-12",
    total: 89.99,
    status: "Delivered",
    items: 2,
  },
  {
    id: "ORD-004",
    customer: "Sarah Williams",
    date: "2024-12-12",
    total: 210.0,
    status: "Pending",
    items: 4,
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    date: "2024-12-11",
    total: 35.0,
    status: "Cancelled",
    items: 1,
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("All");

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      id,
      order_number,
      total,
      status,
      created_at,
      profiles (
        name
      )
    `
      )
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
      id,
      order_number,
      status,
      created_at,
      profiles (
        name,
        email
      ),
      order_items (
        quantity,
        products (
          name
        )
      )
    `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setOrders(data);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f39c12";
      case "Shipped":
        return "#3498db";
      case "Delivered":
        return "#2ecc71";
      case "Cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    fetchOrders(); // refresh UI
  };

  return (
    <div className="admin-section">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="orders-filter">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>

                <td>
                  <div>{order.profiles?.name}</div>
                  <small>{order.profiles?.email}</small>
                </td>

                <td>{new Date(order.created_at).toLocaleDateString()}</td>

                <td>
                  {(order.order_items || []).map((item, idx) => (
                    <div key={idx}>
                      {item.products?.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td>${order.total}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
