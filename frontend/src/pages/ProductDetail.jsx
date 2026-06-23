import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";
const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";

const FALLBACK_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  default: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80",
};

function Stars({ rating, count }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span style={{ color: "#f59e0b", fontSize: "1rem" }}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
      {count && (
        <span style={{ color: "#3b82f6", fontSize: "0.85rem", fontWeight: 600 }}>
          {count.toLocaleString()} ratings
        </span>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${PRODUCT_API}/api/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) { navigate("/login"); return; }
    setAdding(true);
    try {
      await axios.post(
        `${CART_API}/api/cart`,
        { productId: product.id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner} />
        </div>
        <p style={{ color: "#64748b", marginTop: "16px" }}>Loading product details…</p>
      </div>
    );
  }
  if (!product) return null;

  const imgSrc = product.image_url || FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
  const thumbImgs = [imgSrc, imgSrc, imgSrc, imgSrc];
  const inStock = product.stock > 0;
  const rating = (product.id % 2) + 3;
  const reviewCount = 80 + (product.id * 13) % 800;
  const discount = 10 + (product.id % 5) * 8;
  const originalPrice = Math.round(product.price / (1 - discount / 100));
  const savings = originalPrice - product.price;

  const specs = [
    ["Brand", "CloudCart Essentials"],
    ["Category", product.category],
    ["SKU", `CC-${String(product.id).padStart(5, "0")}`],
    ["Stock", `${product.stock} units available`],
    ["Warranty", "1 Year Manufacturer Warranty"],
    ["Country of Origin", "India"],
  ];

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumbBar}>
        <div style={styles.breadcrumbInner}>
          <Link to="/" style={styles.breadLink}>Home</Link>
          <span style={styles.breadSep}>/</span>
          <Link to="/products" style={styles.breadLink}>Products</Link>
          <span style={styles.breadSep}>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={styles.breadLink}>
            {product.category}
          </Link>
          <span style={styles.breadSep}>/</span>
          <span style={styles.breadCurrent}>{product.name}</span>
        </div>
      </div>

      <div style={styles.container}>
        {/* Left: Images */}
        <div style={styles.imageSection}>
          <div style={styles.imageSticky}>
            {/* Thumbnails */}
            <div style={styles.thumbCol}>
              {thumbImgs.map((img, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.thumb,
                    border: activeImg === i ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                  }}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" style={styles.thumbImg} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div style={styles.mainImgWrap}>
              {discount && (
                <div style={styles.imgDiscountBadge}>{discount}% OFF</div>
              )}
              <button style={styles.wishlistBtn}>
                ♡ Wishlist
              </button>
              <img src={thumbImgs[activeImg]} alt={product.name} style={styles.mainImg} />
            </div>
          </div>
        </div>

        {/* Middle: Info */}
        <div style={styles.infoSection}>
          <div style={styles.catBadge}>{product.category}</div>
          <h1 style={styles.productTitle}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <div style={styles.ratingBadge}>
              {rating} ★
            </div>
            <Stars rating={rating} count={reviewCount} />
            <span style={styles.ratingDivider}>|</span>
            <span style={styles.soldCount}>2,341 sold</span>
          </div>

          <div style={styles.priceDivider} />

          <div style={styles.priceBlock}>
            <div style={styles.discountTag}>{discount}% off</div>
            <div style={styles.mainPrice}>₹{Number(product.price).toLocaleString()}</div>
            <div style={styles.priceRow2}>
              <span style={styles.mrpLabel}>M.R.P:</span>
              <span style={styles.mrp}>₹{Number(originalPrice).toLocaleString()}</span>
              <span style={styles.savingsText}>Save ₹{Number(savings).toLocaleString()}</span>
            </div>
            <div style={styles.gstNote}>Inclusive of all taxes</div>
          </div>

          {/* Offers */}
          <div style={styles.offersBox}>
            <div style={styles.offersTitle}>Available Offers</div>
            {[
              ["🏦", "Bank Offer: 10% off on HDFC Bank Credit Cards"],
              ["🎁", "Partner Offer: Get 5% unlimited cashback via CloudCart Pay"],
              ["🔄", "Exchange Offer: Up to ₹2,000 off on exchange"],
            ].map(([icon, text]) => (
              <div key={text} style={styles.offerItem}>
                <span style={styles.offerIcon}>{icon}</span>
                <span style={styles.offerText}>{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={styles.descBox}>
            <div style={styles.descTitle}>About this item</div>
            <p style={styles.descText}>{product.description || "Premium quality product curated exclusively for CloudCart customers. Built to last with exceptional attention to detail and superior craftsmanship."}</p>
          </div>

          {/* Specs */}
          <div style={styles.specsTable}>
            <div style={styles.specsTitle}>Product Details</div>
            {specs.map(([k, v]) => (
              <div key={k} style={styles.specRow}>
                <span style={styles.specKey}>{k}</span>
                <span style={styles.specVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Buy box */}
        <div style={styles.buyBox}>
          <div style={styles.buyCard}>
            <div style={styles.buyPrice}>₹{Number(product.price).toLocaleString()}</div>
            <div style={styles.buyMrp}>M.R.P: <s>₹{Number(originalPrice).toLocaleString()}</s></div>

            <div style={styles.buyDelivery}>
              <div style={styles.buyDeliveryRow}>
                <span style={styles.buyDeliveryLabel}>Delivery</span>
                <span style={styles.buyDeliveryVal}>
                  {inStock ? "🚀 FREE delivery" : "Not available"}
                </span>
              </div>
              <div style={styles.pincodeRow}>
                <input
                  style={styles.pincodeInput}
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.slice(0, 6))}
                  maxLength={6}
                />
                <button
                  style={styles.pincodeBtn}
                  onClick={() => pincode.length === 6 && setPincodeChecked(true)}
                >
                  Check
                </button>
              </div>
              {pincodeChecked && (
                <div style={styles.deliveryResult}>
                  ✅ Delivery by tomorrow, 6 PM
                </div>
              )}
            </div>

            <div style={styles.buyStock}>
              {inStock ? (
                <span style={styles.inStockText}>✅ In Stock</span>
              ) : (
                <span style={styles.outStockText}>❌ Out of Stock</span>
              )}
            </div>

            {inStock && (
              <div style={styles.qtyRow}>
                <span style={styles.qtyLabel}>Qty:</span>
                <div style={styles.qtyControl}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty === 1}
                  >−</button>
                  <span style={styles.qtyVal}>{qty}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    disabled={qty === product.stock}
                  >+</button>
                </div>
              </div>
            )}

            <button
              style={{
                ...styles.addToCartBtn,
                background: added ? "#16a34a" : "#f97316",
                opacity: !inStock ? 0.5 : 1,
              }}
              onClick={addToCart}
              disabled={!inStock || adding}
            >
              {adding ? "Adding…" : added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
            </button>

            <button
              style={styles.buyNowBtn}
              disabled={!inStock}
              onClick={() => { addToCart().then(() => navigate("/cart")); }}
            >
              ⚡ Buy Now
            </button>

            <div style={styles.secureNotice}>
              🔒 Secure transaction · 30-day returns
            </div>

            <div style={styles.soldByRow}>
              <span style={styles.soldByLabel}>Sold by</span>
              <span style={styles.soldByVal}>CloudCart Direct</span>
            </div>
          </div>

          {/* Protection plan */}
          <div style={styles.protectionCard}>
            <div style={styles.protectionTitle}>🛡️ Protection Plan</div>
            <p style={styles.protectionText}>Add 1-year extended warranty for just ₹199</p>
            <label style={styles.protectionCheck}>
              <input type="checkbox" />
              <span>Add warranty</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div style={styles.reviewsSection}>
        <div style={styles.reviewsInner}>
          <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
          <div style={styles.reviewsOverview}>
            <div style={styles.reviewRatingBig}>
              <div style={styles.ratingNumber}>{rating}.0</div>
              <div style={{ color: "#f59e0b", fontSize: "1.5rem" }}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</div>
              <div style={styles.ratingTotal}>out of 5 · {reviewCount.toLocaleString()} reviews</div>
            </div>
            <div style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map(r => {
                const pct = r === rating ? 68 : r === rating - 1 ? 22 : 5;
                return (
                  <div key={r} style={styles.ratingBar}>
                    <span style={styles.ratingBarLabel}>{r} ★</span>
                    <div style={styles.ratingBarTrack}>
                      <div style={{ ...styles.ratingBarFill, width: `${pct}%` }} />
                    </div>
                    <span style={styles.ratingBarPct}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.reviewCards}>
            {[
              { name: "Arjun M.", stars: 5, date: "12 Jun 2026", text: "Excellent product! Exceeded my expectations. The quality is top-notch and delivery was super fast.", helpful: 24 },
              { name: "Priya S.", stars: 4, date: "8 Jun 2026", text: "Good value for money. Packaging was secure and the product looks exactly as shown. Minor issue with sizing.", helpful: 11 },
              { name: "Rohit K.", stars: rating, date: "1 Jun 2026", text: "Bought this as a gift and the recipient loved it! Will definitely order again from CloudCart.", helpful: 8 },
            ].map((r, i) => (
              <div key={i} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAvatar}>{r.name[0]}</div>
                  <div>
                    <div style={styles.reviewName}>{r.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: "0.8rem" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                  </div>
                  <span style={styles.reviewDate}>{r.date}</span>
                </div>
                <p style={styles.reviewText}>{r.text}</p>
                <div style={styles.reviewHelpful}>
                  👍 {r.helpful} people found this helpful
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f1f5f9", minHeight: "100vh", paddingBottom: "60px" },

  loadingPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  loadingSpinner: {},
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  breadcrumbBar: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "10px 0",
  },
  breadcrumbInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    flexWrap: "wrap",
  },
  breadLink: { color: "#3b82f6", textDecoration: "none" },
  breadSep: { color: "#cbd5e1" },
  breadCurrent: {
    color: "#64748b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "200px",
  },

  container: {
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "380px 1fr 280px",
    gap: "20px",
    alignItems: "start",
  },

  // Image section
  imageSection: {},
  imageSticky: {
    position: "sticky",
    top: "120px",
    display: "flex",
    gap: "12px",
  },
  thumbCol: { display: "flex", flexDirection: "column", gap: "8px" },
  thumb: {
    width: "64px",
    height: "64px",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    flexShrink: 0,
    background: "#f8fafc",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  mainImgWrap: {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    border: "1px solid #e2e8f0",
  },
  imgDiscountBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#22c55e",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 800,
    padding: "5px 12px",
    borderRadius: "6px",
    zIndex: 1,
  },
  wishlistBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    color: "#ef4444",
    zIndex: 1,
  },
  mainImg: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block",
  },

  // Info section
  infoSection: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    border: "1px solid #e2e8f0",
  },
  catBadge: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "4px",
    marginBottom: "12px",
  },
  productTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px",
    lineHeight: 1.3,
    letterSpacing: "-0.3px",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  ratingBadge: {
    background: "#22c55e",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 800,
    padding: "3px 10px",
    borderRadius: "4px",
  },
  ratingDivider: { color: "#cbd5e1" },
  soldCount: { color: "#64748b", fontSize: "0.82rem" },
  priceDivider: { height: "1px", background: "#f1f5f9", margin: "16px 0" },

  priceBlock: { marginBottom: "20px" },
  discountTag: {
    display: "inline-block",
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: "0.72rem",
    fontWeight: 800,
    padding: "3px 10px",
    borderRadius: "4px",
    marginBottom: "6px",
  },
  mainPrice: {
    fontSize: "2rem",
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-1px",
  },
  priceRow2: { display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" },
  mrpLabel: { color: "#94a3b8", fontSize: "0.82rem" },
  mrp: { color: "#94a3b8", fontSize: "0.85rem", textDecoration: "line-through" },
  savingsText: {
    color: "#16a34a",
    fontSize: "0.82rem",
    fontWeight: 700,
  },
  gstNote: { color: "#64748b", fontSize: "0.75rem", marginTop: "4px" },

  offersBox: {
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
    border: "1px solid #e2e8f0",
  },
  offersTitle: { fontWeight: 800, color: "#0f172a", fontSize: "0.88rem", marginBottom: "10px" },
  offerItem: { display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" },
  offerIcon: { fontSize: "0.85rem", flexShrink: 0, marginTop: "1px" },
  offerText: { color: "#374151", fontSize: "0.82rem", lineHeight: 1.4 },

  descBox: { marginBottom: "20px" },
  descTitle: { fontWeight: 800, color: "#0f172a", fontSize: "0.88rem", marginBottom: "8px" },
  descText: { color: "#475569", fontSize: "0.87rem", lineHeight: 1.7, margin: 0 },

  specsTable: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },
  specsTitle: {
    background: "#f8fafc",
    padding: "12px 16px",
    fontWeight: 800,
    color: "#0f172a",
    fontSize: "0.88rem",
    borderBottom: "1px solid #e2e8f0",
  },
  specRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    padding: "10px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.83rem",
  },
  specKey: { color: "#64748b", fontWeight: 600 },
  specVal: { color: "#1e293b", fontWeight: 500 },

  // Buy box
  buyBox: { display: "flex", flexDirection: "column", gap: "12px" },
  buyCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    position: "sticky",
    top: "120px",
  },
  buyPrice: { fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "2px" },
  buyMrp: { color: "#94a3b8", fontSize: "0.8rem", marginBottom: "14px" },
  buyDelivery: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "14px",
    border: "1px solid #e2e8f0",
  },
  buyDeliveryRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.82rem" },
  buyDeliveryLabel: { color: "#64748b", fontWeight: 600 },
  buyDeliveryVal: { color: "#0f172a", fontWeight: 700 },
  pincodeRow: { display: "flex", gap: "8px" },
  pincodeInput: {
    flex: 1,
    padding: "7px 10px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "0.8rem",
    outline: "none",
    color: "#1e293b",
  },
  pincodeBtn: {
    background: "none",
    border: "1.5px solid #3b82f6",
    color: "#3b82f6",
    borderRadius: "6px",
    padding: "7px 12px",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  deliveryResult: {
    color: "#16a34a",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginTop: "6px",
  },
  buyStock: { marginBottom: "14px" },
  inStockText: { color: "#16a34a", fontWeight: 700, fontSize: "0.88rem" },
  outStockText: { color: "#dc2626", fontWeight: 700, fontSize: "0.88rem" },
  qtyRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" },
  qtyLabel: { color: "#64748b", fontSize: "0.82rem", fontWeight: 600 },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "36px",
    height: "36px",
    border: "none",
    background: "#f8fafc",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: 700,
    color: "#374151",
  },
  qtyVal: {
    width: "44px",
    textAlign: "center",
    fontWeight: 800,
    fontSize: "0.95rem",
    color: "#0f172a",
  },
  addToCartBtn: {
    width: "100%",
    padding: "14px",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "10px",
    letterSpacing: "0.3px",
    transition: "background 0.2s",
  },
  buyNowBtn: {
    width: "100%",
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "14px",
    letterSpacing: "0.3px",
  },
  secureNotice: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.75rem",
    marginBottom: "12px",
  },
  soldByRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
    padding: "10px 0 0",
    borderTop: "1px solid #f1f5f9",
  },
  soldByLabel: { color: "#64748b" },
  soldByVal: { color: "#3b82f6", fontWeight: 700 },
  protectionCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  protectionTitle: { fontWeight: 800, color: "#0f172a", fontSize: "0.85rem", marginBottom: "6px" },
  protectionText: { color: "#64748b", fontSize: "0.78rem", margin: "0 0 10px", lineHeight: 1.5 },
  protectionCheck: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.82rem",
    color: "#374151",
    cursor: "pointer",
  },

  // Reviews
  reviewsSection: {
    background: "#fff",
    borderTop: "1px solid #e2e8f0",
    padding: "40px 0",
    marginTop: "24px",
  },
  reviewsInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },
  reviewsTitle: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 24px",
  },
  reviewsOverview: {
    display: "flex",
    gap: "48px",
    marginBottom: "28px",
    padding: "24px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    alignItems: "center",
  },
  reviewRatingBig: { textAlign: "center", minWidth: "120px" },
  ratingNumber: { fontSize: "3rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 },
  ratingTotal: { color: "#64748b", fontSize: "0.78rem", marginTop: "6px" },
  ratingBars: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  ratingBar: { display: "flex", alignItems: "center", gap: "12px" },
  ratingBarLabel: { color: "#f59e0b", fontSize: "0.78rem", fontWeight: 600, minWidth: "28px" },
  ratingBarTrack: {
    flex: 1,
    height: "10px",
    background: "#e2e8f0",
    borderRadius: "5px",
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    background: "#f59e0b",
    borderRadius: "5px",
  },
  ratingBarPct: { color: "#64748b", fontSize: "0.75rem", minWidth: "32px", textAlign: "right" },
  reviewCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  reviewCard: {
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  reviewHeader: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" },
  reviewAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  reviewName: { fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" },
  reviewDate: { color: "#94a3b8", fontSize: "0.75rem", marginLeft: "auto", whiteSpace: "nowrap" },
  reviewText: { color: "#475569", fontSize: "0.83rem", lineHeight: 1.6, margin: "0 0 10px" },
  reviewHelpful: { color: "#94a3b8", fontSize: "0.75rem" },
};

export default ProductDetail;