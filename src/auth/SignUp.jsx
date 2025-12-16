import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name, // Pass name as metadata
            name: name, // Redundant but safe
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // If there's no trigger, we might need to insert into profiles manually
        // But usually metadata is the way. Let's assume metadata trigger exists or add manual insert if needed.
        // For robustness, let's try to update the profile if the user is created
        if (data?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({ id: data.user.id, name: name, email: email });

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }

        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );
        // Optional: clear form
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      
      <form onSubmit={handleSignup} className="auth-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-container">
            <input
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="password-hint">Must be at least 6 characters</p>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="auth-loading"></span> Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </>
  );
}
