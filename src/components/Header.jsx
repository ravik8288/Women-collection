import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { categories } from "../data/posts";
import { cartCount } from "../data/cart";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState(false);
  const [count, setCount] = useState(() => cartCount());
  useEffect(() => {
    const updateCount = () => setCount(cartCount());
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);
  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <div className="brand-wrap"><img className="brand-icon" src="/icons/women-collection-mark.svg" alt="" aria-hidden="true" /><Link className="brand" to="/"><strong>women.collection.in</strong><small>Modern festive fashion</small></Link></div>
          <nav className="desktop-nav">
            <NavLink to="/">Home</NavLink>
            <button
              className={collections ? "categories-open" : ""}
              onClick={() => setCollections(!collections)}
              aria-expanded={collections}
              aria-controls="category-menu"
            >
              Categories
              <img className="category-arrow" src="/icons/chevron-down.svg" alt="" aria-hidden="true" />
            </button>
            <NavLink to="/faq">FAQ</NavLink><NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink><NavLink to="/policies">Policies</NavLink>
          </nav>
          <div className="nav-actions"><Link to="/">New arrivals</Link><Link aria-label={`Shopping cart, ${count} item${count === 1 ? "" : "s"}`} className={`bag ${count ? "has-items" : ""}`} to="/cart">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="19" cy="20" r="1.5" />
              <path d="M2 3h3l2.4 11.5a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            <b>{count}</b>
          </Link><button className="menu" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button></div>
          {collections && <div className="category-popover" id="category-menu"><p>Browse edits</p>{categories.map(c=><Link onClick={()=>setCollections(false)} key={c.slug} to={`/category/${c.slug}`}>{c.name}</Link>)}</div>}
        </div>
      </header>
      {open && <div className="drawer-backdrop" onClick={()=>setOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}>
        <button className="drawer-close" onClick={()=>setOpen(false)}>×</button><p className="eyebrow">Navigation</p><h2>Discover</h2>
        <p className="muted">Market Place, E-Commerce, Buy new fashion</p>
        <nav>{[["/","Home"],["/faq","FAQ"],["/about","About Us"],["/contact","Contact Us"],["/policies","Policies"]].map(([to,label])=><Link onClick={()=>setOpen(false)} key={to} to={to}>{label}<span>→</span></Link>)}</nav>
        <p className="eyebrow drawer-label">Collections</p><h3>Shop by Category</h3>
        <nav>{categories.map(c=><Link onClick={()=>setOpen(false)} key={c.slug} to={`/category/${c.slug}`}>{c.name}<span>→</span></Link>)}</nav>
      </aside></div>}
    </>
  );
}
