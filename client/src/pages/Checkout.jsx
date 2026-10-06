import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Tag } from 'lucide-react';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, tax, grandTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    instructions: '',
    orderType: 'delivery',
    paymentMethod: 'cod',
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ margin: '1rem 0' }}>Add some items before checking out.</p>
        <Link to="/menu" className="btn btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  // Calculate discount
  let discount = 0;
  if (appliedOffer) {
    if (appliedOffer.type === 'percentage') {
      discount = (subtotal * appliedOffer.value) / 100;
    } else {
      discount = appliedOffer.value;
    }
  }

  const finalDeliveryFee = form.orderType === 'delivery' ? deliveryFee : 0;
  const finalTotal = Math.max(0, subtotal - discount + finalDeliveryFee + tax);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const applyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    setAppliedOffer(null);

    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const offers = JSON.parse(localStorage.getItem('savorhub_offers') || '[]');
    const offer = offers.find(
      (o) => o.code === promoCode.trim().toUpperCase()
    );

    if (!offer) {
      setPromoError('Invalid promo code');
      return;
    }

    if (!offer.isActive) {
      setPromoError('This promo code is inactive');
      return;
    }

    // Check dates
    const today = new Date().toISOString().split('T')[0];
    if (offer.startDate && today < offer.startDate) {
      setPromoError('This promo code is not active yet');
      return;
    }
    if (offer.expiryDate && today > offer.expiryDate) {
      setPromoError('This promo code has expired');
      return;
    }

    // Check minimum order
    if (offer.minOrder > 0 && subtotal < offer.minOrder) {
      setPromoError(`Minimum order amount is $${offer.minOrder.toFixed(2)}`);
      return;
    }

    setAppliedOffer(offer);
    setPromoSuccess(`Promo applied! You saved $${(
      offer.type === 'percentage'
        ? (subtotal * offer.value) / 100
        : offer.value
    ).toFixed(2)}`);
  };

  const removePromo = () => {
    setAppliedOffer(null);
    setPromoCode('');
    setPromoSuccess('');
    setPromoError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';

    if (form.orderType === 'delivery') {
      if (!form.address.trim()) newErrors.address = 'Address is required';
      if (!form.city.trim()) newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    const number = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${number}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const order = {
      id: generateOrderId(),
      items: cartItems,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        instructions: form.instructions,
      },
      orderType: form.orderType,
      paymentMethod: form.paymentMethod,
      subtotal,
      deliveryFee: finalDeliveryFee,
      tax,
      discount,
      promoCode: appliedOffer ? appliedOffer.code : null,
      total: finalTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('savorhub_orders') || '[]');
    existingOrders.unshift(order);
    localStorage.setItem('savorhub_orders', JSON.stringify(existingOrders));

    clearCart();
    navigate(`/order-success/${order.id}`);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Left – Form */}
          <div className="checkout-form">
            {/* Order Type */}
            <div className="form-section">
              <h2>Order Type</h2>
              <div className="radio-group">
                <label className={`radio-card ${form.orderType === 'delivery' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={form.orderType === 'delivery'}
                    onChange={handleChange}
                  />
                  <span>Delivery</span>
                </label>
                <label className={`radio-card ${form.orderType === 'pickup' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={form.orderType === 'pickup'}
                    onChange={handleChange}
                  />
                  <span>Pickup</span>
                </label>
              </div>
            </div>

            {/* Contact */}
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 123 4567"
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Address */}
            {form.orderType === 'delivery' && (
              <div className="form-section">
                <h2>Delivery Address</h2>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && <span className="error">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>Additional Instructions (optional)</label>
                  <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    placeholder="Ring the doorbell, leave at door, etc."
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="radio-group">
                <label className={`radio-card ${form.paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className={`radio-card ${form.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span>Card (Dummy)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right – Summary + Promo */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="promo-section">
              <div className="promo-input-group">
                <Tag size={16} />
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={!!appliedOffer}
                />
                {appliedOffer ? (
                  <button type="button" className="promo-btn remove" onClick={removePromo}>
                    Remove
                  </button>
                ) : (
                  <button type="button" className="promo-btn" onClick={applyPromo}>
                    Apply
                  </button>
                )}
              </div>
              {promoError && <p className="promo-error">{promoError}</p>}
              {promoSuccess && <p className="promo-success">{promoSuccess}</p>}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount ({appliedOffer.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            {form.orderType === 'delivery' && (
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${finalDeliveryFee.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <Link to="/cart" className="back-to-cart">
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;