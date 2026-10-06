import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { restaurantInfo, categories, featuredDishes } from '../data/restaurantData';

function Home() {
  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>
              Delicious Food <br />
              <span>Delivered Fast</span>
            </h1>
            <p>
              Order your favorite meals from {restaurantInfo.name}.  
              Fresh ingredients, amazing taste, and quick delivery.
            </p>
            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary">
                Order Now <ArrowRight size={18} />
              </Link>
              <Link to="/menu" className="btn btn-outline">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>Explore our delicious selection</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to="/menu" key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.name} />
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <span>{cat.count} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DISHES ===== */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Dishes</h2>
            <p>Our customers’ favorites</p>
          </div>

          <div className="dishes-grid">
            {featuredDishes.map((dish) => (
              <div key={dish.id} className="dish-card">
                <div className="dish-image">
                  <img src={dish.image} alt={dish.name} />
                  {dish.popular && (
                    <span className="badge popular">
                      <Star size={12} /> Popular
                    </span>
                  )}
                </div>
                <div className="dish-body">
                  <h3>{dish.name}</h3>
                  <p className="dish-desc">{dish.description}</p>
                  <div className="dish-footer">
                    <span className="price">${dish.price.toFixed(2)}</span>
                    <Link to="/menu" className="btn btn-sm">
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/menu" className="btn btn-primary">
              View Full Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <h2>Hungry? Order in minutes</h2>
          <p>Fresh food, fast delivery, and exclusive offers waiting for you.</p>
          <Link to="/menu" className="btn btn-white">
            Start Ordering
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;