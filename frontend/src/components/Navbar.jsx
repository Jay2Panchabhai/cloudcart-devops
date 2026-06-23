import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = ["Electronics", "Fashion", "Home & Living", "Sports"];

  return (
    <>
      {/* Top strip */}
      <div style={styles.topStrip}>
        <span>🚚 Free delivery on orders above ₹999</span>
        <span style={{ marginLeft: "32px" }}>Use code: <strong>CLOUD10</strong> for 10% off</span>
      </div>

      {/* Main navbar */}
      <nav style={styles.nav}>
        {/* Logo */}
        <Link to="/" style={styles.brand}>
          <div style={styles.logoBox}>
            <span style={styles.logoIcon}>☁</span>
          </div>
          <div>
            <div style={styles.brandName}>CloudCart</div>
            <div style={styles.brandSub}>shop everything</div>
          </div>
        </Link>

        {/* Search bar - center */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchBox}>
            <select
              style={styles.searchCat}
              onChange={(e) => {}}
            >
              <option value="">All</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={styles.searchDivider} />
            <input
              style={styles.searchInput}
              placeholder="Search for products, brands and more…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={styles.searchBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </form>

        {/* Right section */}
        <div style={styles.rightSection}>
          {user ? (
            <div style={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
              <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
              <div style={styles.userInfo}>
                <span style={styles.userGreet}>Hello, {user.name?.split(" ")[0]}</span>
                <span style={styles.userSub}>Account ▾</span>
              </div>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropAvatar}>{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={styles.dropName}>{user.name}</div>
                      <div style={styles.dropEmail}>Signed in</div>
                    </div>
                  </div>
                  <div style={styles.dropDivider} />
                  <Link to="/orders" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                  <Link to="/cart" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                    🛒 My Cart
                  </Link>
                  <div style={styles.dropDivider} />
                  <button style={styles.dropLogout} onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Sign In</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </div>
          )}

          {user && (
            <Link to="/orders" style={styles.iconBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span style={styles.iconLabel}>Orders</span>
            </Link>
          )}

          <Link to="/cart" style={styles.cartBtn}>
            <div style={styles.cartIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span style={styles.cartBadge}>0</span>
            </div>
            <span style={styles.iconLabel}>Cart</span>
          </Link>
        </div>
      </nav>

      {/* Category nav */}
      <div style={styles.catNav}>
        <div style={styles.catNavInner}>
          <Link to="/products" style={styles.catLink}>
            🔥 Today's Deals
          </Link>
          {categories.map(cat => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} style={styles.catLink}>
              {cat}
            </Link>
          ))}
          <Link to="/products" style={{ ...styles.catLink, color: "#fbbf24" }}>
            ⭐ Top Rated
          </Link>
          <Link to="/products" style={{ ...styles.catLink, color: "#f87171" }}>
            🏷️ Sale
          </Link>
        </div>
      </div>
    </>
  );
}

const styles = {
  topStrip: {
    background: "#1e293b",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    padding: "7px 20px",
    fontSize: "0.78rem",
    letterSpacing: "0.2px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 40px",
    background: "#0f172a",
    gap: "24px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },

  logoBox: {
    width: "38px",
    height: "38px",
    background: "#3b82f6",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
  },

  logoIcon: { color: "#fff" },

  brandName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "1.2rem",
    lineHeight: 1.1,
    letterSpacing: "-0.3px",
  },

  brandSub: {
    color: "#64748b",
    fontSize: "0.65rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  searchForm: { flex: 1, maxWidth: "600px" },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #3b82f6",
  },

  searchCat: {
    border: "none",
    outline: "none",
    padding: "0 12px",
    fontSize: "0.8rem",
    background: "#f1f5f9",
    color: "#374151",
    height: "44px",
    cursor: "pointer",
    fontWeight: 600,
  },

  searchDivider: {
    width: "1px",
    height: "24px",
    background: "#e2e8f0",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "0 16px",
    fontSize: "0.92rem",
    color: "#1e293b",
    height: "44px",
    background: "transparent",
  },

  searchBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "0 18px",
    height: "44px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },

  authBtns: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  loginBtn: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1.5px solid rgba(255,255,255,0.25)",
    fontSize: "0.85rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  registerBtn: {
    background: "#3b82f6",
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "8px",
    position: "relative",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.85rem",
    flexShrink: 0,
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },

  userGreet: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.82rem",
  },

  userSub: {
    color: "#94a3b8",
    fontSize: "0.72rem",
  },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    minWidth: "220px",
    zIndex: 2000,
    padding: "8px 0",
    border: "1px solid #e2e8f0",
  },

  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
  },

  dropAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
  },

  dropName: {
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "0.88rem",
  },

  dropEmail: {
    color: "#64748b",
    fontSize: "0.75rem",
  },

  dropDivider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "4px 0",
  },

  dropItem: {
    display: "block",
    padding: "10px 16px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "0.88rem",
    fontWeight: 500,
  },

  dropLogout: {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    color: "#ef4444",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
  },

  iconBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    padding: "6px 10px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#cbd5e1",
    border: "1px solid transparent",
  },

  iconLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "#94a3b8",
  },

  cartBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    padding: "6px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#fff",
    background: "#3b82f6",
    position: "relative",
  },

  cartIconWrap: {
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "#ef4444",
    color: "#fff",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.6rem",
    fontWeight: 800,
  },

  catNav: {
    background: "#1e293b",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky",
    top: "67px",
    zIndex: 999,
  },

  catNavInner: {
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    gap: "4px",
    overflowX: "auto",
    scrollbarWidth: "none",
  },

  catLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "11px 16px",
    fontSize: "0.83rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
    display: "block",
    borderBottom: "2px solid transparent",
    transition: "color 0.2s",
  },
};

export default Navbar;