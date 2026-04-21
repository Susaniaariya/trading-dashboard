import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";

// ✅ FIX: Pointing exactly to the file in your public folder
// Ensure the file in your public folder is renamed to "logo.png"
const LOGO_URL = "/LOGO2.png";

const navItems = [
  { label: "Dashboard", to: "/", icon: "🏠", index: 0 },
  { label: "Orders", to: "/orders", icon: "📑", index: 1 },
  { label: "Holdings", to: "/holdings", icon: "💼", index: 2 },
  { label: "Positions", to: "/positions", icon: "🎯", index: 3 },
  { label: "Funds", to: "/funds", icon: "🏦", index: 4 },
  { label: "Apps", to: "/apps", icon: "🚀", index: 5 },
];

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [virtualBalance, setVirtualBalance] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "http://localhost:3000/login";
      return;
    }

    axios
      .get("http://localhost:3002/me", { headers: { Authorization: token } })
      .then(({ data }) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setVirtualBalance(data.virtualBalance ?? 10000);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "http://localhost:3000/login";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "http://localhost:3000/login";
  };

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email
      ? email.slice(0, 2).toUpperCase()
      : "ZU";

  const displayName = username || email || "My Account";

  return (
    <div className="menu-container">
      {/* Logo Section */}
      <div className="menu-logo-wrap" style={{ padding: "10px 0" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={LOGO_URL}
            alt="Sangini Logo"
            style={{
              height: "45px",
              width: "auto",
              mixBlendMode: "multiply",
              filter: "contrast(1.1) saturate(1.1)",
            }}
            onError={(e) => {
              console.error("Logo failed to load at:", LOGO_URL);
              e.target.style.display = "none"; // Hides broken icon if path is wrong
            }}
          />
        </Link>
      </div>

      {/* Nav links */}
      <div className="menus">
        <ul>
          {navItems.map(({ label, to, icon, index }) => (
            <li key={label}>
              <Link
                to={to}
                className={`menu-nav-link${selectedMenu === index ? " active" : ""}`}
                onClick={() => setSelectedMenu(index)}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                <span
                  style={{ fontWeight: selectedMenu === index ? "700" : "400" }}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <button
              className="menu-back-btn"
              onClick={() =>
                (window.location.href = "http://localhost:3000/apps")
              }
              style={{ marginTop: "15px", opacity: 0.7, cursor: "pointer" }}
            >
              ⬅ Exit Terminal
            </button>
          </li>
        </ul>
      </div>

      {/* Wallet Balance Badge */}
      {virtualBalance !== null && (
        <div
          style={{
            background: "linear-gradient(135deg, #ad1457, #6a1b9a)",
            color: "#fff",
            padding: "0.5rem 1.2rem",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginRight: "1.5rem",
            boxShadow: "0 4px 15px rgba(106, 27, 154, 0.2)",
          }}
        >
          <span style={{ marginRight: "8px" }}>💳</span>₹
          {virtualBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      )}

      {/* Profile Area */}
      <div
        className="profile"
        onClick={() => setIsProfileDropdownOpen((o) => !o)}
      >
        <div
          className="avatar"
          style={{ background: "linear-gradient(135deg, #ad1457, #e91e63)" }}
        >
          {initials}
        </div>
        <div className="profile-info">
          <p
            className="profile-name"
            style={{ color: "#333", fontWeight: "600" }}
          >
            {displayName}
          </p>
          <p
            className="profile-sub"
            style={{ color: "#ad1457", fontSize: "0.75rem" }}
          >
            Live Terminal ▾
          </p>
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            <button className="dropdown-item">👤 Profile</button>
            <button className="dropdown-item">⚙️ Settings</button>
            <div
              style={{ height: "1px", background: "#eee", margin: "5px 0" }}
            />
            <button className="dropdown-item logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
