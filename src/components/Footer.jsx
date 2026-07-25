import { Link } from "react-router-dom";
export default function Footer(){
  return <footer><div className="footer-grid container">
    <section><p className="eyebrow gold">House of premium edits</p><h3>women.collection.in</h3><p>women.collection.in offers daily new arrivals and curated modern fashion for women.</p><div className="footer-pills"><span>Modern silhouettes</span><span>Premium finish</span><span>Quick support</span></div></section>
    <section><p className="eyebrow gold">Explore</p>{[["/","Shop"],["/about","About Us"],["/faq","FAQ"],["/contact","Contact"],["/policies","Policies"]].map(([to,l])=><Link key={to} to={to}>{l}</Link>)}</section>
    <section><p className="eyebrow gold">Client promise</p><p>Carefully presented styles with a refined shopping journey from browsing to checkout.</p><p>Need assistance with your order, sizing, or delivery? Use the contact page and we will respond quickly.</p></section>
  </div><div className="footer-bottom container"><span>© 2026 women.collection.in. All rights reserved.</span><span>Designed for a premium storefront experience.</span></div></footer>
}
