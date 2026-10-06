import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders
  useEffect(() => {
    const saved = localStorage.getItem('savorhub_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('savorhub_orders', JSON.stringify(newOrders));
  };

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrders(updated);

    // Also update the selected order if modal is open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
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

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h1>Order Management</h1>
          <p>View and update customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="admin-search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filters">
          <button
            className={`filter-chip ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                className={`filter-chip ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>
                      <div>{order.customer.fullName}</div>
                      <small style={{ color: '#6b7280' }}>{order.customer.phone}</small>
                    </td>
                    <td>{order.items.length} item(s)</td>
                    <td>
                      <strong>${order.total.toFixed(2)}</strong>
                    </td>
                    <td>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ borderColor: getStatusColor(order.status) }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order {selectedOrder.id}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Status</h3>
                <select
                  className="status-select large"
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="detail-section">
                <h3>Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.customer.fullName}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                {selectedOrder.orderType === 'delivery' && (
                  <>
                    <p>
                      <strong>Address:</strong> {selectedOrder.customer.address},{' '}
                      {selectedOrder.customer.city}
                    </p>
                    {selectedOrder.customer.instructions && (
                      <p>
                        <strong>Instructions:</strong>{' '}
                        {selectedOrder.customer.instructions}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="detail-item">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h3>Payment Summary</h3>
                <div className="detail-item">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.deliveryFee > 0 && (
                  <div className="detail-item">
                    <span>Delivery Fee</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span>Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="detail-item total">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  Payment: {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'} |
                  Type: {selectedOrder.orderType}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;