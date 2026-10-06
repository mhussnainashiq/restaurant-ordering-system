import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    currency,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} strokeWidth={1.5} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven’t added any items yet.</p>
            <Link to="/menu" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{cartItems.length} item(s) in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">
                    {formatPrice(item.price, currency)} each
                  </p>
                </div>

                <div className="cart-item-qty">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity, currency)}
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{formatPrice(deliveryFee, currency)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatPrice(tax, currency)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal, currency)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </Link>

            <Link to="/menu" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;