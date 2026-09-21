import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVoiceLanguage } from "./VoiceLanguageContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const {
    language,
    setLanguage,
    languages,
    t,
  } = useVoiceLanguage();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
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

        <Link
          to="/"
          className="navbar-logo"
        >
          <span className="logo-icon">
            ✚
          </span>

          <span className="logo-text">
            MediHistory
          </span>
        </Link>

        <div className="navbar-right">

          <div className="voice-language-selector">
            <span className="language-icon">
              🌐
            </span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              className="voice-language-select"
              aria-label={t("voiceLanguage")}
            >
              {languages.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                >
                  {item.nativeLabel}
                </option>
              ))}
            </select>
          </div>

          {!user ? (
            <div className="guest-navigation">

              <Link
                to="/login"
                className="nav-link"
              >
                {t("login")}
              </Link>

              <Link
                to="/register"
                className="nav-register"
              >
                {t("register")}
              </Link>

            </div>
          ) : (
            <div className="user-navigation">

              <div className="user-info">

                <div className="user-avatar">
                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <div className="user-details">

                  <span className="welcome-text">
                    {t("welcome")},{" "}
                    {user.name}
                  </span>

                  <span className="role-badge">
                    {t(user.role)}
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
                    {t("dashboard")}
                  </Link>

                  <Link
                    to="/patient/profile"
                    className="nav-link"
                  >
                    <span>👤</span>
                    {t("profile")}
                  </Link>

                  <Link
                    to="/patient/history"
                    className="nav-link"
                  >
                    <span>📋</span>
                    {t("medicalHistory")}
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
                    {t("dashboard")}
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
                    {t("dashboard")}
                  </Link>

                </div>
              )}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span>↪</span>
                {t("logout")}
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;