import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";

const FALLBACK_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  default: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80",
};

function Stars({ rating = 4, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
      {count && <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>({count})</span>}
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const imgSrc = product.image_url || FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
  const rating = (product.id % 2) + 3;
  const reviewCount = 40 + (product.id * 17) % 300;
  const discount = 10 + (product.id % 5) * 8;
  const original = Math.round(product.price / (1 - discount / 100));

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          ...styles.card,
          boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-3px)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Badges */}
        <div style={styles.badges}>
          {product.stock === 0 && <span style={styles.soldOutBadge}>Sold Out</span>}
          {product.stock > 0 && product.stock < 5 && (
            <span style={styles.urgencyBadge}>Only {product.stock} left!</span>
          )}
          {product.stock > 0 && <span style={styles.discountBadge}>{discount}% off</span>}
        </div>

        {/* Wishlist */}
        <button style={styles.wishBtn} onClick={e => e.preventDefault()}>♡</button>

        <div style={styles.imgWrap}>
          <img src={imgSrc} alt={product.name} style={styles.img} />
        </div>

        <div style={styles.cardBody}>
          <div style={styles.catTag}>{product.category}</div>
          <h3 style={styles.productName}>{product.name}</h3>
          <Stars rating={rating} count={reviewCount} />

          <div style={styles.priceBlock}>
            <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
            <span style={styles.mrp}>₹{Number(original).toLocaleString()}</span>
            <span style={styles.savings}>{discount}% off</span>
          </div>

          <div style={styles.cardFooter}>
            <span style={{
              ...styles.stockPill,
              background: product.stock > 0 ? "#dcfce7" : "#fee2e2",
              color: product.stock > 0 ? "#16a34a" : "#dc2626",
            }}>
              {product.stock > 0 ? "✔ In Stock" : "✘ Out of Stock"}
            </span>
            {product.stock > 0 && (
              <span style={styles.deliveryNote}>🚀 Fast delivery</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState("grid");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/categories`)
      .then(r => setCategories(r.data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    axios
      .get(`${API_URL}/api/products`, { params })
      .then(r => {
        let list = r.data.products;
        if (inStockOnly) list = list.filter(p => p.stock > 0);
        if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
        if (sort === "rating") list = [...list].sort((a, b) => (b.id % 2 + 3) - (a.id % 2 + 3));
        setProducts(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, sort, inStockOnly]);

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <div>
            <div style={styles.breadcrumb}>
              <Link to="/" style={styles.breadLink}>Home</Link>
              <span style={styles.breadSep}>/</span>
              {category ? (
                <>
                  <span style={styles.breadLink} onClick={() => setCategory("")}>All Products</span>
                  <span style={styles.breadSep}>/</span>
                  <span style={styles.breadCurrent}>{category}</span>
                </>
              ) : (
                <span style={styles.breadCurrent}>All Products</span>
              )}
            </div>
            <h1 style={styles.pageTitle}>
              {category || "All Products"}
            </h1>
            <p style={styles.pageSubtitle}>{products.length} results found</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.searchBarWrap}>
              <input
                style={styles.searchBar}
                placeholder="Search within results…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar filters */}
        <aside style={styles.sidebar}>
          <div style={styles.filterCard}>
            <div style={styles.filterTitle}>Filters</div>

            {/* Category */}
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Category</div>
              <div style={styles.filterOptions}>
                <label style={styles.filterOption}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === ""}
                    onChange={() => setCategory("")}
                    style={styles.radio}
                  />
                  All Categories
                  <span style={styles.filterCount}>({products.length})</span>
                </label>
                {categories.map(c => (
                  <label key={c} style={styles.filterOption}>
                    <input
                      type="radio"
                      name="category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      style={styles.radio}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterDivider} />

            {/* Sort */}
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Sort By</div>
              <div style={styles.filterOptions}>
                {[
                  ["", "Relevance"],
                  ["price_asc", "Price: Low to High"],
                  ["price_desc", "Price: High to Low"],
                  ["rating", "Customer Rating"],
                ].map(([val, label]) => (
                  <label key={val} style={styles.filterOption}>
                    <input
                      type="radio"
                      name="sort"
                      checked={sort === val}
                      onChange={() => setSort(val)}
                      style={styles.radio}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterDivider} />

            {/* Availability */}
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Availability</div>
              <label style={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  style={styles.checkbox}
                />
                In Stock Only
              </label>
            </div>

            <div style={styles.filterDivider} />

            {/* Customer Rating */}
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Customer Rating</div>
              {[4, 3, 2].map(r => (
                <label key={r} style={styles.filterOption}>
                  <input type="checkbox" style={styles.checkbox} />
                  <span style={{ color: "#f59e0b" }}>{"★".repeat(r)}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}> & above</span>
                </label>
              ))}
            </div>

            <button
              style={styles.clearFilters}
              onClick={() => { setCategory(""); setSort(""); setInStockOnly(false); setSearch(""); }}
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div style={styles.mainCol}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.toolbarLeft}>
              <div style={styles.pillsRow}>
                <button
                  style={{ ...styles.pill, ...(category === "" ? styles.pillActive : {}) }}
                  onClick={() => setCategory("")}
                >All</button>
                {categories.map(c => (
                  <button
                    key={c}
                    style={{ ...styles.pill, ...(category === c ? styles.pillActive : {}) }}
                    onClick={() => setCategory(c)}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div style={styles.toolbarRight}>
              <span style={styles.resultCount}>{products.length} products</span>
              <select
                style={styles.sortSelect}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="">Sort: Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                style={{ ...styles.viewBtn, ...(view === "grid" ? styles.viewBtnActive : {}) }}
                onClick={() => setView("grid")}
                title="Grid view"
              >⊞</button>
              <button
                style={{ ...styles.viewBtn, ...(view === "list" ? styles.viewBtnActive : {}) }}
                onClick={() => setView("list")}
                title="List view"
              >☰</button>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div style={{ ...styles.grid, gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} style={styles.skeleton} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ color: "#1e293b", fontSize: "1.1rem", margin: "0 0 8px" }}>No products found</h3>
              <p style={{ color: "#64748b", margin: "0 0 20px" }}>Try adjusting your search or filters</p>
              <button style={styles.clearBtn} onClick={() => { setSearch(""); setCategory(""); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={view === "grid" ? styles.grid : styles.listView}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f1f5f9", minHeight: "100vh" },

  pageHeader: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "20px 0",
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "6px",
  },
  breadLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  breadSep: { color: "#cbd5e1", fontSize: "0.8rem" },
  breadCurrent: { color: "#64748b", fontSize: "0.8rem" },
  pageTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px",
    letterSpacing: "-0.3px",
  },
  pageSubtitle: { color: "#64748b", fontSize: "0.82rem", margin: 0 },
  headerRight: {},
  searchBarWrap: { position: "relative" },
  searchBar: {
    padding: "9px 36px 9px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.87rem",
    outline: "none",
    width: "240px",
    color: "#1e293b",
  },
  searchIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "20px",
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "0 24px",
    alignItems: "start",
  },

  // Sidebar
  sidebar: { position: "sticky", top: "120px" },
  filterCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
  },
  filterTitle: {
    fontSize: "0.95rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  filterSection: { marginBottom: "16px" },
  filterLabel: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#374151",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  filterOptions: { display: "flex", flexDirection: "column", gap: "8px" },
  filterOption: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.84rem",
    color: "#374151",
    cursor: "pointer",
  },
  filterCount: { color: "#94a3b8", fontSize: "0.75rem", marginLeft: "auto" },
  radio: { accentColor: "#3b82f6", cursor: "pointer" },
  checkbox: { accentColor: "#3b82f6", cursor: "pointer" },
  filterDivider: { height: "1px", background: "#f1f5f9", margin: "16px 0" },
  clearFilters: {
    width: "100%",
    padding: "10px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
  },

  // Main col
  mainCol: {},
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px",
    border: "1px solid #e2e8f0",
    gap: "12px",
  },
  toolbarLeft: { flex: 1, overflow: "hidden" },
  pillsRow: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  pill: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: 600,
    color: "#374151",
    whiteSpace: "nowrap",
  },
  pillActive: {
    background: "#3b82f6",
    color: "#fff",
    border: "1px solid #3b82f6",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  resultCount: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
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
  viewBtn: {
    width: "32px",
    height: "32px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },
  viewBtnActive: {
    background: "#eff6ff",
    color: "#3b82f6",
    border: "1px solid #bfdbfe",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  // Card
  card: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    position: "relative",
    cursor: "pointer",
  },
  badges: {
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    zIndex: 2,
  },
  discountBadge: {
    background: "#22c55e",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  soldOutBadge: {
    background: "#ef4444",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  urgencyBadge: {
    background: "#f97316",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  wishBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    cursor: "pointer",
    color: "#ef4444",
    zIndex: 2,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  imgWrap: {
    height: "190px",
    overflow: "hidden",
    background: "#f8fafc",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  cardBody: { padding: "14px" },
  catTag: {
    color: "#3b82f6",
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: "5px",
  },
  productName: {
    margin: "0 0 6px",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  priceBlock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "8px 0",
    flexWrap: "wrap",
  },
  price: { color: "#0f172a", fontWeight: 800, fontSize: "1.05rem" },
  mrp: { color: "#94a3b8", fontSize: "0.78rem", textDecoration: "line-through" },
  savings: {
    color: "#16a34a",
    fontSize: "0.72rem",
    fontWeight: 700,
    background: "#dcfce7",
    padding: "2px 7px",
    borderRadius: "4px",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  stockPill: {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: "4px",
  },
  deliveryNote: {
    fontSize: "0.7rem",
    color: "#3b82f6",
    fontWeight: 600,
  },

  // Loading / empty
  skeleton: {
    height: "300px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    border: "1px solid #e2e8f0",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  clearBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Products;