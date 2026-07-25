import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readCart, writeCart } from "../data/cart";

export default function Cart() {
  const [item, setItem] = useState(() => readCart());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function changeQuantity(nextQuantity) {
    const next = { ...item, quantity: Math.max(1, nextQuantity) };
    setItem(next);
    writeCart(next);
  }

  if (!item) {
    return (
      <main className="page container cart-empty">
        <p className="eyebrow gold">Your selection</p>
        <h1>Your shopping bag is empty.</h1>
        <p>Discover a statement look from our latest premium edit.</p>
        <Link className="button gold-button" to="/">Continue Shopping</Link>
      </main>
    );
  }

  const subtotal = Number(item.price) * item.quantity;

  return (
    <main className="cart-page">
      <section className="cart-intro">
        <p className="cart-pill">Order review</p>
        <h1>Your cart, presented in a cleaner premium layout.</h1>
        <p>The order summary now feels more polished and trustworthy, with clearer totals and<br /> stronger checkout emphasis.</p>
      </section>

      <div className="cart-layout">
        <div className="cart-column">
          <section className="cart-review-panel">
            <div className="cart-product">
              <img src={item.image} alt={item.name} />
              <div className="cart-product-copy">
                <p>Selected look</p>
                <h2>{item.name}</h2>
                <span>Product ID: #{String(item.id).padStart(3, "0")}</span>
              </div>
              <strong>₹{Number(item.price).toFixed(2)}</strong>
            </div>

            <div className="cart-divider" />

            <div className="cart-quantity">
              <div><p>Quantity</p><span>Update the quantity before you continue.</span></div>
              <div className="cart-stepper">
                <button onClick={() => changeQuantity(item.quantity - 1)} aria-label="Decrease quantity">−</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(item.quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="cart-totals">
              <div><p>Subtotal</p><strong>₹{subtotal.toFixed(2)}</strong></div>
              <div><p>Discount</p><strong>-₹0.00</strong></div>
              <div><p>Total</p><strong>₹{subtotal.toFixed(2)}</strong></div>
            </div>
          </section>

          <section className="checkout-panel">
            <p>Ready to continue</p>
            <h2>Proceed with a more premium checkout experience.</h2>
            <span>This refreshed checkout keeps the same flow but now looks calmer, more modern, and more credible.</span>
            <Link className="checkout-link" to="/checkout">Proceed to Checkout</Link>
          </section>
        </div>
      </div>
    </main>
  );
}
