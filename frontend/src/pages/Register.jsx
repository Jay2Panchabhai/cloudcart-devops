import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_USER_API || "http://localhost:3001";

function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#e2e8f0", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div style={styles.strengthWrap}>
      <div style={styles.strengthBars}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            ...styles.strengthBar,
            background: i <= score ? colors[score] : "#e2e8f0",
          }} />
        ))}
      </div>
      <span style={{ ...styles.strengthLabel, color: colors[score] }}>{labels[score]}</span>
      <div style={styles.strengthChecks}>
        {checks.map(c => (
          <div key={c.label} style={{ ...styles.strengthCheck, color: c.pass ? "#16a34a" : "#94a3b8" }}>
            {c.pass ? "✓" : "○"} {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service to continue."); return; }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/register`, { name, email, password });
      login(data.user, data.token);
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <Link to="/" style={styles.backLink}>← Back to store</Link>

          <div style={styles.brandSection}>
            <div style={styles.logoWrap}>
              <span style={styles.logoIcon}>☁</span>
            </div>
            <h1 style={styles.brandName}>Join CloudCart</h1>
            <p style={styles.brandTagline}>Create your free account and start shopping smarter.</p>
          </div>

          <div style={styles.memberPerks}>
            <div style={styles.perksTitle}>What you get as a member</div>
            {[
              { icon: "🎁", title: "Exclusive deals", sub: "Member-only discounts up to 60% off" },
              { icon: "📦", title: "Order tracking", sub: "Real-time updates on all your orders" },
              { icon: "❤️", title: "Wishlist", sub: "Save items and get price drop alerts" },
              { icon: "💳", title: "Saved payments", sub: "Faster checkout every time" },
              { icon: "🔔", title: "Early access", sub: "First look at flash sales and new arrivals" },
            ].map(perk => (
              <div key={perk.title} style={styles.perkItem}>
                <div style={styles.perkIconWrap}>{perk.icon}</div>
                <div>
                  <div style={styles.perkTitle}>{perk.title}</div>
                  <div style={styles.perkSub}>{perk.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.socialProof}>
            <div style={styles.avatarStack}>
              {["A", "S", "R", "P"].map((l, i) => (
                <div key={l} style={{ ...styles.proofAvatar, background: ["#3b82f6","#8b5cf6","#ec4899","#f97316"][i], marginLeft: i ? "-8px" : 0 }}>
                  {l}
                </div>
              ))}
            </div>
            <span style={styles.proofText}>2M+ members already shopping</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create account</h2>
            <p style={styles.formSub}>
              Already have an account?{" "}
              <Link to="/login" style={styles.signinLink}>Sign in →</Link>
            </p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label style={styles.label}>Full name *</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputPrefix}>👤</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone number</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputPrefix}>📱</span>
                  <input
                    style={styles.input}
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email address *</label>
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
              <label style={styles.label}>Password *</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputPrefix}>🔑</span>
                <input
                  style={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            <label style={styles.agreeRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ accentColor: "#3b82f6", marginTop: "2px" }}
              />
              <span style={styles.agreeText}>
                I agree to CloudCart's{" "}
                <span style={styles.agreeLink}>Terms of Service</span>,{" "}
                <span style={styles.agreeLink}>Privacy Policy</span>, and{" "}
                <span style={styles.agreeLink}>Return Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              style={{
                ...styles.submitBtn,
                opacity: !agreed ? 0.6 : 1,
                cursor: !agreed ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating your account…" : "Create Account →"}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign up with</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.socialBtns}>
            <button style={styles.socialBtn}>🔵 Google</button>
            <button style={styles.socialBtn}>📘 Facebook</button>
          </div>

          {/* Trust indicators */}
          <div style={styles.trustRow}>
            <span style={styles.trustItem2}>🔒 SSL Secured</span>
            <span style={styles.trustItem2}>🛡️ Data Protected</span>
            <span style={styles.trustItem2}>✅ Spam-Free</span>
          </div>
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
  },
  leftContent: { maxWidth: "380px", width: "100%" },

  backLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: 600,
    display: "block",
    marginBottom: "40px",
  },

  brandSection: { marginBottom: "36px" },
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
    fontSize: "1.8rem",
    fontWeight: 900,
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  brandTagline: { color: "#64748b", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 },

  memberPerks: { marginBottom: "32px" },
  perksTitle: {
    color: "#94a3b8",
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "14px",
  },
  perkItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },
  perkIconWrap: {
    width: "36px",
    height: "36px",
    background: "#1e293b",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    flexShrink: 0,
  },
  perkTitle: { color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem", marginBottom: "2px" },
  perkSub: { color: "#64748b", fontSize: "0.75rem" },

  socialProof: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#1e293b",
    borderRadius: "10px",
    border: "1px solid #334155",
  },
  avatarStack: { display: "flex" },
  proofAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: "0.7rem",
    border: "2px solid #0f172a",
  },
  proofText: { color: "#94a3b8", fontSize: "0.78rem" },

  // Right panel
  rightPanel: {
    width: "520px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 40px",
    background: "#fff",
    overflowY: "auto",
  },
  formContainer: { width: "100%", maxWidth: "420px" },

  formHeader: { marginBottom: "24px" },
  formTitle: {
    fontSize: "1.7rem",
    fontWeight: 900,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  formSub: { color: "#64748b", margin: 0, fontSize: "0.88rem" },
  signinLink: { color: "#3b82f6", fontWeight: 800, textDecoration: "none" },

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

  form: {},

  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontWeight: 700,
    color: "#374151",
    fontSize: "0.84rem",
    marginBottom: "7px",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputPrefix: {
    position: "absolute",
    left: "12px",
    fontSize: "0.9rem",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "11px 42px 11px 40px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
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

  // Strength
  strengthWrap: { marginTop: "10px" },
  strengthBars: { display: "flex", gap: "4px", marginBottom: "4px" },
  strengthBar: { flex: 1, height: "4px", borderRadius: "2px", transition: "background 0.3s" },
  strengthLabel: { fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "8px" },
  strengthChecks: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" },
  strengthCheck: { fontSize: "0.72rem", fontWeight: 600 },

  agreeRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "18px",
    cursor: "pointer",
  },
  agreeText: { color: "#475569", fontSize: "0.82rem", lineHeight: 1.5 },
  agreeLink: { color: "#3b82f6", fontWeight: 700, cursor: "pointer" },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 800,
    letterSpacing: "0.3px",
    marginBottom: "4px",
    transition: "opacity 0.2s",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "18px 0",
  },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { color: "#94a3b8", fontSize: "0.75rem", whiteSpace: "nowrap", fontWeight: 600 },

  socialBtns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "16px",
  },
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

  trustRow: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    padding: "12px 0 0",
    borderTop: "1px solid #f1f5f9",
  },
  trustItem2: { color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 },
};

export default Register;