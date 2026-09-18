import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <nav>
      {/* Logo */}
      <div>
        <Link to="/">
          <strong>MediHistory</strong>
        </Link>
      </div>

      {/* Navigation */}
      <div>
        {!user ? (
          <>
            <Link to="/login">
              Login
            </Link>

            {" | "}

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span>
              Welcome, {user.name}
            </span>

            {" | "}

            {user.role === "patient" && (
              <>
                <Link to="/patient/dashboard">
                  Dashboard
                </Link>

                {" | "}

                <Link to="/patient/profile">
                  Profile
                </Link>

                {" | "}

                <Link to="/patient/history">
                  Medical History
                </Link>

                {" | "}
              </>
            )}

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

