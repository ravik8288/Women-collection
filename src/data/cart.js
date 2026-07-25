const CART_KEY = "vastralakshmi-cart";

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || null;
  } catch {
    return null;
  }
}

export function writeCart(item) {
  localStorage.setItem(CART_KEY, JSON.stringify(item));
  window.dispatchEvent(new Event("cart-updated"));
}

export function cartCount() {
  return readCart()?.quantity || 0;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
