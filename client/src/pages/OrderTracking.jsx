import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Package, Clock } from 'lucide-react';

const STATUS_STEPS = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('savorhub_orders');
    if (saved) {
      const orders = JSON.parse(saved);
      const found = orders.find((o) => o.id === orderId);
      setOrder(found || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="tracking-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          <ArrowLeft size={18} /> Back to Orders
        </button>

        <div className="tracking-header">
          <div>
            <h1>Order {order.id}</h1>
            <p className="order-date">
              <Clock size={16} />
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span className={`status-badge large ${isCancelled ? 'cancelled' : ''}`}>
            {order.status}
          </span>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="timeline-card">
            <h2>Order Progress</h2>
            <div className="timeline">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${
                      isCurrent ? 'current' : ''
                    }`}
                  >
                    <div className="timeline-dot">
                      {isCompleted ? <Check size={14} /> : index + 1}
                    </div>
                    <div className="timeline-label">{step}</div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="cancelled-message">
            <Package size={32} />
            <p>This order was cancelled.</p>
          </div>
        )}

        {/* Order Details */}
        <div className="tracking-details">
          <div className="details-card">
            <h2>Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="tracking-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="details-card">
            <h2>Order Info</h2>
            <div className="info-row">
              <span>Order Type</span>
              <span>{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            </div>
            <div className="info-row">
              <span>Payment</span>
              <span>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
              </span>
            </div>
            <div className="info-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="info-row">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="info-row">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="info-row total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="details-card">
            <h2>Customer</h2>
            <div className="info-row">
              <span>Name</span>
              <span>{order.customer.fullName}</span>
            </div>
            <div className="info-row">
              <span>Email</span>
              <span>{order.customer.email}</span>
            </div>
            <div className="info-row">
              <span>Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            {order.orderType === 'delivery' && (
              <>
                <div className="info-row">
                  <span>Address</span>
                  <span>
                    {order.customer.address}, {order.customer.city}
                  </span>
                </div>
                {order.customer.instructions && (
                  <div className="info-row">
                    <span>Instructions</span>
                    <span>{order.customer.instructions}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;