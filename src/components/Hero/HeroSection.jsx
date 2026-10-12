import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import QuickChips from './QuickChips';
import SearchBar from './SearchBar';
import TrustRow from './TrustRow';
import './Hero.css';

const heroProducts = products.filter((product) => product.newArrival && !product.featured).slice(0, 6);

export default function HeroSection() {
  const navigate = useNavigate();

  const searchProducts = (query) => {
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  const browseCategory = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="hero-redesign" aria-labelledby="hero-title">
      <div className="hero-main container">
        <div className="hero-copy">
          <span className="section-eyebrow accent">SMART ELECTRONICS ESSENTIALS</span>
          <h1 id="hero-title">
            All Your <span className="hero-title-gradient">Arduino &amp; ESP32</span> Parts in One Place
          </h1>
          <p>Fast delivery across Egypt. Cash on delivery available.</p>

          <SearchBar onSearch={searchProducts} />
          <QuickChips onSelect={browseCategory} />

          <div className="hero-actions">
            <Link className="hero-shop-button" to="/shop">
              Shop Now
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link className="hero-category-link" to="/#categories">
              Explore Categories
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <TrustRow />
        </div>

        <div className="hero-product-grid" aria-label="Featured products">
          {heroProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
