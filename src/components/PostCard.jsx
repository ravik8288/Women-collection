import { Link } from "react-router-dom";
import { getCategory } from "../data/posts";
export default function PostCard({post, categoryCard = false}){
  const categoryName = getCategory(post.category)?.name || post.category;
  return <article className={`product-card${categoryCard ? " category-product-card" : ""}`}><Link className="product-image" to={`/product/${post.slug}`}><span>{categoryCard ? categoryName : "Featured"}</span><img src={post.image} alt={post.name}/></Link>
  {!categoryCard && <p className="eyebrow">{categoryName}</p>}<h3>{post.name}</h3><div className="card-row"><strong>₹{post.price}</strong><Link to={`/product/${post.slug}`}>View Look <span>→</span></Link></div></article>
}
