import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const banners = [
  {
    bg: "linear-gradient(120deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
    tag: "NEW LAUNCH",
    title: "Next-Gen Electronics",
    sub: "Smartphones, laptops & more at unbeatable prices",
    cta: "Shop Electronics",
    accent: "#60a5fa",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
  },
  {
    bg: "linear-gradient(120deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
    tag: "SALE UP TO 50% OFF",
    title: "Fashion Week Deals",
    sub: "Top brands, trending styles — all at one place",
    cta: "Browse Fashion",
    accent: "#fb923c",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  },
  {
    bg: "linear-gradient(120deg, #14532d 0%, #15803d 50%, #22c55e 100%)",
    tag: "FREE DELIVERY",
    title: "Home & Living",
    sub: "Transform your space with premium home essentials",
    cta: "Explore Now",
    accent: "#86efac",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
  },
];

const deals = [
  { name: "Wireless Earbuds", price: "₹1,299", was: "₹2,999", off: "57% off", img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&q=80", rating: 4 },
  { name: "Running Shoes", price: "₹2,499", was: "₹4,999", off: "50% off", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80", rating: 5 },
  { name: "Smart Watch", price: "₹3,999", was: "₹7,499", off: "47% off", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80", rating: 4 },
  { name: "Backpack", price: "₹899", was: "₹1,799", off: "50% off", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80", rating: 4 },
  { name: "Sunglasses", price: "₹699", was: "₹1,499", off: "53% off", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80", rating: 3 },
  { name: "Coffee Maker", price: "₹2,199", was: "₹3,999", off: "45% off", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80", rating: 5 },
];

const categories = [
  { name: "Electronics", emoji: "💻", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80" },
  { name: "Fashion", emoji: "👗", color: "#fdf4ff", border: "#e9d5ff", text: "#7c3aed", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80" },
  { name: "Home & Living", emoji: "🛋️", color: "#fff7ed", border: "#fed7aa", text: "#c2410c", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
  { name: "Sports", emoji: "⚽", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80" },
];

const brands = [
  { name: "Apple", img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&q=80" },
  { name: "Nike", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80" },
  { name: "Samsung", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=120&q=80" },
  { name: "Adidas", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&q=80" },
  { name: "Sony", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80" },
  { name: "LG", img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=120&q=80" },
];

function Stars({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function Home() {
  const [slide, setSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 5, m: 42, s: 17 });

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const b = banners[slide];

  return (
    <div style={styles.page}>

      {/* ── HERO BANNER ── */}
      <section style={{ ...styles.hero, background: b.bg }}>
        <div style={styles.heroLeft}>
          <span style={{ ...styles.heroTag, background: "rgba(255,255,255,0.15)", color: b.accent }}>
            {b.tag}
          </span>
          <h1 style={styles.heroTitle}>{b.title}</h1>
          <p style={styles.heroSub}>{b.sub}</p>
          <div style={styles.heroActions}>
            <Link to="/products" style={{ ...styles.heroCta, background: b.accent, color: "#1e293b" }}>
              {b.cta} →
            </Link>
            <Link to="/register" style={styles.heroGhost}>
              Join Free
            </Link>
          </div>
        </div>
        <div style={styles.heroRight}>
          <img src={b.img} alt={b.title} style={styles.heroImg} />
        </div>
        <div style={styles.heroDots}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                ...styles.dot,
                width: i === slide ? "24px" : "8px",
                background: i === slide ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div style={styles.trustStrip}>
        {[
          ["🚀", "Same-day delivery", "In select cities"],
          ["🔒", "100% Secure", "Encrypted payments"],
          ["↩️", "Easy returns", "30-day policy"],
          ["📞", "24/7 Support", "Always here for you"],
        ].map(([icon, title, sub]) => (
          <div key={title} style={styles.trustItem}>
            <span style={styles.trustIcon}>{icon}</span>
            <div>
              <div style={styles.trustTitle}>{title}</div>
              <div style={styles.trustSub}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.main}>

        {/* ── FLASH DEALS ── */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <div style={styles.sectionHeadLeft}>
              <h2 style={styles.sectionTitle}>⚡ Flash Deals</h2>
              <div style={styles.countdown}>
                Ends in&nbsp;
                <span style={styles.countTimer}>{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</span>
              </div>
            </div>
            <Link to="/products" style={styles.viewAll}>View all deals →</Link>
          </div>

          <div style={styles.dealsGrid}>
            {deals.map((item, i) => (
              <Link to="/products" key={i} style={styles.dealCard}>
                <div style={styles.dealImgWrap}>
                  <img src={item.img} alt={item.name} style={styles.dealImg} onError={e => e.target.src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&q=80"} />
                  <span style={styles.dealBadge}>{item.off}</span>
                </div>
                <div style={styles.dealInfo}>
                  <div style={styles.dealName}>{item.name}</div>
                  <Stars rating={item.rating} />
                  <div style={styles.dealPriceRow}>
                    <span style={styles.dealPrice}>{item.price}</span>
                    <span style={styles.dealWas}>{item.was}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>Shop by Category</h2>
            <Link to="/products" style={styles.viewAll}>All categories →</Link>
          </div>
          <div style={styles.catGrid}>
            {categories.map(cat => (
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} key={cat.name} style={styles.catCard}>
                <div style={{ ...styles.catImgWrap, background: cat.color, border: `1px solid ${cat.border}` }}>
                  <img src={cat.img} alt={cat.name} style={styles.catImg} />
                </div>
                <div style={styles.catLabel}>
                  <span style={styles.catEmoji}>{cat.emoji}</span>
                  <span style={{ ...styles.catName, color: cat.text }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── PROMO SPLIT ── */}
        <section style={styles.promoRow}>
          <div style={styles.promoCard1}>
            <div style={styles.promoTag}>JUST IN</div>
            <h3 style={styles.promoTitle}>New Arrivals</h3>
            <p style={styles.promoSub}>Fresh drops every week</p>
            <Link to="/products" style={styles.promoCta}>Shop Now →</Link>
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80" style={styles.promoImg} alt="" />
          </div>
          <div style={styles.promoCard2}>
            <div style={{ ...styles.promoTag, background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>LIMITED OFFER</div>
            <h3 style={styles.promoTitle}>Up to 50% Off</h3>
            <p style={styles.promoSub}>On electronics this week</p>
            <Link to="/products" style={{ ...styles.promoCta, background: "#fbbf24", color: "#1e293b" }}>Grab Deal →</Link>
            <img src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80" style={styles.promoImg} alt="" />
          </div>
        </section>

        {/* ── BRANDS ── */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>Top Brands</h2>
          </div>
          <div style={styles.brandsRow}>
            {brands.map(brand => (
              <Link to="/products" key={brand.name} style={styles.brandCard}>
                <img src={brand.img} alt={brand.name} style={styles.brandImg} />
                <div style={styles.brandOverlay}>{brand.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── APP BANNER ── */}
        <div style={styles.appBanner}>
          <div>
            <div style={styles.appBannerTag}>MOBILE APP</div>
            <h3 style={styles.appBannerTitle}>Shop on the go</h3>
            <p style={styles.appBannerSub}>Exclusive app-only deals. Download CloudCart now.</p>
            <div style={styles.appBtns}>
              <div style={styles.appBtn}>📱 App Store</div>
              <div style={styles.appBtn}>🤖 Google Play</div>
            </div>
          </div>
          <div style={styles.appBannerRight}>
            <div style={styles.phoneMock}>
              <div style={styles.phoneMockInner}>
                <div style={{ fontSize: "2.5rem", textAlign: "center", paddingTop: "20px" }}>☁️</div>
                <div style={{ color: "#fff", textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>CloudCart</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f1f5f9", minHeight: "100vh" },

  // Hero
  hero: {
    display: "flex",
    alignItems: "center",
    padding: "0 60px",
    minHeight: "420px",
    position: "relative",
    overflow: "hidden",
    gap: "40px",
  },
  heroLeft: { flex: 1, zIndex: 1 },
  heroTag: {
    display: "inline-block",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "1.5px",
    marginBottom: "16px",
  },
  heroTitle: {
    color: "#fff",
    fontSize: "3rem",
    fontWeight: 900,
    margin: "0 0 14px",
    lineHeight: 1.1,
    letterSpacing: "-1px",
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "1rem",
    lineHeight: 1.6,
    margin: "0 0 28px",
    maxWidth: "420px",
  },
  heroActions: { display: "flex", gap: "12px", alignItems: "center" },
  heroCta: {
    padding: "13px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "0.95rem",
    letterSpacing: "0.3px",
  },
  heroGhost: {
    color: "rgba(255,255,255,0.85)",
    border: "1.5px solid rgba(255,255,255,0.3)",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  heroRight: { width: "400px", flexShrink: 0 },
  heroImg: {
    width: "100%",
    height: "340px",
    objectFit: "cover",
    borderRadius: "16px",
    opacity: 0.9,
  },
  heroDots: {
    position: "absolute",
    bottom: "20px",
    left: "60px",
    display: "flex",
    gap: "6px",
  },
  dot: {
    height: "8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s",
  },

  // Trust
  trustStrip: {
    background: "#fff",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderBottom: "1px solid #e2e8f0",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderRight: "1px solid #f1f5f9",
  },
  trustIcon: { fontSize: "1.4rem" },
  trustTitle: { fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" },
  trustSub: { color: "#64748b", fontSize: "0.75rem" },

  // Main
  main: { maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 60px" },

  section: { marginBottom: "36px" },

  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  sectionHeadLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  viewAll: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  countdown: {
    color: "#64748b",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  countTimer: {
    background: "#0f172a",
    color: "#fff",
    padding: "3px 10px",
    borderRadius: "6px",
    fontWeight: 800,
    fontSize: "0.82rem",
    letterSpacing: "1px",
    fontVariantNumeric: "tabular-nums",
  },

  // Deals
  dealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
  },
  dealCard: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    textDecoration: "none",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  dealImgWrap: {
    position: "relative",
    overflow: "hidden",
    background: "#f8fafc",
  },
  dealImg: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    display: "block",
  },
  dealBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "#22c55e",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  dealInfo: { padding: "10px 12px 14px" },
  dealName: {
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "0.82rem",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dealPriceRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" },
  dealPrice: { color: "#1e293b", fontWeight: 800, fontSize: "0.95rem" },
  dealWas: { color: "#94a3b8", fontSize: "0.75rem", textDecoration: "line-through" },

  // Categories
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  catCard: {
    textDecoration: "none",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    background: "#fff",
    transition: "transform 0.2s",
  },
  catImgWrap: {
    height: "160px",
    overflow: "hidden",
    position: "relative",
  },
  catImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.85,
  },
  catLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "#fff",
  },
  catEmoji: { fontSize: "1.2rem" },
  catName: { fontWeight: 700, fontSize: "0.9rem" },

  // Promo
  promoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "36px",
  },
  promoCard1: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    borderRadius: "14px",
    padding: "36px 40px",
    position: "relative",
    overflow: "hidden",
    minHeight: "200px",
  },
  promoCard2: {
    background: "linear-gradient(135deg, #0f172a 0%, #3b0764 100%)",
    borderRadius: "14px",
    padding: "36px 40px",
    position: "relative",
    overflow: "hidden",
    minHeight: "200px",
  },
  promoTag: {
    display: "inline-block",
    background: "rgba(59,130,246,0.2)",
    color: "#60a5fa",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "2px",
    padding: "4px 10px",
    borderRadius: "4px",
    marginBottom: "12px",
  },
  promoTitle: {
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: 800,
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  promoSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.85rem",
    margin: "0 0 20px",
  },
  promoCta: {
    display: "inline-block",
    background: "#3b82f6",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.85rem",
    position: "relative",
    zIndex: 1,
  },
  promoImg: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "180px",
    width: "200px",
    objectFit: "cover",
    opacity: 0.35,
    borderRadius: "0 0 14px 0",
  },

  // Brands
  brandsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
  },
  brandCard: {
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
    textDecoration: "none",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  brandImg: {
    width: "100%",
    height: "90px",
    objectFit: "cover",
    opacity: 0.7,
    display: "block",
  },
  brandOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15,23,42,0.4)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "0.85rem",
    letterSpacing: "0.5px",
  },

  // App banner
  appBanner: {
    background: "#0f172a",
    borderRadius: "16px",
    padding: "40px 56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appBannerTag: {
    color: "#3b82f6",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "2px",
    marginBottom: "12px",
  },
  appBannerTitle: {
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: 900,
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  appBannerSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.9rem",
    margin: "0 0 24px",
  },
  appBtns: { display: "flex", gap: "12px" },
  appBtn: {
    background: "#1e293b",
    color: "#cbd5e1",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: "1px solid #334155",
    cursor: "pointer",
  },
  appBannerRight: { flexShrink: 0 },
  phoneMock: {
    width: "100px",
    height: "180px",
    background: "#1e293b",
    borderRadius: "20px",
    border: "3px solid #334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneMockInner: { padding: "12px" },
};

export default Home;