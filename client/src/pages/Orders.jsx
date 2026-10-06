import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, RotateCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Orders() {
  const [orders, setOrders] = useState([]);
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('savorhub_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load orders', err);
      }
    }
  }, []);

  const handleReorder = (order) => {
    // Clear current cart and add previous items
    clearCart();
    order.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#f59e0b',
      Confirmed: '#3b82f6',
      Preparing: '#8b5cf6',
      Ready: '#06b6d4',
      'Out for Delivery': '#f97316',
      Delivered: '#16a34a',
      Cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="page-header">
            <h1>My Orders</h1>
          </div>
          <div className="empty-state">
            <Package size={64} strokeWidth={1.5} />
            <h2>No orders yet</h2>
            <p>You haven’t placed any orders. Start exploring our menu!</p>
            <Link to="/menu" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and reorder your previous meals</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>{order.id}</h3>
                  <p className="order-date">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id} className="preview-item">
                    {item.quantity}× {item.name}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="preview-more">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  Total: <strong>${order.total.toFixed(2)}</strong>
                </div>

                <div className="order-actions">
                  <button
                    className="btn-reorder"
                    onClick={() => handleReorder(order)}
                  >
                    <RotateCcw size={16} />
                    Order Again
                  </button>

                  <Link
                    to={`/orders/${order.id}`}
                    className="btn-view-details"
                  >
                    Track Order <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;