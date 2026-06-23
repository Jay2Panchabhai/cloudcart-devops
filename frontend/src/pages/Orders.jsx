import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";

const STATUS_CONFIG = {
  pending:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "⏳", label: "Order Placed", step: 0 },
  confirmed: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "✅", label: "Confirmed", step: 1 },
  shipped:   { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "📦", label: "Shipped", step: 2 },
  delivered: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "🎉", label: "Delivered", step: 3 },
  cancelled: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "✖", label: "Cancelled", step: -1 },
};

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

const STEP_LABELS = [
  { icon: "📋", title: "Order Placed", sub: "We've received your order" },
  { icon: "✅", title: "Confirmed", sub: "Seller has confirmed" },
  { icon: "🚚", title: "Shipped", sub: "On the way to you" },
  { icon: "🏠", title: "Delivered", sub: "Enjoy your purchase!" },
];

function TrackingBar({ status }) {
  if (status === "cancelled") {
    return (
      <div style={styles.cancelledBar}>
        <span style={styles.cancelledIcon}>✖</span>
        <div>
          <div style={styles.cancelledTitle}>Order Cancelled</div>
          <div style={styles.cancelledSub}>This order has been cancelled. Refund will be processed within 5–7 business days.</div>
        </div>
      </div>
    );
  }

  const currentStep = STEPS.indexOf(status);

  return (
    <div style={styles.trackingBar}>
      {STEP_LABELS.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <div key={i} style={styles.trackStep}>
            {/* Connector line */}
            {i > 0 && (
              <div style={{
                ...styles.connector,
                background: i <= currentStep ? "#3b82f6" : "#e2e8f0",
              }} />
            )}
            {/* Step dot */}
            <div style={{
              ...styles.stepDot,
              background: done ? (active ? "#3b82f6" : "#22c55e") : "#fff",
              border: done ? `2px solid ${active ? "#3b82f6" : "#22c55e"}` : "2px solid #e2e8f0",
              boxShadow: active ? "0 0 0 4px rgba(59,130,246,0.15)" : "none",
            }}>
              {done ? (
                <span style={{ fontSize: "0.75rem" }}>{active ? step.icon : "✓"}</span>
              ) : (
                <span style={{ color: "#cbd5e1", fontSize: "0.7rem" }}>{i + 1}</span>
              )}
            </div>
            <div style={styles.stepInfo}>
              <div style={{
                ...styles.stepTitle,
                color: done ? (active ? "#3b82f6" : "#16a34a") : "#94a3b8",
              }}>{step.title}</div>
              <div style={styles.stepSub}>{step.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = new Date(order.created_at);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={styles.orderCard}>
      {/* Card header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <div style={styles.orderIdRow}>
            <span style={styles.orderIdLabel}>ORDER #</span>
            <span style={styles.orderId}>{String(order.id).padStart(6, "0")}</span>
          </div>
          <div style={styles.orderDate}>Placed on {formattedDate} at {formattedTime}</div>
        </div>
        <div style={styles.cardHeaderRight}>
          <div style={{
            ...styles.statusPill,
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}>
            {cfg.icon} {cfg.label}
          </div>
        </div>
      </div>

      {/* Order summary strip */}
      <div style={styles.orderSummaryStrip}>
        <div style={styles.stripItem}>
          <span style={styles.stripLabel}>Items</span>
          <span style={styles.stripValue}>{order.item_count} item{order.item_count !== 1 ? "s" : ""}</span>
        </div>
        <div style={styles.stripDivider} />
        <div style={styles.stripItem}>
          <span style={styles.stripLabel}>Total</span>
          <span style={{ ...styles.stripValue, color: "#0f172a", fontWeight: 800 }}>
            ₹{Number(order.total_amount).toLocaleString()}
          </span>
        </div>
        <div style={styles.stripDivider} />
        <div style={styles.stripItem}>
          <span style={styles.stripLabel}>Payment</span>
          <span style={styles.stripValue}>Online</span>
        </div>
        <div style={styles.stripDivider} />
        <div style={styles.stripItem}>
          <span style={styles.stripLabel}>Delivery</span>
          <span style={{ ...styles.stripValue, color: "#16a34a" }}>FREE</span>
        </div>
      </div>

      {/* Tracking */}
      <div style={styles.trackingSection}>
        <TrackingBar status={order.status} />
      </div>

      {/* Expand toggle */}
      <div style={styles.cardFooter}>
        <button
          style={styles.expandBtn}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? "▲ Hide order details" : "▼ View order details"}
        </button>
        <div style={styles.footerActions}>
          <button style={styles.footerAction}>📄 Invoice</button>
          <button style={styles.footerAction}>💬 Support</button>
          {order.status === "delivered" && (
            <button style={{ ...styles.footerAction, color: "#f59e0b" }}>⭐ Rate product</button>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={styles.expandedDetails}>
          <div style={styles.expandedGrid}>
            <div style={styles.detailGroup}>
              <div style={styles.detailGroupTitle}>Order Information</div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Order ID</span>
                <span style={styles.detailVal}>#{String(order.id).padStart(6, "0")}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Order Date</span>
                <span style={styles.detailVal}>{formattedDate}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Order Time</span>
                <span style={styles.detailVal}>{formattedTime}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Status</span>
                <span style={{ ...styles.detailVal, color: cfg.color, fontWeight: 700 }}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
            </div>
            <div style={styles.detailGroup}>
              <div style={styles.detailGroupTitle}>Payment Details</div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Subtotal</span>
                <span style={styles.detailVal}>₹{Number(order.total_amount).toLocaleString()}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Delivery</span>
                <span style={{ ...styles.detailVal, color: "#16a34a" }}>FREE</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Tax (18% GST)</span>
                <span style={styles.detailVal}>Included</span>
              </div>
              <div style={{ ...styles.detailRow, borderTop: "1px solid #f1f5f9", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ ...styles.detailKey, fontWeight: 700, color: "#1e293b" }}>Total Paid</span>
                <span style={{ ...styles.detailVal, color: "#0f172a", fontWeight: 800, fontSize: "1rem" }}>
                  ₹{Number(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
            <div style={styles.detailGroup}>
              <div style={styles.detailGroupTitle}>Delivery Address</div>
              <div style={styles.addressCard}>
                <div style={styles.addressName}>Home</div>
                <div style={styles.addressText}>
                  123, Sample Street, Near Park<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </div>
                <div style={styles.addressPhone}>📞 +91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${ORDER_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingBox}>
          <div style={{ fontSize: "2.5rem" }}>📦</div>
          <p style={{ color: "#64748b", marginTop: "12px", fontSize: "0.9rem" }}>Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.breadcrumb}>
              <Link to="/" style={styles.breadLink}>Home</Link>
              <span style={styles.breadSep}>/</span>
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>My Orders</span>
            </div>
            <h1 style={styles.pageTitle}>My Orders</h1>
            <p style={styles.pageSubtitle}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
          <div style={styles.headerSearch}>
            <input
              style={styles.searchInput}
              placeholder="Search orders by ID or product…"
            />
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "5rem", marginBottom: "20px" }}>📭</div>
            <h2 style={styles.emptyTitle}>No orders yet</h2>
            <p style={styles.emptySub}>
              Looks like you haven't placed any orders. Start shopping to see your orders here!
            </p>
            <button onClick={() => navigate("/products")} style={styles.shopBtn}>
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
              <div style={styles.sideCard}>
                <div style={styles.sideTitle}>Filter Orders</div>
                {[
                  ["all", "All Orders", orders.length],
                  ["pending", "Pending", orders.filter(o => o.status === "pending").length],
                  ["confirmed", "Confirmed", orders.filter(o => o.status === "confirmed").length],
                  ["shipped", "Shipped", orders.filter(o => o.status === "shipped").length],
                  ["delivered", "Delivered", orders.filter(o => o.status === "delivered").length],
                  ["cancelled", "Cancelled", orders.filter(o => o.status === "cancelled").length],
                ].map(([val, label, count]) => (
                  <button
                    key={val}
                    style={{
                      ...styles.filterBtn,
                      background: filter === val ? "#eff6ff" : "transparent",
                      color: filter === val ? "#1d4ed8" : "#374151",
                      borderLeft: filter === val ? "3px solid #3b82f6" : "3px solid transparent",
                    }}
                    onClick={() => setFilter(val)}
                  >
                    <span>{label}</span>
                    <span style={{
                      ...styles.filterCount,
                      background: filter === val ? "#dbeafe" : "#f1f5f9",
                      color: filter === val ? "#1d4ed8" : "#94a3b8",
                    }}>{count}</span>
                  </button>
                ))}
              </div>

              {/* Quick stats */}
              <div style={styles.statsCard}>
                <div style={styles.sideTitle}>Order Stats</div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Total Spent</span>
                  <span style={styles.statValue}>
                    ₹{orders.reduce((s, o) => s + Number(o.total_amount), 0).toLocaleString()}
                  </span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Items Ordered</span>
                  <span style={styles.statValue}>
                    {orders.reduce((s, o) => s + o.item_count, 0)}
                  </span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Avg. Order Value</span>
                  <span style={styles.statValue}>
                    ₹{orders.length ? Math.round(orders.reduce((s, o) => s + Number(o.total_amount), 0) / orders.length).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </aside>

            {/* Orders list */}
            <div style={styles.mainCol}>
              <div style={styles.listHeader}>
                <span style={styles.listCount}>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
                <select style={styles.sortSelect}>
                  <option>Newest first</option>
                  <option>Oldest first</option>
                  <option>Highest amount</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div style={styles.filterEmpty}>
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔍</div>
                  <p style={{ color: "#64748b", margin: 0 }}>No {filter} orders found</p>
                </div>
              ) : (
                <div style={styles.ordersList}>
                  {filtered.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f1f5f9", minHeight: "100vh", paddingBottom: "60px" },

  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  loadingBox: { textAlign: "center" },

  pageHeader: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "20px 0",
  },
  headerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
  },
  breadcrumb: { display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" },
  breadLink: { color: "#3b82f6", textDecoration: "none", fontSize: "0.8rem" },
  breadSep: { color: "#cbd5e1", fontSize: "0.8rem" },
  pageTitle: { fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0 0 2px" },
  pageSubtitle: { color: "#64748b", fontSize: "0.82rem", margin: 0 },
  headerSearch: {},
  searchInput: {
    padding: "9px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.87rem",
    outline: "none",
    width: "280px",
    color: "#1e293b",
  },

  container: {
    maxWidth: "1280px",
    margin: "20px auto",
    padding: "0 24px",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  emptyTitle: { fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" },
  emptySub: { color: "#64748b", margin: "0 0 28px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 },
  shopBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "13px 32px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 800,
    cursor: "pointer",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "20px",
    alignItems: "start",
  },

  sidebar: { display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "120px" },
  sideCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  sideTitle: {
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "9px 10px 9px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "2px",
    transition: "all 0.15s",
  },
  filterCount: {
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "12px",
  },
  statsCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
    borderBottom: "1px solid #f8fafc",
  },
  statLabel: { color: "#64748b", fontSize: "0.8rem" },
  statValue: { color: "#0f172a", fontWeight: 800, fontSize: "0.88rem" },

  mainCol: {},
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  listCount: { color: "#64748b", fontSize: "0.82rem" },
  sortSelect: {
    padding: "7px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.82rem",
    color: "#374151",
    background: "#fff",
    outline: "none",
    cursor: "pointer",
  },
  filterEmpty: {
    textAlign: "center",
    padding: "60px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  ordersList: { display: "flex", flexDirection: "column", gap: "14px" },

  // Order card
  orderCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "18px 24px",
    background: "#f8fafc",
    borderBottom: "1px solid #f1f5f9",
  },
  cardHeaderLeft: {},
  orderIdRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  orderIdLabel: {
    background: "#e2e8f0",
    color: "#64748b",
    fontSize: "0.62rem",
    fontWeight: 800,
    padding: "2px 7px",
    borderRadius: "4px",
    letterSpacing: "0.5px",
  },
  orderId: { fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" },
  orderDate: { color: "#94a3b8", fontSize: "0.78rem" },
  cardHeaderRight: {},
  statusPill: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },

  orderSummaryStrip: {
    display: "flex",
    padding: "14px 24px",
    borderBottom: "1px solid #f1f5f9",
  },
  stripItem: { flex: 1, textAlign: "center" },
  stripLabel: { display: "block", color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" },
  stripValue: { color: "#374151", fontSize: "0.88rem", fontWeight: 600 },
  stripDivider: { width: "1px", background: "#f1f5f9" },

  // Tracking
  trackingSection: { padding: "24px" },
  trackingBar: {
    display: "flex",
    alignItems: "flex-start",
    position: "relative",
  },
  trackStep: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  connector: {
    position: "absolute",
    top: "18px",
    left: "-50%",
    right: "50%",
    height: "3px",
    zIndex: 0,
  },
  stepDot: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    transition: "all 0.3s",
    marginBottom: "8px",
    flexShrink: 0,
  },
  stepInfo: { textAlign: "center", paddingTop: "2px" },
  stepTitle: { fontSize: "0.78rem", fontWeight: 700, marginBottom: "3px" },
  stepSub: { color: "#94a3b8", fontSize: "0.68rem" },

  cancelledBar: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "14px 18px",
    margin: "16px 24px",
  },
  cancelledIcon: { fontSize: "1.5rem", flexShrink: 0 },
  cancelledTitle: { fontWeight: 800, color: "#dc2626", fontSize: "0.9rem", marginBottom: "3px" },
  cancelledSub: { color: "#b91c1c", fontSize: "0.78rem" },

  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderTop: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  expandBtn: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontWeight: 700,
    padding: 0,
  },
  footerActions: { display: "flex", gap: "16px" },
  footerAction: {
    background: "none",
    border: "none",
    color: "#374151",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: 0,
  },

  expandedDetails: {
    padding: "20px 24px",
    borderTop: "1px solid #f1f5f9",
    background: "#fafbfc",
  },
  expandedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  detailGroup: {},
  detailGroupTitle: {
    fontSize: "0.72rem",
    fontWeight: 800,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e2e8f0",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: "0.82rem",
  },
  detailKey: { color: "#64748b" },
  detailVal: { color: "#1e293b", fontWeight: 600 },

  addressCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px",
  },
  addressName: { fontWeight: 800, color: "#0f172a", fontSize: "0.85rem", marginBottom: "6px" },
  addressText: { color: "#475569", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "6px" },
  addressPhone: { color: "#64748b", fontSize: "0.78rem" },
};

export default Orders;