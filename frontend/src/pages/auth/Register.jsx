import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      setSuccess(
        response.data.message ||
          "Account created successfully!"
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("patient");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to create account"
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
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join the MediHistory healthcare platform
        </p>

        <div className="auth-welcome">
          <span>✨</span>

          <p>
            Create your account to securely manage
            your medical information.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">
            <label>
              Full Name
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                👤
              </span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength="6"
              />
            </div>

            <small className="password-hint">
              Use at least 6 characters.
            </small>
          </div>

          <div className="form-group">
            <label>
              Account Role
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                🏥
              </span>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="auth-select"
              >
                <option value="patient">
                  Patient
                </option>

                <option value="doctor">
                  Doctor
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span>

              <p>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="auth-success">
              <span>✓</span>

              <p>
                {success}
              </p>
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}
          </button>

        </form>

        <div className="auth-divider">
          <span></span>

          <p>
            SECURE HEALTHCARE ACCESS
          </p>

          <span></span>
        </div>

        <p className="auth-link">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

        <div className="auth-security">
          <span>🔒</span>

          <p>
            Your account information is securely
            handled by MediHistory.
          </p>
        </div>

        <p className="auth-footer">
          MediHistory • Digital Patient Medical History System
        </p>

      </div>
    </div>
  );
}

export default Register;
