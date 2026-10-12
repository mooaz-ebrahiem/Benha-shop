import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BatteryCharging,
  Box,
  Cable,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Gauge,
  Grid2x2,
  Heart,
  Lightbulb,
  Link2,
  Menu,
  MessageCircle,
  Monitor,
  Plug,
  Radar,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  SwitchCamera,
  Wifi,
  Wrench,
  Zap,
  X,
} from 'lucide-react';
import './App.css';
import HeroSection from './components/Hero/HeroSection';
import { STORE_CONTACT, STORE_NAME, STORE_WHATSAPP_NUMBER } from './config/store';
import { demoOrders, productCategories, products } from './data/products';
import { useStore } from './context/StoreContext';

const PRODUCT_FALLBACK_IMAGE = '/product-fallback.svg';
const MAX_PRODUCT_PRICE = 3000;

const handleProductImageError = (event) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.src = PRODUCT_FALLBACK_IMAGE;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);

const buildWhatsAppMessage = ({ name, phone, governorate, address, notes, cartItems }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  const itemsText = cartItems
    .map(
      (item, index) => `${index + 1}x ${item.name} - EGP ${item.price * item.quantity}`,
    )
    .join('\n');

  return [
    'مرحبا، أود تقديم طلب:',
    '',
    'Customer Details:',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Address: ${governorate}, ${address}`,
    '',
    'Products:',
    itemsText,
    '',
    `Subtotal: EGP ${subtotal}`,
    `Total: EGP ${total}`,
    '',
    `Notes: ${notes || 'No additional notes'}`,
  ].join('\n');
};

const getProductById = (productId) => products.find((product) => product.id === productId);

const getCategoryLabel = (categoryName) =>
  productCategories.find((category) => category.name === categoryName)?.name || categoryName;

const categoryIconMap = {
  cpu: Cpu,
  wifi: Wifi,
  radar: Radar,
  battery: BatteryCharging,
  box: Box,
  plug: Plug,
  cable: Cable,
  grid: Grid2x2,
  settings2: Gauge,
  slidersHorizontal: SlidersHorizontal,
  switchCamera: SwitchCamera,
  lightbulb: Lightbulb,
  monitor: Monitor,
  circuitBoard: CircuitBoard,
  link2: Link2,
  wrench: Wrench,
};

function CategoryIcon({ iconName, size = 22 }) {
  const Icon = categoryIconMap[iconName] || Zap;
  return <Icon size={size} />;
}

function BrandLogo() {
  return (
    <Link to="/" className="brand-logo" aria-label="Tech Components home">
      <span className="brand-logo-mark" aria-hidden="true">
        <CircuitBoard size={22} strokeWidth={2.2} />
      </span>
      <span className="brand-text">
        <strong>{STORE_NAME}</strong>
      </span>
    </Link>
  );
}

function ProductCard({ product, showDescription = true, index = 0 }) {
  const { wishlist, addToCart, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () =>
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (isVisible) return undefined;
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { rootMargin: '0px 0px 40px 0px', threshold: 0.12 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <article
      ref={cardRef}
      className={`product-card ${isVisible ? 'is-visible' : ''}`}
      style={{ '--card-stagger': `${(index % 5) * 65}ms` }}
    >
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img
            src={product.image || PRODUCT_FALLBACK_IMAGE}
            alt={product.name}
            className="product-image"
            onError={handleProductImageError}
          />
        </Link>
        {product.discount ? <span className="discount-badge">-{product.discount}%</span> : null}
        <button
          type="button"
          className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => (isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id))}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-content">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-stock">{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
        </div>

        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3>{product.name}</h3>
        </Link>

        {showDescription ? <p className="product-description">{product.description}</p> : null}

        <div className="product-price-row">
          <div className="price-block">
            <span className="current-price">{formatCurrency(product.price)}</span>
            {product.oldPrice ? <span className="old-price">{formatCurrency(product.oldPrice)}</span> : null}
          </div>
        </div>

        <div className="product-actions">
          <button type="button" className="primary-button cart-button" onClick={() => addToCart(product)}>
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="secondary-button details-button">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, rightContent }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {rightContent}
    </div>
  );
}

function Navbar() {
  const { cartCount, wishlistCount } = useStore();
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBounced, setCartBounced] = useState(false);
  const previousCartCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount <= previousCartCount.current) {
      previousCartCount.current = cartCount;
      return undefined;
    }

    previousCartCount.current = cartCount;
    setCartBounced(true);
    const timeout = window.setTimeout(() => setCartBounced(false), 650);
    return () => window.clearTimeout(timeout);
  }, [cartCount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
    setMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Categories', to: '/#categories' },
    { label: 'Track Order', to: '/track-order' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>Electronics essentials, delivered across Egypt</span>
          <span className="announcement-highlight">Cash on Delivery</span>
        </div>
      </div>
      <div className="container topbar">
        <BrandLogo />

        <form className="header-search" onSubmit={handleSubmit}>
          <Search size={16} />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </form>

        <nav className="main-nav desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 ? <span className="badge-count">{wishlistCount}</span> : null}
          </Link>
          <Link to="/cart" className={`icon-button cart-icon-button ${cartBounced ? 'cart-bounced' : ''}`} aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 ? <span className={`badge-count ${cartBounced ? 'badge-popped' : ''}`}>{cartCount}</span> : null}
          </Link>
          <button type="button" className="icon-button mobile-menu-button" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mobile-nav-panel">
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} className="nav-link" onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function HomePage() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const heroProductIds = new Set(
    products
      .filter((product) => product.newArrival && !product.featured)
      .slice(0, 6)
      .map((product) => product.id),
  );
  const newArrivals = products
    .filter((product) => product.newArrival && !heroProductIds.has(product.id))
    .slice(0, 4);

  return (
    <main className="page-shell">
      <HeroSection />

      <section className="container section-block" id="categories">
        <SectionHeading
          eyebrow="Shop by category"
          title="Featured Categories"
          description="Find the right electronics for every build, test and innovation project."
        />
        <div className="category-grid">
          {productCategories.map((category) => (
            <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.name)}`} className="category-card">
              <span className="category-icon"><CategoryIcon iconName={category.icon} size={22} /></span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.productCount} products</p>
              </div>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <SectionHeading eyebrow="Popular picks" title="Best Sellers" description="Gateway components trusted by makers and engineers." />
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {newArrivals.length > 0 ? (
        <section className="container section-block">
          <SectionHeading eyebrow="Fresh stock" title="New Arrivals" description="Fresh additions for your next electronics project." />
          <div className="product-grid">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ShopPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(location.search).get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(MAX_PRODUCT_PRICE);
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const categoryFromUrl = params.get('category') || 'All';
    setSearchTerm(query);
    setSelectedCategory(categoryFromUrl);
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let nextProducts = products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags.some((tag) => tag.toLowerCase().includes(term));

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const matchesStock = !stockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    if (sortBy === 'popular') {
      nextProducts.sort((a, b) => Number(b.popular) - Number(a.popular));
    }
    if (sortBy === 'newest') {
      nextProducts.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    }
    if (sortBy === 'price-low') {
      nextProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      nextProducts.sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [searchTerm, selectedCategory, maxPrice, stockOnly, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxPrice(MAX_PRODUCT_PRICE);
    setStockOnly(false);
    setSortBy('popular');
  };

  return (
    <main className="page-shell container shop-page">
      <SectionHeading
        eyebrow="Shop all products"
        title="Industrial-grade parts and modules"
        description="Browse our component catalog designed for makers, educators and modern electronics teams."
      />

      <div className="shop-toolbar">
        <div className="filter-input-wrap">
          <Search size={16} />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search product name, category or tag"
          />
        </div>

        <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="All">All categories</option>
          {productCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="range"
          min="20"
          max={MAX_PRODUCT_PRICE}
          step="10"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price"
        />

        <label className="check-toggle">
          <input type="checkbox" checked={stockOnly} onChange={() => setStockOnly((value) => !value)} />
          In stock only
        </label>

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      <div className="shop-results-bar">
        <span>{filteredProducts.length} products</span>
        <span>Up to {formatCurrency(maxPrice)}</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products found.</h3>
          <button type="button" className="primary-button" onClick={resetFilters}>
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart, buyNow } = useStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="page-shell container empty-state">
        <h3>Product not found.</h3>
        <Link to="/shop" className="primary-button">
          Back to shop
        </Link>
      </main>
    );
  }

  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const relatedNeeds = ['Jumper wires', 'Breadboard', 'Sensors', 'USB cable'];
  const handleBuyNow = () => {
    if (buyNow(product, quantity)) {
      navigate('/checkout');
    }
  };

  return (
    <main className="page-shell container product-detail-page">
      <div className="product-detail-top">
        <div className="detail-image-wrap">
          <img
            src={product.image || PRODUCT_FALLBACK_IMAGE}
            alt={product.name}
            className="detail-image"
            onError={handleProductImageError}
          />
        </div>

        <div className="detail-info">
          <span className="section-eyebrow accent">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price-line">
            <span className="current-price large">{formatCurrency(product.price)}</span>
            {product.oldPrice ? <span className="old-price large">{formatCurrency(product.oldPrice)}</span> : null}
            {product.discount ? <span className="discount-badge">-{product.discount}%</span> : null}
          </div>
          <p className="product-description large">{product.description}</p>

          <div className="detail-stock-row">
            <span className={`stock-pill ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
            <span>SKU: {product.sku}</span>
          </div>

          <div className="detail-actions">
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button>
            </div>
            <button type="button" className="primary-button cart-button" onClick={() => addToCart(product, quantity)}>
              Add to Cart
            </button>
            <button type="button" className="secondary-button" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div className="detail-specs-grid">
            {Object.entries(product.specifications).map(([label, value]) => (
              <div key={label} className="spec-item">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-content-row">
        <div className="detail-panel">
          <h2>Product description</h2>
          <p>
            This {product.name.toLowerCase()} is designed for dependable electronic builds and prototyping.
            It combines compatibility, everyday reliability and easy integration for embedded DIY applications.
          </p>
        </div>

        <div className="detail-panel">
          <h2>Compatible boards & modules</h2>
          <ul className="compatible-list">
            {['Arduino Uno', 'ESP32', 'NodeMCU', 'Breadboard', 'Multiple sensor shields'].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="related-products section-block">
        <SectionHeading eyebrow="You may also need" title="Recommended add-ons" />
        <div className="product-grid small-grid">
          {relatedProducts.map((relatedProduct, index) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
          ))}
        </div>
      </section>

      <div className="need-list">
        {relatedNeeds.map((need) => (
          <div key={need} className="need-pill">{need}</div>
        ))}
      </div>
    </main>
  );
}

function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useStore();
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const total = subtotal;

  if (cart.length === 0) {
    return (
      <main className="page-shell container empty-state">
        <h3>Your cart is empty.</h3>
        <Link to="/shop" className="primary-button">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell container cart-page">
      <SectionHeading eyebrow="Cart" title="Your shopping cart" description="Review your selected electronics before checkout." />

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image || PRODUCT_FALLBACK_IMAGE}
                alt={item.name}
                className="cart-item-image"
                onError={handleProductImageError}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
              </div>
              <div className="quantity-control compact">
                <button type="button" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
              </div>
              <div className="cart-price">{formatCurrency(item.price * item.quantity)}</div>
              <button type="button" className="remove-button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Items</span><strong>{totalQuantity}</strong></div>
          <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <p className="delivery-note">Delivery cost will be confirmed with you after placing the order, depending on your location.</p>
          <Link to="/checkout" className="primary-button full-width">Proceed to Checkout</Link>
          <button type="button" className="secondary-button full-width" onClick={clearCart}>Clear cart</button>
        </aside>
      </div>
    </main>
  );
}

function CheckoutPage() {
  const { cart, setToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    address: '',
    notes: '',
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = buildWhatsAppMessage({
      ...formData,
      cartItems: cart,
    });

    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setToast('WhatsApp order form opened.');
  };

  if (cart.length === 0) {
    return (
      <main className="page-shell container empty-state">
        <h3>Your cart is empty. Add products before checkout.</h3>
        <Link to="/shop" className="primary-button">
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell container checkout-page">
      <SectionHeading eyebrow="Checkout" title="Confirm your order" description="No online payment yet — create a WhatsApp order request." />
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Customer name
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Phone number
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
            <label>
              Governorate
              <input type="text" name="governorate" value={formData.governorate} onChange={handleChange} required />
            </label>
            <label>
              Area / Address
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Notes (optional)
            <textarea name="notes" rows="4" value={formData.notes} onChange={handleChange} placeholder="Any details for the store owner?" />
          </label>

          <button type="submit" className="primary-button">
            Confirm Order
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.quantity}x {item.name}
              </span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <p className="delivery-note">Delivery cost will be confirmed with you after placing the order, depending on your location.</p>
        </aside>
      </div>
    </main>
  );
}

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();
    const match = demoOrders.find(
      (order) => order.id.toLowerCase() === orderId.trim().toLowerCase() && order.phone === phone.trim(),
    );
    setResult(match || 'not-found');
  };

  return (
    <main className="page-shell container track-page">
      <div className="track-card">
        <SectionHeading eyebrow="Track your order" title="Check order status" description="Demo data is included for now and can later be replaced by a real backend API." />

        <form className="track-form" onSubmit={onSubmit}>
          <label>
            Order ID
            <input type="text" value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
          </label>
          <label>
            Phone number
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </label>
          <button type="submit" className="primary-button">
            Track Order
          </button>
        </form>

        {result ? (
          result === 'not-found' ? (
            <div className="not-found-box">No matching order was found. Please check the order ID and phone number.</div>
          ) : (
            <div className="tracking-status">
              <div className="status-header">
                <span className="status-tag">{result.status}</span>
                <strong>{result.id}</strong>
              </div>
              <div className="progress-steps">
                {['Order Received', 'Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((state) => (
                  <div key={state} className={`step ${result.status === state || state === 'Order Received' ? 'active' : ''}`}>
                    {state}
                  </div>
                ))}
              </div>
              <ul>
                {result.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )
        ) : null}
      </div>
    </main>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page-shell container contact-page">
      <SectionHeading eyebrow="Contact" title="We’re here to help" description="Reach our support team for technical advice, bulk orders and delivery questions." />
      <div className="contact-layout">
        <div className="contact-panel info-panel">
          <div className="info-row">
            <span><MessageCircle size={18} /></span>
            <div>
              <strong>Phone</strong>
              <p>{STORE_CONTACT.phone}</p>
            </div>
          </div>
          <div className="info-row">
            <span><MessageCircle size={18} /></span>
            <div>
              <strong>WhatsApp</strong>
              <p>{STORE_CONTACT.whatsapp}</p>
            </div>
          </div>
          <div className="info-row">
            <span><Search size={18} /></span>
            <div>
              <strong>Email</strong>
              <p>{STORE_CONTACT.email}</p>
            </div>
          </div>
          <div className="info-row">
            <span><MapPinIcon /></span>
            <div>
              <strong>Location</strong>
              <p>{STORE_CONTACT.location}</p>
            </div>
          </div>
          <div className="social-row">
            <a href={STORE_CONTACT.socials.facebook}>Facebook</a>
            <a href={STORE_CONTACT.socials.instagram}>Instagram</a>
            <a href={STORE_CONTACT.socials.x}>X</a>
          </div>
        </div>

        <form className="contact-panel contact-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" placeholder="Your full name" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="Your email" required />
          </label>
          <label>
            Message
            <textarea rows="5" placeholder="Tell us how we can help" required />
          </label>
          <button type="submit" className="primary-button">Send Message</button>
          {submitted ? <p className="submit-note">Your message has been prepared for follow-up.</p> : null}
        </form>
      </div>
    </main>
  );
}

function WishlistPage() {
  const { wishlist, wishlistCount } = useStore();
  const wishlistProducts = wishlist.map((item) => getProductById(item)).filter(Boolean);

  if (wishlistProducts.length === 0) {
    return (
      <main className="page-shell container empty-state">
        <h3>Your wishlist is empty.</h3>
        <Link to="/shop" className="primary-button">
          Explore products
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell container">
      <SectionHeading eyebrow="Wishlist" title={`Saved items (${wishlistCount})`} description="Keep your favourite electronics in one place." />
      <div className="product-grid">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 21s6-6.64 6-12a6 6 0 1 0-12 0c0 5.36 6 12 6 12Zm0-9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function App() {
  const { toast, setToast } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <BrandLogo />
            <p>Modern electronics shopping for makers, installers and product teams.</p>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              {productCategories.slice(0, 5).map((category) => (
                <li key={category.id}><Link to={`/shop?category=${encodeURIComponent(category.name)}`}>{category.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Customer support</h4>
            <ul>
              <li>{STORE_CONTACT.phone}</li>
              <li>{STORE_CONTACT.email}</li>
              <li>{STORE_CONTACT.location}</li>
            </ul>
          </div>
        </div>
      </footer>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          <span>{toast}</span>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      ) : null}
    </>
  );
}

export default App;
