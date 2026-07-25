import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <p className="contact-pill">Contact</p>
          <h1>Support should feel as premium as the storefront itself.</h1>
          <p>This page now follows the same elevated visual direction, making support and brand trust feel stronger.</p>
        </div>
        <div className="contact-facts">
          <div><span>Response</span><b>Fast support</b></div>
          <div><span>Tone</span><b>Professional and clear</b></div>
        </div>
      </section>

      <div className="contact-content">
        <section className="contact-form-panel">
          <h2>Send us a message</h2>
          <p>Use the form below for order questions, sizing help, or delivery support.</p>
          {sent ? (
            <div className="contact-success">
              <h3>Message received</h3>
              <p>Thank you. We will get back to you shortly.</p>
              <button type="button" onClick={() => setSent(false)}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <label htmlFor="contact-name">Full Name<input id="contact-name" name="name" required /></label>
              <label htmlFor="contact-email">Email Address<input id="contact-email" name="email" type="email" required /></label>
              <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows="6" required /></label>
              <button className="contact-submit" type="submit">Send Message</button>
            </form>
          )}
        </section>

        <aside className="contact-side">
          <section className="contact-info-panel">
            <p className="contact-label">Contact information</p>
            <h3>Address</h3><p>123 Artisan Lane<br />Craftsville, CA 90210<br />USA</p>
            <h3>Phone</h3><p>+1 (555) 123-4567</p>
            <h3>Email</h3><p>support@theartisan.shop</p>
          </section>
          <section className="contact-hours-panel">
            <p className="contact-label">Hours</p>
            <h3>Available Monday to Friday</h3>
            <p>9:00 AM to 5:00 PM (PST)</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
