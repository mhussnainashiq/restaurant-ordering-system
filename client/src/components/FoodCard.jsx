import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

function FoodCard({ item }) {
  return (
    <div className={`food-card ${!item.isAvailable ? 'unavailable' : ''}`}>
      <Link to={`/menu/${item.id}`} className="food-card-link">
        <div className="food-card-image">
          <img src={item.image} alt={item.name} />
          {item.isPopular && (
            <span className="badge popular">
              <Star size={12} /> Popular
            </span>
          )}
          {item.isVegetarian && (
            <span className="badge veg">Veg</span>
          )}
          {!item.isAvailable && (
            <span className="badge unavailable-badge">Unavailable</span>
          )}
        </div>

        <div className="food-card-body">
          <div className="food-card-header">
            <h3>{item.name}</h3>
            <span className="food-price">${item.price.toFixed(2)}</span>
          </div>

          <p className="food-desc">{item.description}</p>

          <div className="food-card-meta">
            <span className="rating">
              <Star size={14} fill="#f4a261" color="#f4a261" />
              {item.rating}
            </span>
            <span className="time">
              <Clock size={14} />
              {item.preparationTime} min
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default FoodCard;