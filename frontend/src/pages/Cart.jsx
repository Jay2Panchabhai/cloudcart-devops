import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";
const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&q=70";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCart = () => {
    setLoading(true);
    axios
      .get(`${CART_API}/api/cart`, { headers })
      .then(r => setCart(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const removeItem = async (cartItemId) => {
    setRemoving(cartItemId);
    await axios.delete(`${CART_API}/api/cart/${cartItemId}`, { headers });
    fetchCart();
    setRemoving(null);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await axios.post(`${ORDER_API}/api/orders`, {}, { headers });
      alert(`✅ Order #${data.orderId} placed! Total: ₹${Number(data.total).toLocaleString()}`);
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingIcon}>🛒</div>
        <p style={{ color: "#64748b", marginTop: "12px" }}>Loading your cart…</p>
      </div>
    );
  }

  const deliveryFee = cart.total > 999 ? 0 : 49;
  const promoDiscount = promoApplied ? Math.round(cart.total * 0.1) : 0;
  const grandTotal = Number(cart.total) + deliveryFee - promoDiscount;

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <div style={styles.breadcrumb}>
            <Link to="/" style={styles.breadLink}>Home</Link>
            <span style={styles.breadSep}>/</span>
            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>Cart</span>
          </div>
          <h1 style={styles.pageTitle}>
            Shopping Cart
            <span style={styles.cartCount}>{cart.itemCount || 0} items</span>
          </h1>
        </div>
      </div>

      <div style={styles.container}>
        {cart.items.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIllustration}>
              <div style={styles.emptyCartIcon}>🛒</div>
              <div style={styles.emptyRings}>
                <div style={styles.ring1} />
                <div style={styles.ring2} />
              </div>
            </div>
            <h2 style={styles.emptyTitle}>Your cart is empty!</h2>
            <p style={styles.emptySub}>Looks like you haven't added anything yet. Let's fix that!</p>
            <Link to="/products" style={styles.shopBtn}>Continue Shopping →</Link>
            <div style={styles.emptyLinks}>
              <Link to="/orders" style={styles.emptyLink}>View my orders</Link>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <Link to="/products" style={styles.emptyLink}>Browse products</Link>
            </div>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Left: Cart items */}
            <div style={styles.leftCol}>
              {/* Delivery info bar */}
              {deliveryFee === 0 ? (
                <div style={styles.freeDeliveryBar}>
                  🎉 You've got <strong>FREE delivery</strong> on this order!
                </div>
              ) : (
                <div style={styles.deliveryBar}>
                  🚚 Add <strong>₹{(999 - cart.total).toLocaleString()}</strong> more for FREE delivery
                  <div style={styles.deliveryProgress}>
                    <div style={{ ...styles.deliveryProgressFill, width: `${Math.min(100, (cart.total / 999) * 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={styles.itemsCard}>
                <div style={styles.itemsHeader}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "#3b82f6" }} />
                  <span style={styles.selectAll}>Select All ({cart.itemCount})</span>
                  <button style={styles.clearAll}>Clear All</button>
                </div>

                {cart.items.map((item, idx) => (
                  <div key={item.cart_item_id}>
                    {idx > 0 && <div style={styles.itemDivider} />}
                    <div style={styles.itemRow}>
                      <input type="checkbox" defaultChecked style={{ accentColor: "#3b82f6", marginRight: "12px" }} />
                      <img
                        src={item.image_url || FALLBACK_IMG}
                        alt={item.name}
                        style={styles.itemImg}
                        onError={e => { e.target.src = FALLBACK_IMG; }}
                      />
                      <div style={styles.itemDetails}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <div style={styles.itemMeta}>
                          <span style={styles.itemSeller}>Sold by CloudCart Direct</span>
                          <span style={styles.itemEligible}>✅ Free delivery eligible</span>
                        </div>
                        <div style={styles.itemPrice}>
                          ₹{Number(item.price).toLocaleString()}
                          <span style={styles.itemPerUnit}>per unit</span>
                        </div>

                        <div style={styles.itemActions}>
                          <div style={styles.qtyControl}>
                            <span style={styles.qtyLabel}>Qty:</span>
                            <div style={styles.qtyBox}>
                              <button style={styles.qtyBtn}>−</button>
                              <span style={styles.qtyVal}>{item.quantity}</span>
                              <button style={styles.qtyBtn}>+</button>
                            </div>
                          </div>
                          <div style={styles.itemActionLinks}>
                            <button style={styles.actionLink}>♡ Save for later</button>
                            <span style={{ color: "#e2e8f0" }}>|</span>
                            <button
                              style={styles.removeLink}
                              onClick={() => removeItem(item.cart_item_id)}
                              disabled={removing === item.cart_item_id}
                            >
                              {removing === item.cart_item_id ? "Removing…" : "Remove"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div style={styles.itemSubtotal}>
                        <div style={styles.subtotalAmount}>₹{Number(item.subtotal).toLocaleString()}</div>
                        {item.quantity > 1 && (
                          <div style={styles.subtotalBreakdown}>
                            {item.quantity} × ₹{Number(item.price).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.continueRow}>
                <Link to="/products" style={styles.continueBtn}>← Continue Shopping</Link>
              </div>
            </div>

            {/* Right: Summary */}
            <div style={styles.rightCol}>
              {/* Promo */}
              <div style={styles.promoCard}>
                <div style={styles.promoTitle}>🏷️ Promo Code</div>
                <div style={styles.promoRow}>
                  <input
                    style={styles.promoInput}
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button
                    style={{
                      ...styles.promoBtn,
                      background: promoCode.length > 0 ? "#3b82f6" : "#e2e8f0",
                      color: promoCode.length > 0 ? "#fff" : "#94a3b8",
                    }}
                    onClick={() => {
                      if (promoCode === "CLOUD10") setPromoApplied(true);
                    }}
                    disabled={promoCode.length === 0}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div style={styles.promoSuccess}>
                    🎉 CLOUD10 applied! Saved ₹{promoDiscount.toLocaleString()}
                  </div>
                )}
                {!promoApplied && (
                  <p style={styles.promoHint}>Try: <strong>CLOUD10</strong> for 10% off</p>
                )}
              </div>

              {/* Summary */}
              <div style={styles.summaryCard}>
                <div style={styles.summaryTitle}>Price Details</div>

                <div style={styles.summaryRows}>
                  <div style={styles.summaryRow}>
                    <span>Price ({cart.itemCount} items)</span>
                    <span>₹{Number(cart.total).toLocaleString()}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery charges</span>
                    <span style={{ color: deliveryFee === 0 ? "#16a34a" : "#1e293b" }}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {promoApplied && (
                    <div style={{ ...styles.summaryRow, color: "#16a34a" }}>
                      <span>Promo (CLOUD10)</span>
                      <span>−₹{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={styles.summaryDivider} />
                  <div style={styles.summaryTotal}>
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                  {(deliveryFee === 0 || promoApplied) && (
                    <div style={styles.savingsNotice}>
                      🎊 You're saving ₹{(deliveryFee === 0 ? 49 : 0) + promoDiscount} on this order!
                    </div>
                  )}
                </div>

                <button
                  style={{
                    ...styles.placeOrderBtn,
                    opacity: placing ? 0.8 : 1,
                  }}
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <span>Processing…</span>
                  ) : (
                    <span>Place Order →</span>
                  )}
                </button>

                <div style={styles.secureNote}>
                  🔒 Safe and Secure Payments · Easy Returns
                </div>
              </div>

              {/* Payment methods */}
              <div style={styles.paymentCard}>
                <div style={styles.paymentTitle}>Accepted Payment Methods</div>
                <div style={styles.paymentIcons}>
                  {["💳 Credit Card", "🏦 Net Banking", "📱 UPI", "💰 Wallet"].map(p => (
                    <span key={p} style={styles.paymentIcon}>{p}</span>
                  ))}
                </div>
              </div>
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  loadingIcon: { fontSize: "3rem" },

  pageHeader: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "20px 0",
  },
  pageHeaderInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
  },
  breadcrumb: { display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" },
  breadLink: { color: "#3b82f6", textDecoration: "none", fontSize: "0.8rem" },
  breadSep: { color: "#cbd5e1", fontSize: "0.8rem" },
  pageTitle: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  cartCount: {
    background: "#eff6ff",
    color: "#3b82f6",
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "20px",
  },

  container: {
    maxWidth: "1280px",
    margin: "20px auto",
    padding: "0 24px",
  },

  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  emptyIllustration: { position: "relative", display: "inline-block", marginBottom: "20px" },
  emptyCartIcon: { fontSize: "4rem", position: "relative", zIndex: 1 },
  ring1: {
    position: "absolute",
    inset: "-12px",
    borderRadius: "50%",
    border: "2px solid #e2e8f0",
  },
  ring2: {
    position: "absolute",
    inset: "-24px",
    borderRadius: "50%",
    border: "2px solid #f1f5f9",
  },
  emptyTitle: { fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" },
  emptySub: { color: "#64748b", margin: "0 0 28px", fontSize: "0.9rem" },
  shopBtn: {
    display: "inline-block",
    background: "#3b82f6",
    color: "#fff",
    padding: "13px 32px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "0.95rem",
    marginBottom: "20px",
  },
  emptyLinks: { display: "flex", justifyContent: "center", gap: "12px", alignItems: "center" },
  emptyLink: { color: "#3b82f6", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 },

  // Layout
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "20px",
    alignItems: "start",
  },

  leftCol: { display: "flex", flexDirection: "column", gap: "12px" },

  freeDeliveryBar: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: "1px solid #bbf7d0",
  },
  deliveryBar: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    border: "1px solid #bfdbfe",
  },
  deliveryProgress: {
    height: "4px",
    background: "#bfdbfe",
    borderRadius: "2px",
    marginTop: "8px",
    overflow: "hidden",
  },
  deliveryProgressFill: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: "2px",
    transition: "width 0.3s",
  },

  itemsCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  itemsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  selectAll: { fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", flex: 1 },
  clearAll: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
  },

  itemDivider: { height: "1px", background: "#f1f5f9", margin: "0 20px" },

  itemRow: {
    display: "flex",
    alignItems: "flex-start",
    padding: "20px",
    gap: "0",
  },
  itemImg: {
    width: "88px",
    height: "88px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginRight: "16px",
  },
  itemDetails: { flex: 1, minWidth: 0 },
  itemName: {
    margin: "0 0 6px",
    fontSize: "0.92rem",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1.3,
  },
  itemMeta: { display: "flex", gap: "12px", marginBottom: "6px", flexWrap: "wrap" },
  itemSeller: { color: "#94a3b8", fontSize: "0.75rem" },
  itemEligible: { color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 },
  itemPrice: {
    color: "#0f172a",
    fontWeight: 800,
    fontSize: "1rem",
    marginBottom: "12px",
  },
  itemPerUnit: { color: "#94a3b8", fontWeight: 400, fontSize: "0.75rem", marginLeft: "4px" },
  itemActions: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  qtyControl: { display: "flex", alignItems: "center", gap: "8px" },
  qtyLabel: { color: "#64748b", fontSize: "0.8rem", fontWeight: 600 },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "32px",
    height: "32px",
    border: "none",
    background: "#f8fafc",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 700,
    color: "#374151",
  },
  qtyVal: {
    width: "40px",
    textAlign: "center",
    fontWeight: 800,
    fontSize: "0.9rem",
    color: "#0f172a",
  },
  itemActionLinks: { display: "flex", alignItems: "center", gap: "10px" },
  actionLink: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: 0,
  },
  removeLink: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: 0,
  },
  itemSubtotal: { textAlign: "right", flexShrink: 0, marginLeft: "16px" },
  subtotalAmount: { color: "#0f172a", fontWeight: 800, fontSize: "1.05rem" },
  subtotalBreakdown: { color: "#94a3b8", fontSize: "0.72rem", marginTop: "2px" },

  continueRow: { display: "flex" },
  continueBtn: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  // Right col
  rightCol: { display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "120px" },

  promoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "18px",
    border: "1px solid #e2e8f0",
  },
  promoTitle: { fontWeight: 800, color: "#0f172a", fontSize: "0.88rem", marginBottom: "12px" },
  promoRow: { display: "flex", gap: "8px" },
  promoInput: {
    flex: 1,
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 700,
    outline: "none",
    letterSpacing: "1px",
    color: "#1e293b",
  },
  promoBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  promoSuccess: {
    color: "#16a34a",
    fontSize: "0.8rem",
    fontWeight: 700,
    marginTop: "8px",
    background: "#dcfce7",
    padding: "6px 10px",
    borderRadius: "6px",
  },
  promoHint: { color: "#94a3b8", fontSize: "0.75rem", marginTop: "8px", margin: "8px 0 0" },

  summaryCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
  },
  summaryTitle: {
    fontWeight: 800,
    color: "#94a3b8",
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  summaryRows: { display: "flex", flexDirection: "column", gap: "10px" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.87rem",
    color: "#475569",
  },
  summaryDivider: { height: "1px", background: "#f1f5f9", margin: "4px 0" },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 800,
    fontSize: "1rem",
    color: "#0f172a",
  },
  savingsNotice: {
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: "0.78rem",
    fontWeight: 700,
    padding: "8px 12px",
    borderRadius: "6px",
    textAlign: "center",
  },
  placeOrderBtn: {
    width: "100%",
    padding: "15px",
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "16px",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s",
  },
  secureNote: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.72rem",
    marginTop: "10px",
  },

  paymentCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  paymentTitle: { fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" },
  paymentIcons: { display: "flex", gap: "8px", flexWrap: "wrap" },
  paymentIcon: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "0.72rem",
    color: "#374151",
    fontWeight: 600,
  },
};

export default Cart;