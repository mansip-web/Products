import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the auth callback from email confirmation
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          alert("Authentication failed: " + error.message);
          navigate("/login");
          return;
        }

        if (session) {
          // User is authenticated, check their role
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          // If role doesn't exist or error, default to user dashboard
          if (roleError || !roleData) {
            console.log(
              "No role found in callback, defaulting to user dashboard"
            );
            navigate("/user-dashboard");
          } else {
            // Route based on role
            if (roleData.role === "admin") {
              console.log("Admin user detected, routing to admin dashboard");
              navigate("/admin-dashboard");
            } else {
              console.log("Regular user detected, routing to user dashboard");
              navigate("/user-dashboard");
            }
          }
        } else {
          // No session, redirect to login
          navigate("/login");
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Verifying your email...</h2>
      <p>Please wait while we confirm your account.</p>
    </div>
  );
}
