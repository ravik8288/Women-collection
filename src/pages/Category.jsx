import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { products } from "../data/posts";

export default function Category() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const matches = products.filter((product) => product.category === slug);
  const categoryProducts = matches.length ? matches : products;
  const pageCount = Math.ceil(categoryProducts.length / 4);
  const visible = categoryProducts.slice((page - 1) * 4, page * 4);

  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  function selectPage(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="category-page container">
      <div className="product-grid category-product-grid">
        {visible.map((product) => <PostCard categoryCard key={product.slug} post={product} />)}
      </div>
      <nav className="category-pagination" aria-label="Category pages">
        <button disabled={page === 1} onClick={() => selectPage(page - 1)}>‹ Prev</button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <button className={page === number ? "active" : ""} key={number} onClick={() => selectPage(number)}>{number}</button>
        ))}
        <button disabled={page === pageCount} onClick={() => selectPage(page + 1)}>Next</button>
      </nav>
    </main>
  );
}
