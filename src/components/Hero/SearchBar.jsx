import { useState } from 'react';
import './Hero.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className="hero-search" role="search" onSubmit={handleSubmit}>
      <label className="hero-visually-hidden" htmlFor="hero-product-search">
        Search products
      </label>
      <svg className="hero-search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        id="hero-product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Arduino, sensors, batteries..."
        aria-label="Search electronics products"
      />
      <button className="hero-search-submit" type="submit" aria-label="Search products">
        Search
      </button>
    </form>
  );
}
