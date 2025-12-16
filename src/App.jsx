import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Error Boundary
import ErrorBoundary from "./components/common/ErrorBoundary";

// Auth Pages
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import AuthLayout from "./auth/AuthLayout";
import AuthCallback from "./auth/AuthCallback";
import SplashScreen from "./pages/SplashScreen";

// Dashboard Pages
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoryPage from "./pages/CategoryPage";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./admin/Users";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/signup" element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              } />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route
                path="/category/:categoryName"
                element={
                  <ProtectedRoute>
                    <CategoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/users" element={<Users />} />
              {/* Default Redirect or Dashboard */}
              {/* This route was changed from /dashboard to /user-dashboard and the ProtectedRoute wrapper was removed. */}
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
