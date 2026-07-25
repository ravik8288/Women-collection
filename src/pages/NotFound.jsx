import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container cart-empty">
      <p className="eyebrow gold">404 · Page not found</p>
      <h1>This look has left the collection.</h1>
      <p>Return to the storefront to explore our current premium edit.</p>
      <Link to="/" className="button gold-button">Back to home</Link>
    </div>
  );
}
