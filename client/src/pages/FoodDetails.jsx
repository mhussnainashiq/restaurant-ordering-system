import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Plus, Minus, ShoppingCart } from 'lucide-react';
import { menuItems } from '../data/menuData';
import { useCart } from '../context/CartContext';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const item = menuItems.find((food) => food.id === Number(id));

  if (!item) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Item not found</h2>
        <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Menu
        </Link>
      </div>
    );
  }

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(item, quantity);
    // Optional: go to cart after adding
    // navigate('/cart');
  };

  return (
    <div className="food-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="details-grid">
          {/* Image */}
          <div className="details-image">
            <img src={item.image} alt={item.name} />
            {item.isPopular && (
              <span className="badge popular">
                <Star size={12} /> Popular
              </span>
            )}
          </div>

          {/* Info */}
          <div className="details-info">
            <div className="details-header">
              <h1>{item.name}</h1>
              <span className="details-price">${item.price.toFixed(2)}</span>
            </div>

            <div className="details-meta">
              <span className="rating">
                <Star size={16} fill="#f4a261" color="#f4a261" />
                {item.rating}
              </span>
              <span>
                <Clock size={16} />
                {item.preparationTime} min
              </span>
              <span className={`veg-tag ${item.isVegetarian ? 'veg' : 'non-veg'}`}>
                {item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <p className="details-desc">{item.description}</p>

            <div className="ingredients">
              <h3>Ingredients</h3>
              <ul>
                {item.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="details-actions">
              <div className="quantity-selector">
                <button onClick={decreaseQty} disabled={quantity <= 1}>
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button onClick={increaseQty}>
                  <Plus size={18} />
                </button>
              </div>

              <button
                className="btn btn-primary add-cart-btn"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
              >
                <ShoppingCart size={18} />
                {item.isAvailable
                  ? `Add to Cart — $${(item.price * quantity).toFixed(2)}`
                  : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;