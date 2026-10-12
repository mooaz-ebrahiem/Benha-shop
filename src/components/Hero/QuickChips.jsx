import { productCategories } from '../../data/products';
import './Hero.css';

const quickChipCategories = [
  { label: 'Arduino', categoryId: 'arduino' },
  { label: 'ESP32', categoryId: 'esp32' },
  { label: 'Sensors', categoryId: 'sensors' },
  { label: 'Motors', categoryId: 'motors' },
  { label: 'Batteries', categoryId: 'batteries' },
  { label: 'Modules', categoryId: 'modules' },
];

export default function QuickChips({ onSelect }) {
  return (
    <nav className="hero-quick-chips" aria-label="Shop popular categories">
      {quickChipCategories.map(({ label, categoryId }) => {
        const category = productCategories.find((item) => item.id === categoryId);
        if (!category) return null;

        return (
          <button
            key={category.id}
            className="hero-chip"
            type="button"
            aria-label={`Browse ${category.name}`}
            onClick={() => onSelect(category.name)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
