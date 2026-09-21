import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✚</span>
          <span className="logo-text">MediHistory</span>
        </Link>

        <div className="navbar-right">
          {!user ? (
            <div className="guest-navigation">
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="nav-register">
                Register
              </Link>
            </div>
          ) : (
            <div className="user-navigation">

              <div className="user-info">
                <div className="user-avatar">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div className="user-details">
                  <span className="welcome-text">
                    Welcome, {user.name}
                  </span>

                  <span className="role-badge">
                    {user.role}
                  </span>
                </div>
              </div>

              {user.role === "patient" && (
                <div className="navigation-links">

                  <Link
                    to="/patient/dashboard"
                    className="nav-link"
                  >
                    <span>⌂</span>
                    Dashboard
                  </Link>

                  <Link
                    to="/patient/profile"
                    className="nav-link"
                  >
                    <span>👤</span>
                    Profile
                  </Link>

                  <Link
                    to="/patient/history"
                    className="nav-link"
                  >
                    <span>📋</span>
                    Medical History
                  </Link>

                </div>
              )}

              {user.role === "doctor" && (
                <div className="navigation-links">
                  <Link
                    to="/doctor/dashboard"
                    className="nav-link"
                  >
                    <span>⌂</span>
                    Dashboard
                  </Link>
                </div>
              )}

              {user.role === "admin" && (
                <div className="navigation-links">
                  <Link
                    to="/admin/dashboard"
                    className="nav-link"
                  >
                    <span>⌂</span>
                    Dashboard
                  </Link>
                </div>
              )}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;