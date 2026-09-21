
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect based on role
      const role = response.data.user.role;

      if (role === "patient") {
        navigate("/patient/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Invalid email or password"
        );
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-card">

        <div className="auth-logo">
          🩺
        </div>

        <p className="auth-brand">
          MEDIHISTORY
        </p>

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          AI-Powered Clinical History System
        </p>

        <div className="auth-welcome">
          <span>🔐</span>
          <p>
            Sign in to securely access your medical history.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
            <label>
              Email Address
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                🔒
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                Login
                <span>→</span>
              </>
            )}
          </button>

        </form>

        <div className="auth-divider">
          <span></span>
          <p>Secure Healthcare Access</p>
          <span></span>
        </div>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

        <div className="auth-security">
          <span>🔒</span>
          <p>
            Your healthcare information is protected
            and securely handled.
          </p>
        </div>

        <p className="auth-footer">
          MediHistory • Digital Patient Medical History System
        </p>

      </div>
    </div>
  );
}

export default Login;
