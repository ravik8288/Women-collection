import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { clearCart, readCart } from "../data/cart";

const steps = [
  { key: "name", title: "Customer Name", description: "Start the checkout by entering the name that should appear on the order.", fields: [["name", "Full Name"]] },
  { key: "address", title: "Delivery Address", description: "Add the main address details so the order can be routed correctly.", fields: [["address1", "Address Line 1"], ["address2", "Address Line 2"]] },
  { key: "city", title: "City Information", description: "Enter the city for delivery so the address can be completed accurately.", fields: [["city", "City"]] },
  { key: "state", title: "State Information", description: "Add the state or region so the shipping address is complete.", fields: [["state", "State"]] },
  { key: "pincode", title: "Postal Code", description: "Add the pincode so shipping and location details stay accurate.", fields: [["pincode", "Pincode"]] },
  { key: "country", title: "Country", description: "Confirm the destination country before adding contact details.", fields: [["country", "Country"]] },
  { key: "phone", title: "Phone Number", description: "Add a phone number so delivery updates and order support stay easy.", fields: [["phone", "Phone Number"]] },
  { key: "email", title: "Email Address", description: "Add a valid email address so order confirmation and delivery updates reach you.", fields: [["email", "Email Address"]] },
];

export default function Checkout() {
  const [item] = useState(() => readCart());
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});
  const [review, setReview] = useState(false);
  const [complete, setComplete] = useState(false);
  const current = steps[step];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, complete]);

  if (!item) return <Navigate to="/cart" replace />;
  const total = Number(item.price) * item.quantity;

  function submit(event) {
    event.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
    else setReview(true);
  }

  function placeOrder() {
    clearCart();
    setReview(false);
    setComplete(true);
  }

  if (complete) {
    return (
      <main className="order-confirmation-page">
        <section className="order-confirmation-card">
          <span className="confirmation-icon" aria-hidden="true"><i /></span>
          <p className="confirmation-pill">Order confirmed</p>
          <h1>Thank you for your order.</h1>
          <p>Your purchase has been confirmed. We&apos;ve received your order and are preparing<br /> it for shipment.</p>
          <strong>We&apos;ll let you know when it&apos;s on its way. Expect delivery within 3-5<br /> business days.</strong>
          <Link className="confirmation-button" to="/">Continue Shopping</Link>
        </section>
      </main>
    );
  }

  if (review) {
    return (
      <main className="final-review-page">
        <div className="final-review-grid">
          <section className="final-summary-panel">
            <p className="checkout-label">Final review</p>
            <h1>Review your order details.</h1>
            <p>Confirm the delivery information before placing your order.</p>
            <dl className="customer-review">
              <div><dt>Customer</dt><dd>{values.name}</dd></div>
              <div><dt>Address</dt><dd>{values.address1}{values.address2 ? `, ${values.address2}` : ""}<br />{values.city}, {values.state} {values.pincode}<br />{values.country}</dd></div>
              <div><dt>Phone</dt><dd>{values.phone}</dd></div>
              <div><dt>Email</dt><dd>{values.email}</dd></div>
            </dl>
            <button className="edit-details" onClick={() => setReview(false)}>Edit details</button>
          </section>

          <div className="final-order-column">
            <section className="final-order-card">
              <div className="final-order-item">
                <img src={item.image} alt={item.name} />
                <div><p className="checkout-label">Order item</p><h2>{item.name}</h2><span>Ready for final confirmation</span></div>
              </div>
              <div className="final-total-grid">
                <div><p>Subtotal</p><strong>₹{total.toFixed(2)}</strong></div>
                <div><p>Shipping</p><strong>₹0.00</strong></div>
                <div><p>Total</p><strong>₹{total.toFixed(2)}</strong></div>
              </div>
            </section>
            <section className="place-order-panel">
              <p className="checkout-label">Ready to place order</p>
              <h2>Everything looks set.</h2>
              <span>Continue to place the order and show the customer a strong premium confirmation screen.</span>
              <button onClick={placeOrder}>Place Order</button>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <p className="checkout-pill">Checkout flow</p>
        <h1>A more refined checkout from first detail to final confirmation.</h1>
        <p>This step now matches the premium storefront styling so the buying experience feels modern and trustworthy throughout.</p>
      </section>

      <div className="checkout-grid">
        <aside className="order-overview">
          <p className="checkout-label">Order overview</p>
          <div className="checkout-product">
            <img src={item.image} alt={item.name} />
            <div><h2>{item.name}</h2><span>Quantity: {item.quantity}</span><span>Price: ₹{Number(item.price).toFixed(2)}</span></div>
          </div>
          <dl>
            <div><dt>Subtotal</dt><dd>₹{total.toFixed(2)}</dd></div>
            <div><dt>Shipping</dt><dd>₹0.00</dd></div>
            <div className="grand-total"><dt>Total</dt><dd>₹{total.toFixed(2)}</dd></div>
          </dl>
        </aside>

        <section className="checkout-workflow">
          <div className="checkout-progress">
            <div>
              <p className="checkout-label">Progress</p>
              <strong>{complete ? "Complete" : `Step ${step + 1} of ${steps.length}`}</strong>
            </div>
            <div className="progress-track" aria-label={`Checkout progress: ${complete ? 100 : Math.round(((step + 1) / steps.length) * 100)} percent`}>
              {steps.map((itemStep, index) => <i className={index <= step || complete ? "done" : ""} key={itemStep.key} />)}
            </div>
            <p>Each step has been simplified visually so the form feels easier to complete.</p>
          </div>

          <form className="checkout-form-panel" onSubmit={submit}>
              <p className="checkout-label">Step {step + 1}</p>
              <h2>{current.title}</h2>
              <p>{current.description}</p>
              <div className="checkout-fields">
                {current.fields.map(([key, label], index) => (
                  <label key={key}>
                    {label}
                    <input
                      autoFocus={index === 0}
                      required={key !== "address2"}
                      type={key === "phone" ? "tel" : key === "email" ? "email" : "text"}
                      inputMode={key === "pincode" || key === "phone" ? "numeric" : undefined}
                      pattern={key === "email" ? "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}" : undefined}
                      title={key === "email" ? "Enter a complete email address, for example name@example.com" : undefined}
                      placeholder={key === "email" ? "name@example.com" : undefined}
                      value={values[key] || ""}
                      onChange={(event) => setValues({ ...values, [key]: event.target.value })}
                    />
                    {key === "email" && values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) && (
                      <span className="email-error">Enter a valid email with “@” and a domain ending, such as name@example.com.</span>
                    )}
                  </label>
                ))}
              </div>
              <div className="checkout-actions">
                {step > 0 && <button type="button" className="checkout-back" onClick={() => setStep(step - 1)}>Back</button>}
                <button type="submit" className="checkout-next">{step === steps.length - 1 ? "Confirm Details" : "Next"}</button>
              </div>
              <small>Please review each detail carefully before moving forward. Accurate delivery details help keep the order process smooth, reduce delays, and improve customer trust.</small>
          </form>
        </section>
      </div>
    </main>
  );
}
