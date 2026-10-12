import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import './Hero.css';

const FALLBACK_IMAGE = '/product-fallback.svg';

const formatCurrency = (price) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price);

const getBadge = (product) => {
  if (product.newArrival) return 'New';
  if (product.popular) return 'Best seller';
  if (product.discount) return `${product.discount}% off`;
  if (product.stock <= 10) return 'Low stock';
  return 'Featured';
};

export default function ProductCard({ product }) {
  const { addToCart } = useStore();

  const handleImageError = (event) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = FALLBACK_IMAGE;
  };

  return (
    <article className="hero-product-card">
      <span className="hero-product-badge">{getBadge(product)}</span>
      <Link className="hero-product-image" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          width="900"
          height="600"
          onError={handleImageError}
        />
      </Link>
      <div className="hero-product-info">
        <Link className="hero-product-name" to={`/product/${product.id}`}>
          {product.name}
        </Link>
        <div className="hero-product-purchase">
          <strong>{formatCurrency(product.price)}</strong>
          <button
            className="hero-add-button"
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L20 8H6" />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
              <path d="M13 6v6m-3-3h6" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
