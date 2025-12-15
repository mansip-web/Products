import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import "./AdminDashboard.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from user_list view first (if it exists)
      const { data: viewData, error: viewError } = await supabase
        .from("user_list")
        .select("*");

      if (!viewError && viewData) {
        setUsers(viewData);
        return;
      }

      // Fallback: Fetch from user_roles table
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Map user_roles to display format
      const formattedUsers = (userRoles || []).map((role) => ({
        ...role,
        email: "Run USER_LIST_VIEW.sql to see emails",
        last_sign_in_at: "N/A",
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never" || dateString === "N/A")
      return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>User Management</h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>User Management</h2>
        <div
          className="error-message"
          style={{
            padding: "20px",
            background: "#fee",
            borderRadius: "8px",
            color: "#c33",
          }}
        >
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={fetchUsers}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>User Management</h2>
        <button
          onClick={fetchUsers}
          style={{
            padding: "10px 20px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {!users[0]?.email?.includes("@") && (
        <div
          style={{
            padding: "16px",
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "#856404",
          }}
        >
          <p style={{ margin: 0, fontWeight: "600" }}>⚠️ To see user emails:</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
            Run the <code>USER_LIST_VIEW.sql</code> script in Supabase SQL
            Editor (found in migrations folder)
          </p>
        </div>
      )}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Total Users: <strong>{users.length}</strong>
          </p>
        </div>

        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            <p>No users found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8f9fa",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Joined</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Last Sign In
                  </th>
                  <th style={{ padding: "12px", textAlign: "center" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id || index}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          {user.email && user.email.includes("@")
                            ? user.email[0].toUpperCase()
                            : "?"}
                        </div>
                        <span>{user.email || "N/A"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          background:
                            user.role === "admin" ? "#ffe0e0" : "#e0f0ff",
                          color: user.role === "admin" ? "#c33" : "#0066cc",
                          fontWeight: "600",
                          fontSize: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#666" }}>
                      {formatDate(user.created_at || user.auth_created_at)}
                    </td>
                    <td style={{ padding: "12px", color: "#666" }}>
                      {formatDate(user.last_sign_in_at)}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#4caf50",
                        }}
                      ></span>
                      <span
                        style={{
                          marginLeft: "6px",
                          color: "#4caf50",
                          fontSize: "12px",
                        }}
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#666",
        }}
      >
        <p>
          <strong>Note:</strong> User emails are fetched from the{" "}
          <code>user_list</code> view. If emails are not showing, run{" "}
          <code>migrations/USER_LIST_VIEW.sql</code> in Supabase SQL Editor.
        </p>
      </div>
    </div>
  );
}
