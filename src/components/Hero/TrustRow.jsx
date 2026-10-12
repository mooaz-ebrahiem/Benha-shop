import './Hero.css';

const trustItems = [
  {
    label: 'Cash on delivery',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18m-13 5h4" />
      </>
    ),
  },
  {
    label: 'Nationwide shipping',
    icon: (
      <>
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7.5" cy="18" r="1.7" />
        <circle cx="18" cy="18" r="1.7" />
      </>
    ),
  },
  {
    label: 'Easy returns',
    icon: (
      <>
        <path d="M4 11a8 8 0 1 1 2 6" />
        <path d="M4 5v6h6m2-3v5l3 2" />
      </>
    ),
  },
];

export default function TrustRow() {
  return (
    <div className="hero-trust">
      <div className="hero-stats" aria-label="Store highlights">
        <div className="hero-stat">
          <strong>1200+</strong>
          <span>components</span>
        </div>
        <div className="hero-stat">
          <strong>24h</strong>
          <span>dispatch</span>
        </div>
        <div className="hero-stat">
          <strong>4.9/5</strong>
          <span>satisfaction</span>
        </div>
      </div>
      <ul className="hero-benefits" aria-label="Shopping benefits">
        {trustItems.map(({ label, icon }) => (
          <li key={label}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {icon}
            </svg>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
