import { useState } from "react";

const USERS_KEY = "shopeasy_users";
const SESSION_KEY = "shopeasy_session";

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
};
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const saveSession = (u) => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

const PRODUCTS = [
  { id: 1, name: "boAt Airdopes 141", category: "Electronics", price: 999, mrp: 4990, img: "🎧", rating: 4.2, reviews: 82341, badge: "Bestseller" },
  { id: 2, name: "Samsung 65\" 4K Smart TV", category: "Electronics", price: 54999, mrp: 89999, img: "📺", rating: 4.5, reviews: 12430, badge: "Deal of Day" },
  { id: 3, name: "Nike Air Max 270", category: "Fashion", price: 7495, mrp: 12995, img: "👟", rating: 4.3, reviews: 9821, badge: "" },
  { id: 4, name: "iPhone 15 Pro Max", category: "Electronics", price: 134900, mrp: 159900, img: "📱", rating: 4.7, reviews: 45231, badge: "Top Rated" },
  { id: 5, name: "Levi's 511 Slim Fit Jeans", category: "Fashion", price: 1799, mrp: 3999, img: "👖", rating: 4.1, reviews: 33421, badge: "" },
  { id: 6, name: "Prestige 5L Air Fryer", category: "Home", price: 3499, mrp: 7999, img: "🍳", rating: 4.4, reviews: 18932, badge: "Trending" },
  { id: 7, name: "Woodland Men's Boots", category: "Fashion", price: 2999, mrp: 5999, img: "🥾", rating: 4.0, reviews: 7654, badge: "" },
  { id: 8, name: "Dyson V15 Vacuum", category: "Home", price: 44900, mrp: 62900, img: "🌀", rating: 4.6, reviews: 5432, badge: "Premium" },
  { id: 9, name: "OnePlus Nord CE 3", category: "Electronics", price: 24999, mrp: 29999, img: "📲", rating: 4.3, reviews: 21098, badge: "" },
  { id: 10, name: "Zara Floral Dress", category: "Fashion", price: 2990, mrp: 5990, img: "👗", rating: 4.2, reviews: 4321, badge: "" },
  { id: 11, name: "Instant Pot Duo 7-in-1", category: "Home", price: 8499, mrp: 14999, img: "🥘", rating: 4.5, reviews: 11230, badge: "Top Rated" },
  { id: 12, name: "Sony WH-1000XM5", category: "Electronics", price: 24990, mrp: 34990, img: "🎵", rating: 4.8, reviews: 28760, badge: "Editor's Pick" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home"];

const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Rajdhani:wght@600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #f1f3f6; }
  :root {
    --fk-blue: #2874f0;
    --fk-yellow: #fb641b;
    --fk-light: #f1f3f6;
    --fk-white: #fff;
    --fk-text: #212121;
    --fk-sub: #878787;
    --fk-green: #388e3c;
    --fk-red: #ff6161;
  }

  /* AUTH */
  .auth-page {
    min-height: 100vh;
    display: flex;
    background: var(--fk-light);
  }
  .auth-left {
    background: var(--fk-blue);
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 36px;
    color: white;
  }
  .auth-left h1 { font-family: 'Rajdhani', sans-serif; font-size: 2.4rem; font-weight: 700; margin-bottom: 8px; }
  .auth-left p { font-size: 1rem; opacity: 0.85; line-height: 1.6; margin-bottom: 24px; }
  .auth-left img-placeholder { font-size: 5rem; }
  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }
  .auth-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.12);
    padding: 40px 36px;
    width: 100%;
    max-width: 420px;
  }
  .auth-tabs { display: flex; margin-bottom: 28px; border-bottom: 2px solid #f1f3f6; }
  .auth-tab {
    flex: 1; padding: 12px 0; font-size: 1rem; font-weight: 700;
    cursor: pointer; border: none; background: none;
    color: var(--fk-sub); transition: all 0.2s;
    border-bottom: 3px solid transparent; margin-bottom: -2px;
  }
  .auth-tab.active { color: var(--fk-blue); border-bottom-color: var(--fk-blue); }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--fk-sub); margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
  .form-group input {
    width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0;
    border-radius: 4px; font-size: 1rem; font-family: 'Nunito', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .form-group input:focus { border-color: var(--fk-blue); }
  .btn-primary {
    width: 100%; padding: 14px; background: var(--fk-yellow); color: white;
    border: none; border-radius: 4px; font-size: 1rem; font-weight: 800;
    font-family: 'Nunito', sans-serif; cursor: pointer; letter-spacing: 0.5px;
    transition: background 0.2s, transform 0.1s;
    text-transform: uppercase;
  }
  .btn-primary:hover { background: #e05510; transform: translateY(-1px); }
  .err-msg { background: #fff3f3; border: 1px solid #ffcdd2; color: #c62828; padding: 10px 14px; border-radius: 4px; margin-bottom: 16px; font-size: 0.9rem; font-weight: 600; }
  .success-msg { background: #f1f8e9; border: 1px solid #c5e1a5; color: #2e7d32; padding: 10px 14px; border-radius: 4px; margin-bottom: 16px; font-size: 0.9rem; font-weight: 600; }
  .auth-divider { text-align: center; color: var(--fk-sub); font-size: 0.85rem; margin: 20px 0; }

  /* NAVBAR */
  .navbar {
    background: var(--fk-blue); display: flex; align-items: center;
    padding: 0 20px; height: 56px; gap: 20px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .nav-logo { font-family: 'Rajdhani', sans-serif; font-size: 1.7rem; font-weight: 700; color: white; cursor: pointer; flex-shrink: 0; }
  .nav-logo span { color: #ffe500; font-style: italic; font-size: 0.7rem; vertical-align: super; }
  .nav-search {
    flex: 1; display: flex; background: white; border-radius: 2px; overflow: hidden;
    max-width: 560px;
  }
  .nav-search input {
    flex: 1; padding: 10px 14px; border: none; outline: none;
    font-family: 'Nunito', sans-serif; font-size: 0.95rem;
  }
  .nav-search-btn {
    background: var(--fk-yellow); border: none; padding: 0 18px;
    font-size: 1.2rem; cursor: pointer; color: white;
  }
  .nav-actions { display: flex; gap: 8px; margin-left: auto; align-items: center; }
  .nav-btn {
    color: white; background: none; border: none; cursor: pointer;
    padding: 6px 14px; border-radius: 2px; font-family: 'Nunito', sans-serif;
    font-size: 0.9rem; font-weight: 700; display: flex; flex-direction: column; align-items: center;
    transition: background 0.2s;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.15); }
  .nav-btn .icon { font-size: 1.3rem; }
  .nav-btn .label { font-size: 0.7rem; font-weight: 600; }

  /* CATEGORIES BAR */
  .cat-bar {
    background: white; display: flex; gap: 0; overflow-x: auto;
    border-bottom: 1px solid #e0e0e0; padding: 0 20px;
  }
  .cat-btn {
    padding: 12px 20px; font-family: 'Nunito', sans-serif; font-size: 0.85rem;
    font-weight: 700; border: none; background: none; cursor: pointer;
    color: var(--fk-text); white-space: nowrap;
    border-bottom: 3px solid transparent; transition: all 0.2s;
  }
  .cat-btn.active, .cat-btn:hover { color: var(--fk-blue); border-bottom-color: var(--fk-blue); }

  /* BANNER */
  .banner {
    background: linear-gradient(120deg, #2874f0 0%, #0b57d0 40%, #003a8c 100%);
    margin: 16px 20px; border-radius: 6px; padding: 36px 40px;
    display: flex; align-items: center; justify-content: space-between;
    color: white; overflow: hidden; position: relative;
  }
  .banner::before {
    content: ''; position: absolute; right: -40px; top: -40px;
    width: 220px; height: 220px; background: rgba(255,255,255,0.07);
    border-radius: 50%;
  }
  .banner h2 { font-family: 'Rajdhani', sans-serif; font-size: 2rem; font-weight: 700; }
  .banner p { opacity: 0.85; font-size: 0.95rem; margin-top: 6px; }
  .banner-emoji { font-size: 5rem; }

  /* PRODUCTS */
  .section-title {
    font-family: 'Rajdhani', sans-serif; font-size: 1.4rem; font-weight: 700;
    color: var(--fk-text); padding: 20px 20px 10px; display: flex;
    align-items: center; gap: 10px;
  }
  .product-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1px; background: #e0e0e0; margin: 0 0 24px;
  }
  .product-card {
    background: white; padding: 20px 16px; cursor: pointer;
    transition: box-shadow 0.2s; position: relative;
    display: flex; flex-direction: column; align-items: center;
  }
  .product-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 1; transform: scale(1.01); }
  .product-img { font-size: 4.5rem; margin-bottom: 12px; }
  .product-badge {
    position: absolute; top: 10px; left: 10px;
    background: var(--fk-green); color: white;
    font-size: 0.65rem; font-weight: 800; padding: 2px 7px;
    border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .product-name { font-size: 0.9rem; font-weight: 700; text-align: center; color: var(--fk-text); margin-bottom: 6px; line-height: 1.3; }
  .product-rating { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; margin-bottom: 6px; }
  .rating-badge { background: var(--fk-green); color: white; padding: 1px 6px; border-radius: 2px; font-weight: 800; }
  .product-price { font-size: 1.05rem; font-weight: 900; color: var(--fk-text); }
  .product-mrp { font-size: 0.8rem; color: var(--fk-sub); text-decoration: line-through; margin-left: 4px; }
  .product-discount { font-size: 0.8rem; color: var(--fk-green); font-weight: 800; margin-left: 4px; }
  .add-cart-btn {
    margin-top: 12px; width: 100%; padding: 9px 0;
    background: var(--fk-yellow); color: white; border: none;
    border-radius: 2px; font-family: 'Nunito', sans-serif;
    font-size: 0.85rem; font-weight: 800; cursor: pointer;
    text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s;
  }
  .add-cart-btn:hover { background: #e05510; }
  .add-cart-btn.added { background: var(--fk-green); }

  /* CART */
  .cart-page { padding: 20px; max-width: 1000px; margin: 0 auto; }
  .cart-title { font-family: 'Rajdhani', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
  .cart-item {
    background: white; border-radius: 4px; padding: 20px;
    display: flex; gap: 20px; align-items: center; margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .cart-item-img { font-size: 3rem; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 800; font-size: 1rem; margin-bottom: 4px; }
  .cart-item-price { color: var(--fk-text); font-weight: 900; font-size: 1.1rem; }
  .cart-remove { background: none; border: none; color: var(--fk-red); font-size: 1.2rem; cursor: pointer; padding: 4px; }
  .cart-summary {
    background: white; border-radius: 4px; padding: 24px; margin-top: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .cart-summary h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; color: var(--fk-sub); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; border-bottom: 1px solid #f1f3f6; }
  .summary-row.total { font-weight: 900; font-size: 1.1rem; color: var(--fk-text); border-bottom: none; }
  .summary-row.saving { color: var(--fk-green); font-weight: 700; }
  .checkout-btn {
    margin-top: 20px; width: 100%; padding: 16px;
    background: var(--fk-yellow); color: white; border: none;
    border-radius: 4px; font-family: 'Nunito', sans-serif;
    font-size: 1rem; font-weight: 800; cursor: pointer; text-transform: uppercase;
    letter-spacing: 0.5px; transition: background 0.2s;
  }
  .checkout-btn:hover { background: #e05510; }
  .empty-cart { text-align: center; padding: 60px 20px; color: var(--fk-sub); }
  .empty-cart .icon { font-size: 5rem; margin-bottom: 16px; }
  .empty-cart h3 { font-size: 1.3rem; font-weight: 800; color: var(--fk-text); margin-bottom: 8px; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #323232; color: white; padding: 12px 24px;
    border-radius: 4px; font-size: 0.9rem; font-weight: 700;
    z-index: 9999; animation: fadeInUp 0.3s ease;
  }
  @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* USER MENU */
  .user-menu-wrap { position: relative; }
  .user-dropdown {
    position: absolute; top: 50px; right: 0; background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2); border-radius: 4px;
    min-width: 200px; z-index: 200;
  }
  .user-dropdown-header { padding: 14px 16px; background: var(--fk-blue); color: white; border-radius: 4px 4px 0 0; }
  .user-dropdown-header span { font-weight: 800; font-size: 1rem; }
  .user-dropdown-item {
    padding: 12px 16px; font-size: 0.9rem; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 8px; transition: background 0.15s;
    border-bottom: 1px solid #f1f3f6; color: var(--fk-text);
  }
  .user-dropdown-item:hover { background: #f1f3f6; }
  .user-dropdown-item.logout { color: var(--fk-red); }

  @media (max-width: 600px) {
    .auth-left { display: none; }
    .auth-card { padding: 28px 18px; }
    .product-grid { grid-template-columns: repeat(2, 1fr); }
    .banner { padding: 20px; }
    .banner-emoji { font-size: 3rem; }
  }
`;

export default function App() {
  const [session, setSession] = useState(getSession);
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Auth states
  const [authTab, setAuthTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleLogin = () => {
    const users = getUsers();
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    if (!user) return setAuthError("Invalid email or password.");
    setAuthError("");
    saveSession(user);
    setSession(user);
    setPage("shop");
  };

  const handleSignup = () => {
    if (!signupData.name || !signupData.email || !signupData.password) return setAuthError("All fields are required.");
    if (signupData.password !== signupData.confirm) return setAuthError("Passwords do not match.");
    const users = getUsers();
    if (users.find(u => u.email === signupData.email)) return setAuthError("Email already registered.");
    const newUser = { name: signupData.name, email: signupData.email, password: signupData.password };
    saveUsers([...users, newUser]);
    setAuthError("");
    setAuthSuccess("Account created! Please login.");
    setAuthTab("login");
    setSignupData({ name: "", email: "", password: "", confirm: "" });
  };

  const handleLogout = () => { clearSession(); setSession(null); setCart([]); setShowUserMenu(false); };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart! 🛒`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartMRP = cart.reduce((s, i) => s + i.mrp * i.qty, 0);
  const cartQty = cart.reduce((s, i) => s + i.qty, 0);

  const filtered = PRODUCTS.filter(p =>
    (category === "All" || p.category === category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (!session) {
    return (
      <>
        <style>{styles}</style>
        <div className="auth-page">
          <div className="auth-left">
            <h1>🛍️ ShopEasy</h1>
            <p>India's fastest growing online marketplace. Millions of products, unbeatable prices.</p>
            <div style={{ fontSize: "4rem", marginTop: "20px" }}>🎁 💳 🚀</div>
            <div style={{ marginTop: "32px", fontSize: "0.85rem", opacity: 0.7 }}>
              ✓ 10 Crore+ Happy Customers<br />
              ✓ Free Delivery on Orders ₹499+<br />
              ✓ Easy 10-Day Returns
            </div>
          </div>
          <div className="auth-right">
            <div className="auth-card">
              <div className="auth-tabs">
                <button className={`auth-tab ${authTab === "login" ? "active" : ""}`} onClick={() => { setAuthTab("login"); setAuthError(""); setAuthSuccess(""); }}>Login</button>
                <button className={`auth-tab ${authTab === "signup" ? "active" : ""}`} onClick={() => { setAuthTab("signup"); setAuthError(""); setAuthSuccess(""); }}>Create Account</button>
              </div>
              {authError && <div className="err-msg">⚠️ {authError}</div>}
              {authSuccess && <div className="success-msg">✅ {authSuccess}</div>}
              {authTab === "login" ? (
                <>
                  <div className="form-group">
                    <label>Email / Mobile</label>
                    <input type="email" placeholder="Enter Email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Enter Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  </div>
                  <button className="btn-primary" onClick={handleLogin}>Login Securely →</button>
                  <div className="auth-divider">— or —</div>
                  <button className="btn-primary" style={{ background: "#2874f0" }} onClick={() => { setAuthTab("signup"); setAuthError(""); }}>Create New Account</button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your Name" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="yourname@email.com" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Min 6 characters" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Re-enter password" value={signupData.confirm} onChange={e => setSignupData({ ...signupData, confirm: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSignup()} />
                  </div>
                  <button className="btn-primary" onClick={handleSignup}>Create Account →</button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setPage("shop")}>🛍️ ShopEasy <span>plus</span></div>
        <div className="nav-search">
          <input placeholder="Search for products, brands and more" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setPage("shop")} />
          <button className="nav-search-btn" onClick={() => setPage("shop")}>🔍</button>
        </div>
        <div className="nav-actions">
          <div className="user-menu-wrap">
            <button className="nav-btn" onClick={() => setShowUserMenu(v => !v)}>
              <span className="icon">👤</span>
              <span className="label">{session.name.split(" ")[0]}</span>
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header"><span>Hello, {session.name} 👋</span></div>
                <div className="user-dropdown-item" onClick={() => { setPage("shop"); setShowUserMenu(false); }}>🏠 Home</div>
                <div className="user-dropdown-item logout" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
          <button className="nav-btn" onClick={() => setPage("cart")}>
            <span className="icon">🛒{cartQty > 0 && <span style={{ background: "var(--fk-yellow)", borderRadius: "50%", fontSize: "0.65rem", padding: "1px 5px", marginLeft: "2px" }}>{cartQty}</span>}</span>
            <span className="label">Cart</span>
          </button>
        </div>
      </nav>

      {/* CATEGORIES */}
      <div className="cat-bar">
        {CATEGORIES.map(c => (
          <button key={c} className={`cat-btn ${category === c ? "active" : ""}`} onClick={() => { setCategory(c); setPage("shop"); }}>
            {c === "All" ? "🏠 All" : c === "Electronics" ? "⚡ Electronics" : c === "Fashion" ? "👗 Fashion" : "🏡 Home & Kitchen"}
          </button>
        ))}
      </div>

      {page === "shop" && (
        <div>
          {/* BANNER */}
          <div className="banner">
            <div>
              <h2>🔥 Big Billion Days Sale</h2>
              <p>Up to 80% off on top brands • Limited time offer</p>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                {["Free Delivery", "10-Day Return", "EMI Available"].map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="banner-emoji">🎉</div>
          </div>

          <div className="section-title">
            {search ? `🔍 Results for "${search}"` : `${category === "All" ? "🌟 Featured Products" : `📦 ${category}`}`}
            <span style={{ fontSize: "0.9rem", color: "var(--fk-sub)", fontFamily: "Nunito", fontWeight: 600 }}>({filtered.length} items)</span>
          </div>
          <div className="product-grid">
            {filtered.map(p => {
              const inCart = cart.find(i => i.id === p.id);
              return (
                <div key={p.id} className="product-card">
                  {p.badge && <div className="product-badge">{p.badge}</div>}
                  <div className="product-img">{p.img}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-rating">
                    <span className="rating-badge">⭐ {p.rating}</span>
                    <span style={{ color: "var(--fk-sub)" }}>({(p.reviews / 1000).toFixed(0)}K)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                    <span className="product-price">₹{p.price.toLocaleString("en-IN")}</span>
                    <span className="product-mrp">₹{p.mrp.toLocaleString("en-IN")}</span>
                    <span className="product-discount">{discount(p.price, p.mrp)}% off</span>
                  </div>
                  <button className={`add-cart-btn ${inCart ? "added" : ""}`} onClick={() => addToCart(p)}>
                    {inCart ? `✅ In Cart (${inCart.qty})` : "🛒 Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--fk-sub)" }}>
              <div style={{ fontSize: "4rem" }}>🔍</div>
              <h3 style={{ marginTop: "16px", color: "var(--fk-text)" }}>No products found</h3>
            </div>
          )}
        </div>
      )}

      {page === "cart" && (
        <div className="cart-page">
          <div className="cart-title">🛒 My Cart ({cartQty} items)</div>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="icon">🛒</div>
              <h3>Your cart is empty!</h3>
              <p>Add items to get started</p>
              <button className="btn-primary" style={{ marginTop: "20px", width: "auto", padding: "12px 32px" }} onClick={() => setPage("shop")}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">{item.img}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div style={{ color: "var(--fk-sub)", fontSize: "0.85rem", marginBottom: "4px" }}>Qty: {item.qty}</div>
                    <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString("en-IN")} <span style={{ textDecoration: "line-through", color: "var(--fk-sub)", fontSize: "0.85rem", fontWeight: 400 }}>₹{(item.mrp * item.qty).toLocaleString("en-IN")}</span></div>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              ))}
              <div className="cart-summary">
                <h3>Price Details</h3>
                <div className="summary-row"><span>Price ({cartQty} items)</span><span>₹{cartMRP.toLocaleString("en-IN")}</span></div>
                <div className="summary-row saving"><span>Discount</span><span>−₹{(cartMRP - cartTotal).toLocaleString("en-IN")}</span></div>
                <div className="summary-row"><span>Delivery</span><span style={{ color: "var(--fk-green)" }}>FREE</span></div>
                <div className="summary-row total"><span>Total Amount</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
                <div style={{ color: "var(--fk-green)", fontSize: "0.85rem", fontWeight: 700, marginTop: "8px" }}>
                  🎉 You save ₹{(cartMRP - cartTotal).toLocaleString("en-IN")} on this order!
                </div>
                <button className="checkout-btn" onClick={() => { showToast("🎉 Order placed successfully! Thank you " + session.name + "!"); setCart([]); setPage("shop"); }}>
                  Place Order →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}