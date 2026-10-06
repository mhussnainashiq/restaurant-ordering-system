import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { menuItems, categories } from '../data/menuData';

function Menu() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // all | veg | non-veg
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Vegetarian filter
    if (vegFilter === 'veg') {
      result = result.filter((item) => item.isVegetarian);
    } else if (vegFilter === 'non-veg') {
      result = result.filter((item) => !item.isVegetarian);
    }

    // Price
    result = result.filter((item) => item.price <= priceRange);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, selectedCategory, vegFilter, sortBy, priceRange]);

  return (
    <div className="menu-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Our Menu</h1>
          <p>Discover delicious food made with love</p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="menu-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
          {/* Categories */}
          <div className="filter-group">
            <label>Category</label>
            <div className="category-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Veg / Non-veg */}
          <div className="filter-group">
            <label>Dietary</label>
            <div className="category-chips">
              <button
                className={`chip ${vegFilter === 'all' ? 'active' : ''}`}
                onClick={() => setVegFilter('all')}
              >
                All
              </button>
              <button
                className={`chip ${vegFilter === 'veg' ? 'active' : ''}`}
                onClick={() => setVegFilter('veg')}
              >
                Vegetarian
              </button>
              <button
                className={`chip ${vegFilter === 'non-veg' ? 'active' : ''}`}
                onClick={() => setVegFilter('non-veg')}
              >
                Non-Vegetarian
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Max Price: ${priceRange}</label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="results-count">
          Showing <strong>{filteredItems.length}</strong> items
        </p>

        {/* Food Grid */}
        {filteredItems.length > 0 ? (
          <div className="food-grid">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No items found</h3>
            <p>Try changing your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;