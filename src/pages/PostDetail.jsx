import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getProduct, products } from "../data/posts";
import { writeCart } from "../data/cart";
import AdSlot from "../components/AdSlot";
import RewardedAdModal from "../components/RewardedAdModal";
import { AD_SLOT_PATHS } from "../components/AdConfig";

export default function PostDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState(true);

  useEffect(() => {
    setPhoto(0);
    setQuantity(1);
    setIsRewardedAdOpen(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    // Interstitial display timeout (1 second delay)
    const timer = setTimeout(() => {
      const googletag = window.googletag || { cmd: [] };
      googletag.cmd.push(() => {
        const adPath = AD_SLOT_PATHS.interstitial;
        if (!adPath) return;

        const existingSlots = googletag.pubads().getSlots();
        const hasInterstitial = existingSlots.some(
          (s) => s.getSlotPath() === adPath
        );

        if (!hasInterstitial) {
          console.log("PostDetail: Defining out-of-page Web Interstitial slot");
          const interstitialSlot = googletag.defineOutOfPageSlot(
            adPath,
            googletag.enums.OutOfPageFormat.INTERSTITIAL
          );
          if (interstitialSlot) {
            interstitialSlot.addService(googletag.pubads()).setConfig({
              interstitial: {
                triggers: {
                  navBar: true,
                  unhideWindow: true,
                },
              },
            });
            googletag.display(interstitialSlot);
            googletag.pubads().refresh([interstitialSlot]);
          }
        } else {
          // If already defined, refresh it
          const slot = existingSlots.find(
            (s) => s.getSlotPath() === adPath
          );
          if (slot) {
            googletag.pubads().refresh([slot]);
          }
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  if (!product) {
    return (
      <main className="page container cart-empty">
        <p className="eyebrow gold">Product unavailable</p>
        <h1>This look has left the collection.</h1>
        <Link className="button gold-button" to="/">Return to collection</Link>
      </main>
    );
  }

  const remoteGallery = product.gallery.length ? product.gallery : [product.image];
  const images = [product.image, ...remoteGallery.filter((image) => image !== product.image)];
  const paragraphs = product.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const related = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 4);

  return (
    <main className="look-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>›</span>
          <Link to={`/category/${product.category}`}>{product.categoryName}</Link><span>›</span>
          <span>{product.name}</span>
        </nav>

        <article className="look-shell">
          <section className="look-visuals" aria-label="Product gallery">
            <div className="product-gallery">
              <img src={images[photo]} alt={`${product.name} — view ${photo + 1}`} />
              {images.length > 1 && (
                <>
                  <button className="prev" onClick={() => setPhoto((photo - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>
                  <button className="next" onClick={() => setPhoto((photo + 1) % images.length)} aria-label="Next image">›</button>
                </>
              )}
              <span className="image-count">{photo + 1} / {images.length}</span>
            </div>
            {images.length > 1 && (
              <div className="thumb-strip">
                {images.map((image, index) => (
                  <button className={index === photo ? "selected" : ""} onClick={() => setPhoto(index)} key={`${image}-${index}`} aria-label={`Show image ${index + 1}`}>
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="product-info">
            <p className="look-category">{product.categoryName}</p>
            <h1>{product.name}</h1>
            <div className="look-price-row">
              <p className="price">₹{product.price}.00</p>
              <span>Inclusive of all taxes</span>
            </div>
            <p className="look-intro">{paragraphs[0]}</p>

            <div className="purchase-box">
              <div>
                <span className="control-label">Quantity</span>
                <div className="quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
              </div>
              <Link
                className="button gold-button add-cart"
                to="/cart"
                onClick={() => writeCart({ id: product.id, name: product.name, image: product.image, price: product.price, quantity })}
              >
                Add to Cart
              </Link>
            </div>

            <AdSlot type="banner1" id="div-gpt-ad-1782805288205-0" />

            <div className="service-grid">
              <div><b>Premium finish</b><span>Carefully selected presentation</span></div>
              <div><b>Quick support</b><span>Help with sizing and orders</span></div>
              <div><b>Secure checkout</b><span>A smooth purchase journey</span></div>
            </div>

            <dl className="look-meta">
              <div><dt>Category</dt><dd>{product.categoryName}</dd></div>
              <div><dt>Product ID</dt><dd>#{product.id}</dd></div>
              <div><dt>Availability</dt><dd>In stock</dd></div>
            </dl>
          </section>
        </article>

        <section className="description-panel">
          <div><p className="eyebrow">The details</p><h2>Product description</h2></div>
          <div className="description-copy">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </section>

        <AdSlot type="banner2" id="div-gpt-ad-1782805720228-0" />

        <section className="related">
          <div className="section-head">
            <div><p className="eyebrow gold">Complete the edit</p><h2>You Might Also Like</h2></div>
            <Link to={`/category/${product.category}`}>View collection</Link>
          </div>
          <div className="product-grid">{related.map((item) => <PostCard key={item.slug} post={item} />)}</div>
        </section>

        <AdSlot type="banner3" id="div-gpt-ad-1782806188858-0" />
      </div>

      <AdSlot type="anchor" id="div-gpt-ad-1782806380863-0" className="sticky-anchor-ad" />

      <RewardedAdModal isOpen={isRewardedAdOpen} onClose={() => setIsRewardedAdOpen(false)} />
    </main>
  );
}
