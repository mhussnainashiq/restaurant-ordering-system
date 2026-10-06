import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={72} color="#16a34a" strokeWidth={1.5} />
          </div>

          <h1>Order Confirmed!</h1>
          <p className="order-number">Order #: <strong>{orderId}</strong></p>

          <p className="success-message">
            Thank you for your order. We have received it and will start preparing it shortly.
          </p>

          <div className="estimated-time">
            <Clock size={20} />
            <span>Estimated time: <strong>30–45 minutes</strong></span>
          </div>

          <div className="success-actions">
            <Link to={`/orders`} className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/menu" className="btn btn-outline-dark">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;