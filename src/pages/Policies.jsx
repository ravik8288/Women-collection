export default function Policies() {
  return (
    <main className="policies-page">
      <section className="policies-hero">
        <p className="policies-pill">Policies</p>
        <h1>Important store policies,<br />presented with more clarity<br />and structure.</h1>
        <p>The policy pages now match the redesigned site so even legal and support information feels clean and professional.</p>
      </section>

      <section className="policy-panel privacy-panel">
        <p className="policy-label">Privacy policy</p>
        <h2>How information is handled</h2>
        <p>We value customer privacy and handle order-related information to support purchases, delivery coordination, and customer communication.</p>
        <div className="policy-subgrid">
          <div><h3>Information collected</h3><p>Name, address, email, phone number, and other order-related details may be collected to process purchases.</p></div>
          <div><h3>How it is used</h3><p>Customer information is used to manage orders, delivery, updates, and related service communication.</p></div>
        </div>
      </section>

      <section className="policy-panel return-panel">
        <p className="policy-label">Return policy</p>
        <h2>Return and support process</h2>
        <p>Returns are typically reviewed based on condition, packaging, and timing after delivery.</p>
        <div className="policy-subgrid">
          <div><h3>Eligibility</h3><p>Items should remain unused, in original condition, and within the eligible return period.</p></div>
          <div><h3>How to start</h3><p>Reach out through the contact page with your order details to receive the latest support process.</p></div>
        </div>
      </section>

      <section className="policy-panel terms-panel">
        <p className="policy-label">Terms and conditions</p>
        <h2>Website use and content terms</h2>
        <p>The site content, brand presentation, and related materials remain protected and should not be reused without permission. Use of the website implies acceptance of the store terms and related policies.</p>
      </section>
    </main>
  );
}
