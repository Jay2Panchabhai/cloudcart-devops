import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_USER_API || "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
      login(data.user, data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel - branding */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <Link to="/" style={styles.backLink}>← Back to store</Link>

          <div style={styles.brandSection}>
            <div style={styles.logoWrap}>
              <span style={styles.logoIcon}>☁</span>
            </div>
            <h1 style={styles.brandName}>CloudCart</h1>
            <p style={styles.brandTagline}>India's trusted online shopping destination</p>
          </div>

          <div style={styles.valueProps}>
            {[
              { icon: "🚀", title: "24-hour delivery", sub: "Lightning fast across India" },
              { icon: "🔒", title: "Secure payments", sub: "Bank-grade encryption" },
              { icon: "⭐", title: "50,000+ products", sub: "Curated top brands" },
              { icon: "↩️", title: "Easy returns", sub: "Hassle-free 30-day policy" },
            ].map(vp => (
              <div key={vp.title} style={styles.valueProp}>
                <div style={styles.vpIcon}>{vp.icon}</div>
                <div>
                  <div style={styles.vpTitle}>{vp.title}</div>
                  <div style={styles.vpSub}>{vp.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.trustBadge}>
            <span style={styles.trustStar}>★★★★★</span>
            <span style={styles.trustText}>4.8/5 from 2M+ happy customers</span>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign in</h2>
            <p style={styles.formSub}>Welcome back! Enter your credentials to continue.</p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputPrefix}>✉️</span>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.field}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                <button type="button" style={styles.forgotBtn}>
                  Forgot password?
                </button>
              </div>
              <div style={styles.inputWrap}>
                <span style={styles.inputPrefix}>🔑</span>
                <input
                  style={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPass(s => !s)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <label style={styles.rememberRow}>
              <input type="checkbox" style={{ accentColor: "#3b82f6" }} />
              <span style={styles.rememberText}>Keep me signed in</span>
            </label>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <span style={styles.loadingDots}>Signing in…</span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.socialBtns}>
            <button style={styles.socialBtn}>
              <span>🔵</span> Google
            </button>
            <button style={styles.socialBtn}>
              <span>📘</span> Facebook
            </button>
          </div>

          <p style={styles.switchText}>
            New to CloudCart?{" "}
            <Link to="/register" style={styles.switchLink}>
              Create a free account →
            </Link>
          </p>

          <p style={styles.termsText}>
            By signing in, you agree to our{" "}
            <span style={styles.termsLink}>Terms of Service</span> and{" "}
            <span style={styles.termsLink}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "calc(100vh - 100px)",
  },

  leftPanel: {
    flex: 1,
    background: "#0f172a",
    padding: "48px 56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  leftContent: { maxWidth: "380px", width: "100%" },

  backLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: 600,
    display: "block",
    marginBottom: "48px",
    transition: "color 0.2s",
  },

  brandSection: { marginBottom: "48px" },

  logoWrap: {
    width: "52px",
    height: "52px",
    background: "#3b82f6",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    marginBottom: "16px",
  },

  logoIcon: { color: "#fff" },

  brandName: {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: 900,
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },

  brandTagline: {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: 0,
    lineHeight: 1.5,
  },

  valueProps: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
  },

  valueProp: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  vpIcon: {
    width: "40px",
    height: "40px",
    background: "#1e293b",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    flexShrink: 0,
  },

  vpTitle: { color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" },
  vpSub: { color: "#64748b", fontSize: "0.78rem" },

  trustBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#1e293b",
    borderRadius: "10px",
    border: "1px solid #334155",
  },
  trustStar: { color: "#f59e0b", fontSize: "0.9rem" },
  trustText: { color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600 },

  // Right panel
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 40px",
    background: "#fff",
    flexShrink: 0,
  },

  formContainer: { width: "100%", maxWidth: "380px" },

  formHeader: { marginBottom: "28px" },

  formTitle: {
    fontSize: "1.7rem",
    fontWeight: 900,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },

  formSub: { color: "#64748b", margin: 0, fontSize: "0.88rem" },

  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  errorIcon: { fontSize: "1rem", flexShrink: 0 },

  form: {},

  field: { marginBottom: "18px" },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "7px",
  },

  label: {
    display: "block",
    fontWeight: 700,
    color: "#374151",
    fontSize: "0.85rem",
    marginBottom: "7px",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputPrefix: {
    position: "absolute",
    left: "12px",
    fontSize: "0.9rem",
    pointerEvents: "none",
    zIndex: 1,
  },

  input: {
    width: "100%",
    padding: "12px 42px 12px 40px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.92rem",
    color: "#1e293b",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },

  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#94a3b8",
    padding: 0,
  },

  forgotBtn: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },

  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  rememberText: { color: "#374151", fontSize: "0.84rem" },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s",
    marginBottom: "4px",
  },

  loadingDots: {},

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0",
  },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { color: "#94a3b8", fontSize: "0.78rem", whiteSpace: "nowrap", fontWeight: 600 },

  socialBtns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  socialBtn: {
    padding: "10px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  switchText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.88rem",
    margin: "0 0 16px",
  },
  switchLink: { color: "#3b82f6", fontWeight: 800, textDecoration: "none" },

  termsText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.75rem",
    margin: 0,
    lineHeight: 1.5,
  },
  termsLink: { color: "#3b82f6", cursor: "pointer" },
};

export default Login;