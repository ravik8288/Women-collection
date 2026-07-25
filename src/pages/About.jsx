import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="about-pill">Brand story</p>
          <h1>A premium fashion storefront should feel intentional at every touchpoint.</h1>
          <p className="about-intro">women.collection.in is presented as a modern destination for polished festive fashion, with cleaner storytelling, better visual rhythm, and a more elevated brand tone.</p>
        </div>
        <div className="about-facts">
          <div><span>Positioning</span><b>Premium and current</b></div>
          <div><span>Goal</span><b>Stronger first impression</b></div>
        </div>
      </section>

      <div className="about-story-grid">
        <section className="about-card story-card">
          <p className="about-label">Our story</p>
          <h2>Why this storefront exists</h2>
          <p>The brand is framed around curated style, premium presentation, and a smoother shopping journey. The redesign shifts the business away from a generic marketplace look and toward a more modern boutique identity.</p>
        </section>
        <section className="about-card mission-card">
          <p className="about-label">Our mission</p>
          <h2>Create trust through design, clarity, and refined presentation.</h2>
          <p>Customers judge quality fast. Better color choices, stronger typography, more breathing room, and a clearer structure make the website feel newer, more premium, and more credible from the first visit.</p>
        </section>
      </div>

      <section className="about-values">
        <div><span className="value-icon clock" /><h3>Quality</h3><p>Sharper visuals and better hierarchy communicate higher product value instantly.</p></div>
        <div><span className="value-icon pin" /><h3>Confidence</h3><p>A modern boutique layout gives shoppers more trust during browsing and checkout.</p></div>
        <div><span className="value-icon clarity" /><h3>Clarity</h3><p>Cleaner page structure makes the website look more professional instead of crowded.</p></div>
      </section>

      <section className="about-cta">
        <h2>Explore the refreshed collection</h2>
        <p>The storefront, product details, cart, and checkout now share the same premium direction.</p>
        <Link className="button" to="/">Shop Now</Link>
      </section>
    </main>
  );
}
